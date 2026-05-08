"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Manrope } from "next/font/google";
import { ARConfig, AROffsets, CustomAnimation } from "@/types/ar";
import {
  buildARQueryString,
  getAdjustedARConfig,
  useIframeMessage,
} from "@/utils/arHelper";
import { BASE_PATH } from "@/utils/configHelper";

import styles from "./glacierInTime.module.css";

// Font initialization
const manrope = Manrope({ subsets: ["latin"] });

// Reveal animation
const revealAnimation: CustomAnimation = {
  name: "reveal",
  config: {
    type: "clip-z",
    duration: 6000,
    min: -1500,
    max: 0,
  },
};

const baseConfig: ARConfig = {
  markerType: "nft",
  markerUrl: `${BASE_PATH}/nft/glacier-in-time/glacier-in-time-target`,
  modelUrl: `${BASE_PATH}/models/glacier-in-time/Wrapper.gltf`,
  scale: [250, 250, 250],
  rotation: [0, 180, 0],
  position: [125, 0, -180],
  enableInteraction: false,
  customAnimation: revealAnimation,
};

const IOS_OFFSETS: AROffsets = {
  x: -40,
  y: 0,
  z: 0,
};

const markerImageUrl = `${BASE_PATH}/models/glacier-in-time/Marker.jpg`;

export default function GlacierInTimePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [animations, setAnimations] = useState<string[]>([]);
  const [, setActiveAnim] = useState<string | null>(null);
  const [isMarkerFound, setIsMarkerFound] = useState<boolean>(false);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);

  const config = getAdjustedARConfig(baseConfig, IOS_OFFSETS);

  let iframeSrc = `${BASE_PATH}/nft-ar.html?${buildARQueryString(config)}`;
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
    if (isMarkerFound && !animationStarted) {
      const firstAnim = animations.length > 0 ? animations[0] : "";
      if (firstAnim) setActiveAnim(firstAnim);

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
        src={markerImageUrl}
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
