import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ngaru Pou — Māori Cultural Arts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050a1c",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* Teal accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #2ca3bb, #3cbca7)",
          }}
        />

        {/* Site name */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "-1px",
          }}
        >
          Ngaru Pou
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#2ca3bb",
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Māori Cultural Arts
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            color: "rgba(255,255,255,0.35)",
            fontSize: 20,
            letterSpacing: "0.08em",
          }}
        >
          ngarupou.org.au
        </div>
      </div>
    ),
    { ...size },
  );
}
