export type Vector3 = [number, number, number];

export interface ARConfig {
  markerType: "pattern" | "preset";
  markerUrl: string;
  modelUrl: string;
  scale: Vector3;
  rotation: Vector3;
  position: Vector3;
}
