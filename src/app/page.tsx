"use client";

import styles from "./scanner.module.css";
import { useQrScanner } from "./useQrScanner";

export default function Page() {
  const { videoRef, state, qrData, newScan } = useQrScanner();

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
      />

      <div className={styles.overlay}>
        <div>
          <span
            className={`${styles.statusBadge} ${
              qrData ? styles.statusSuccess : ""
            }`}
          >
            {state}
          </span>
        </div>

        {qrData && (
          <div className={styles.resultBox}>
            <h3 style={{ color: "#fff", margin: "0 0 10px 0" }}>
              QR Decodificato!
            </h3>
            <p
              style={{
                color: "#aaa",
                fontSize: "14px",
                wordBreak: "break-all",
              }}
            >
              <strong>URL:</strong> {qrData.originalUrl}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#fff" }}>Parametri trovati:</strong>
              {Object.keys(qrData.parameters).length > 0 ? (
                <ul
                  style={{
                    color: "#0f0",
                    margin: "10px 0 0 0",
                    paddingLeft: "20px",
                  }}
                >
                  {Object.entries(qrData.parameters).map(([chiave, valore]) => (
                    <li key={chiave}>
                      <b>{chiave}</b>: {valore}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  Nessun parametro presente.
                </p>
              )}
            </div>

            <button onClick={newScan} className={styles.button}>
              Scansiona un altro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
