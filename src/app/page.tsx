"use client";

import { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import styles from "./style.module.css";
import { useQrScanner } from "../utils/useQrScanner";

// Manrope font configuration
const manrope = Manrope({ subsets: ["latin"] });

export default function Page() {
  const { videoRef, status, message, qrData, startCamera } = useQrScanner();
  const [isScanning, setIsScanning] = useState(false);

  // 1. Trigger startCamera ONLY after the DOM has updated and the video is mounted
  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    // We intentionally omit startCamera from the dependency array to avoid
    // infinite loops if the hook doesn't heavily memoize the function.
  }, [isScanning]);

  const handleStartCamera = () => {
    setIsScanning(true);
  };

  const isError = status === "error";

  // If is not scanning, show the landing page.
  if (!isScanning) {
    return (
      <div className={`${styles.landingContainer} ${manrope.className}`}>
        <h1 className={styles.landingTitle}>Piattaforma WebAR di Uqido</h1>
        <p className={styles.landingText}>
          Premi il pulsante e inquadra il QR code per accedere ai contenuti AR
        </p>
        <button onClick={handleStartCamera} className={styles.button}>
          Attiva la camera
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${manrope.className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
      />

      <div className={styles.overlay}>
        <div className={styles.statusWrapper}>
          <span
            className={`
              ${styles.statusBadge} 
              ${qrData ? styles.statusSuccess : ""} 
              ${isError ? styles.statusError : ""}
            `.trim()}
          >
            {message}
          </span>

          {/* Render a Retry/Back button if the camera fails */}
          {isError && (
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Go Back / Retry
            </button>
          )}
        </div>

        {qrData && (
          <div className={styles.resultBox}>
            <h3 className={styles.resultSuccessTitle}>✓ Read correctly!</h3>
            <p className={styles.resultHint}>Automatic reset in 2 seconds...</p>
            <p className={styles.resultUrl}>
              <strong>URL:</strong> {qrData.originalUrl}
            </p>

            <div className={styles.resultParamsContainer}>
              <strong className={styles.resultParamsTitle}>
                Parameters found:
              </strong>
              {Object.keys(qrData.parameters).length > 0 ? (
                <ul className={styles.resultParamsList}>
                  {Object.entries(qrData.parameters).map(([key, value]) => (
                    <li key={key}>
                      <b>{key}</b>: {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.resultHint}>No parameter founded.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
