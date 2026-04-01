import Link from "next/link";

export default function Demo1Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "15px", color: "#0f0" }}>
        Successo!
      </h1>

      <p style={{ fontSize: "1.2rem", marginBottom: "40px", color: "#aaa" }}>
        Sei atterrato nella pagina Demo 1. <br />
        Il redirect automatico dal QR Code ha funzionato perfettamente!
      </p>

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
        }}
      >
        ← Torna allo Scanner
      </Link>
    </div>
  );
}
