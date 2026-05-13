import Link from "next/link";
import { Manrope } from "next/font/google";
import ModelViewer from "../../components/ModelViewer";
import styles from "./modelViewer.module.css";

const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${styles.mainContainer} ${manrope.className}`}>
      <p className={styles.instructionText}>
        Interagisici con l`oggetto per ruotarlo
      </p>

      <div className={styles.buttonWrapper}>
        <Link href="/" className={styles.backButton}>
          ← Torna allo scanner
        </Link>
      </div>

      <ModelViewer
        src="/models/TV-anim.glb"
        alt="Un modello 3D interattivo del mio oggetto"
      />
    </main>
  );
}
