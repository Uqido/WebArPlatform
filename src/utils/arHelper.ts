import { ARConfig } from "@/types/ar";

export function buildARQueryString(config: ARConfig): string {
  return new URLSearchParams({
    markerType: config.markerType,
    markerUrl: config.markerUrl, //Url or preset type es. "hiro"
    modelUrl: config.modelUrl,
    scale: config.scale.join(" "),
    rotation: config.rotation.join(" "),
    position: config.position.join(" "),
    particleEffectName: config.particleEffectName ?? "",
  }).toString();
}
