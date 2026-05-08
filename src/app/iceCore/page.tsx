"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Manrope } from "next/font/google";
import { ARConfig, AROffsets } from "@/types/ar";
import {
  buildARQueryString,
  getAdjustedARConfig,
  useIframeMessage,
} from "@/utils/arHelper";
import styles from "./iceCore.module.css";

const manrope = Manrope({ subsets: ["latin"] });

export default function IceCorePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [animations, setAnimations] = useState<string[]>([]);
  const [, setActiveAnim] = useState<string | null>(null);
  const [isMarkerFound, setIsMarkerFound] = useState<boolean>(false);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);

  const baseConfigNft: ARConfig = {
    markerType: "nft",
    markerUrl: "./nft/ice-core-marker/Carota_SingleMarker_LowRes_300dpi",
    modelUrl: "/models/ice-core/Wrapper.gltf",
    scale: [1.5, 1.5, 1.5],
    rotation: [80, 180, 0],
    position: [135, 0, -125],
    enableInteraction: true,
  };

  const IOS_OFFSETS: AROffsets = {
    x: -40,
    y: 0,
    z: 0,
  };

  const config = getAdjustedARConfig(baseConfigNft, IOS_OFFSETS);

  let iframeSrc = `/nft-ar.html?${buildARQueryString(config)}`;

  if (process.env.NODE_ENV === "development") {
    iframeSrc += `&debug=1`;
  }

  // Listen for events from iframe
  useIframeMessage({
    setIsMarkerFound,
    setAnimations,
    setActiveAnim,
    iframeRef,
  });

  const changeAnimation = (animationName: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CHANGE_ANIMATION", clip: animationName },
        "*",
      );
    }
  };

  const handleScreenTouch = () => {
    if (isMarkerFound && !animationStarted && animations.length > 0) {
      const firstAnim = animations[0];
      setActiveAnim(firstAnim);
      changeAnimation(firstAnim);
      setAnimationStarted(true);
    }
  };

  return (
    <div className={`${styles.container} ${manrope.className}`}>
      {/* Invisible overlay to capture the click*/}
      {isMarkerFound && !animationStarted && (
        <div onClick={handleScreenTouch} className={styles.clickOverlay} />
      )}

      {/* Overlay image - L'opacità rimane inline perché dinamica */}
      <Image
        src="/models/ice-core/Marker.jpg"
        alt="Inquadra questa immagine"
        width={512}
        height={1024}
        className={styles.markerImage}
        style={{ opacity: isMarkerFound ? 0 : 0.4 }}
        priority
      />

      <div className={styles.uiContainer}>
        <div className={styles.textGroup}>
          {!isMarkerFound && (
            <p className={styles.instructionText}>Frame the image to start</p>
          )}

          {isMarkerFound && !animationStarted && (
            <div className={styles.pulseText}>Tocca per iniziare</div>
          )}
        </div>

        {/* Go back button */}
        <div className={styles.bottomGroup}>
          <Link href="/" className={styles.backButton}>
            ← Back to the scanner
          </Link>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className={styles.iframeStyle}
        allow="camera; gyroscope; accelerometer; magnetometer; vr;"
        title="AR Scanner"
      />
    </div>
  );
}
