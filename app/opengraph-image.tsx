import { ImageResponse } from "next/og";

export const alt = "Upforge Studio, software development company in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image (pages without their own image use this). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 0%, #174469 0%, #04183a 55%, #00041c 100%)", color: "#f9fcff" }}>
        <svg width="120" height="120" viewBox="0 0 64 64" style={{ marginBottom: 34 }}>
          <path d="M8 18H20V40A12 12 0 0 0 44 40V12L56 4V40A24 24 0 0 1 8 40Z" fill="#C6DCF0" />
          <path d="M32 18.5l6 6-6 6-6-6z" fill="#F0A06C" />
        </svg>
        <div style={{ fontSize: 76, letterSpacing: 24, fontWeight: 700, fontFamily: "sans-serif", marginRight: -24 }}>UPFORGE</div>
        <div style={{ fontSize: 22, letterSpacing: 12, color: "#7d81b5", marginTop: 18, fontFamily: "sans-serif" }}>SOFTWARE COMPANY · SRI LANKA</div>
        <div style={{ fontSize: 22, letterSpacing: 10, color: "#f0b888", marginTop: 34, fontFamily: "sans-serif" }}>WEB · MOBILE · SOFTWARE · AI</div>
      </div>
    ),
    size,
  );
}
