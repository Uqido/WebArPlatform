import { RefObject } from "react";

export type Vector3 = [number, number, number];

export interface ARConfig {
  markerType: "pattern" | "preset";
  markerUrl: string;
  modelUrl: string;
  scale: Vector3;
  rotation: Vector3;
  position: Vector3;
  particleEffectName?: string;
}

export interface UseIframeMessageProps {
  setIsMarkerFound: (found: boolean) => void;
  setAnimations: (animations: string[]) => void;
  setActiveAnim: (anim: string | null) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
}
