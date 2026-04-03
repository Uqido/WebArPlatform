// useQrScanner.ts
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

// Define authorized IDs here
const ALLOWED_IDS = ["demo1", "demoTrex"];

export function useQrScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const hasRequested = useRef(false);

  // Guard to prevent multiple scans/redirects while processing
  const isProcessing = useRef(false);

  const [state, setState] = useState<string>("Waiting for camera...");
  const [qrData, setQrData] = useState<{
    originalUrl: string;
    parameters: Record<string, string>;
  } | null>(null);

  const scanFrame = () => {
    const video = videoRef.current;

    // Skip frame if processing or video not ready
    if (
      isProcessing.current ||
      !video ||
      video.readyState !== video.HAVE_ENOUGH_DATA
    ) {
      requestRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    if (!canvasRef.current)
      canvasRef.current = document.createElement("canvas");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        analyzeUrl(code.data);
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  };

  const analyzeUrl = (qrString: string) => {
    try {
      const correctUrl = new URL(qrString);
      const parameters = Object.fromEntries(correctUrl.searchParams.entries());
      const id = correctUrl.searchParams.get("id");

      if (id) {
        // Validate the ID against the whitelist
        if (ALLOWED_IDS.includes(id)) {
          isProcessing.current = true;
          setState(`ID "${id}" verified! Redirecting...`);

          // Stop animation before navigating
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          router.push(`/${id}`);
          return;
        } else {
          // ID found but not authorized
          setState(`Access Denied: ID "${id}" is not valid.`);
          setQrData({ originalUrl: qrString, parameters });

          // Briefly pause to show the error before allowing next scan
          pauseScanner();
          return;
        }
      }

      setState("QR detected but no ID parameter found.");
      setQrData({ originalUrl: qrString, parameters });
      pauseScanner();
    } catch (err) {
      setState("QR does not contain a valid URL.");
      setQrData({ originalUrl: qrString, parameters: {} });
      pauseScanner();
    }
  };

  // Helper to create a cooldown between scans
  const pauseScanner = () => {
    isProcessing.current = true;
    setTimeout(() => {
      isProcessing.current = false;
      setState("Scanning...");
    }, 1500);
  };

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setState(
            "Camera API blocked or not supported. Check HTTPS/localhost.",
          );
          return;
        }

        // 1. Check if the device is mobile (smartphone or tablet)
        // Checks the user agent and if the device has a touch screen (useful for modern iPads)
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ) || navigator.maxTouchPoints > 0;

        // 2. Set the video constraints based on the device type
        // If it's a mobile device, request the rear camera ("environment")
        // If it's a desktop (e.g., Mac), just pass "true" to get any available webcam
        const videoConstraints = isMobile
          ? { facingMode: { ideal: "environment" } }
          : true;

        // 3. Request camera access with the targeted constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // Crucial for iOS autoplay
          await videoRef.current.play();

          setState("Scanning...");
          requestRef.current = requestAnimationFrame(scanFrame);
        }
      } catch (err) {
        // If the error is NotFoundError, it means the Mac or PC
        // physically doesn't have a webcam connected, allowed, or enabled.
        if (err instanceof DOMException && err.name === "NotFoundError") {
          setState("Error: No camera found on this device.");
        } else if (err instanceof Error) {
          setState(`Camera error: ${err.message}`);
        }
        console.error("getUserMedia error:", err);
      }
    };

    startCamera();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, state, qrData };
}
