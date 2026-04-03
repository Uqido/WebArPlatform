"use client";

import Link from "next/link";

export default function Demo1Page() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 20px",
          zIndex: 10,
          fontFamily: "sans-serif",
          pointerEvents: "none",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "10px",
              color: "#0f0",
              textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
              marginTop: 0,
            }}
          >
            AR Active!
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#fff",
              textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
              margin: 0,
            }}
          >
            Inquadra il marker Hiro o Kanji.
          </p>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            pointerEvents: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          ← Back to the scanner
        </Link>
      </div>

      {/* --- IFRAME AR.JS IN BACKGROUND --- */}
      <iframe
        src="/marker-ar.html"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 1,
        }}
        allow="camera; gyroscope; accelerometer; magnetometer; vr;"
        title="AR Scanner"
      />
    </div>
  );
}
