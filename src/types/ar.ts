import { RefObject } from "react";

export type Vector3 = [number, number, number];

export interface ARConfig {
  markerType: "nft" | "pattern" | "preset";
  markerUrl: string; //Url or preset type es. "hiro"
  modelUrl: string;
  scale: Vector3;
  rotation: Vector3;
  position: Vector3;
  particleEffectName?: string; //Effect to load, if any
  enableInteraction: boolean; //Wheter the user can interact with the model
}

export interface UseIframeMessageProps {
  setIsMarkerFound: (found: boolean) => void;
  setAnimations: (animations: string[]) => void;
  setActiveAnim: (anim: string | null) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
}

export interface AROffsets {
  x: number;
  y: number;
  z: number;
}
