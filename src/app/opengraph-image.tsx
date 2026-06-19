import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 80,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        cotonou<span style={{ color: "#16A34A" }}>.events</span>
      </div>

      <div style={{ marginTop: 24, fontSize: 30, color: "#6B7280" }}>
        Les meilleurs événements de Cotonou, chaque vendredi sur WhatsApp
      </div>
    </div>,
    { ...size },
  );
}
