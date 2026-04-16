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
