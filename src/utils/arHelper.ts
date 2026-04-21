import { ARConfig, UseIframeMessageProps } from "@/types/ar";
import { useEffect } from "react";

export function buildARQueryString(config: ARConfig): string {
  return new URLSearchParams({
    markerType: config.markerType,
    markerUrl: config.markerUrl,
    modelUrl: config.modelUrl,
    scale: config.scale.join(" "),
    rotation: config.rotation.join(" "),
    position: config.position.join(" "),
    particleEffectName: config.particleEffectName ?? "",
    enableInteraction: config.enableInteraction.toString(),
  }).toString();
}

/**
 * Offeset to center the model on the image on Iphone14 pro.
 *
 * TODO: Try on other devices if the offset is still valid or change.
 *
 */
const IOS_OFFSETS = {
  x: 40,
  y: 0,
  z: 0,
};

/**
 * Starting from the assumption that the original position is defined in android.
 * Adjust position for ios (?)
 *
 * With Pixel 7 center the model on the image. The offset should place the image on the center also on the iphone (14 Pro)
 */
export function getAdjustedARConfig(baseConfig: ARConfig): ARConfig {
  if (typeof window === "undefined") return baseConfig;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    return {
      ...baseConfig,
      position: [
        baseConfig.position[0] - IOS_OFFSETS.x,
        baseConfig.position[1] - IOS_OFFSETS.y,
        baseConfig.position[2] - IOS_OFFSETS.z,
      ] as [number, number, number],
    };
  }

  return baseConfig;
}

//TODO: flag for autoplay
export function useIframeMessage({
  setIsMarkerFound,
  setAnimations,
  setActiveAnim,
  iframeRef,
}: UseIframeMessageProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === "MARKER_STATE") {
          setIsMarkerFound(event.data.isFound);
        } else if (event.data.type === "ANIMATIONS_LOADED") {
          const loadedAnimations = event.data.animations;
          setAnimations(loadedAnimations);

          // Set first animation as defaults
          // if (loadedAnimations.length > 0) {
          //   const firstAnim = loadedAnimations[0];
          //   setActiveAnim(firstAnim);

          //   // Play the first animation
          //   if (iframeRef.current && iframeRef.current.contentWindow) {
          //     iframeRef.current.contentWindow.postMessage(
          //       { type: "CHANGE_ANIMATION", clip: firstAnim },
          //       "*",
          //     );
          //   }
          // }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setIsMarkerFound, setAnimations, setActiveAnim, iframeRef]);
}
