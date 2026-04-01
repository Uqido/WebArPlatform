// useQrScanner.ts
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

export function useQrScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const hasRequested = useRef(false);

  const [state, setState] = useState<string>("In attesa di avvio...");
  const [qrData, setQrData] = useState<{ originalUrl: string; parameters: Record<string, string> } | null>(null);

  const scanFrame = () => {
    const video = videoRef.current;
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

        if (code) {
          analyzeUrl(code.data);
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  };

  const analyzeUrl = (qrString: string) => {
    try {
      const correctUrl = new URL(qrString);
      const parametersOggetto = Object.fromEntries(correctUrl.searchParams.entries());
            
      // Prendiamo qualsiasi cosa ci sia scritto dopo ?id=
      const id = correctUrl.searchParams.get("id"); 

      // Se il parametro "id" esiste (non è vuoto o null)
      if (id) {
        setState(`Parametro id=${id} trovato! Reindirizzamento in corso...`);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        
        // Reindirizziamo dinamicamente in base a ciò che c'è scritto nel QR!
        // Es: se il QR è "Sito.com?id=segreto", ti manderà su "/segreto"
        router.push(`/${id}`); 
        return;
      }
      setState("QR Trovato!");
      setQrData({ originalUrl: qrString, parameters: parametersOggetto });
    } catch (err) {
      setState("Il QR non contiene un URL valido.");
      setQrData({ originalUrl: qrString, parameters: {} });
    }
  };

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setState("API bloccata dal browser.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: "environment" } } });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setState("Scansione in corso...");
          requestRef.current = requestAnimationFrame(scanFrame);
        }
      } catch (err) {
        if (err instanceof Error) setState(`Errore: ${err.name}`);
      }
    };

    startCamera();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const newScan = () => {
    setQrData(null);
    setState("Scansione in corso...");
    requestRef.current = requestAnimationFrame(scanFrame);
  };

  return { videoRef, state, qrData, newScan };
}