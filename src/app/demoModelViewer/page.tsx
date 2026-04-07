import ModelViewer from "../../components/ModelViewer";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Visualizzatore 3D in Next.js (App Router)</h1>
      <p>Trascina il mouse per ruotare l`oggetto.</p>

      <ModelViewer
        src="/models/tv_model/scene.gltf"
        alt="Un modello 3D interattivo del mio oggetto"
      />
    </main>
  );
}
