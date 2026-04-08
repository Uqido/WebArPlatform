// components/ModelViewer.jsx
"use client";

import { useEffect } from "react";

const ModelViewer = ({ src, alt }) => {
  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <model-viewer
        //src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        src={src}
        alt={alt}
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto" // Autoscale the 3d model (?)
        shadow-intensity="1"
        style={{ width: "100%", height: "100%" }}
      ></model-viewer>
    </div>
  );
};

export default ModelViewer;
