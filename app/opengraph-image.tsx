import { ImageResponse } from "next/og";

export const alt = "Upforge Studio, software development company in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image (pages without their own image use this). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 0%, #174469 0%, #04183a 55%, #00041c 100%)", color: "#f9fcff", fontFamily: "serif" }}>
        <svg width="96" height="96" viewBox="0 0 64 64" style={{ marginBottom: 36 }}>
          <path d="M13 10v24a19 19 0 0 0 38 0v-12" stroke="#AECAE3" strokeWidth="9.5" fill="none" />
          <path d="M51 2 63.5 20h-25z" fill="#AECAE3" />
        </svg>
        <div style={{ fontSize: 22, letterSpacing: 14, color: "#ffffff", marginBottom: 18, fontFamily: "sans-serif" }}>SOFTWARE COMPANY · SRI LANKA</div>
        <div style={{ fontSize: 96, letterSpacing: -1 }}>UPFORGE STUDIO</div>
        <div style={{ fontSize: 24, letterSpacing: 12, color: "#f0b888", marginTop: 26, fontFamily: "sans-serif" }}>WEB · MOBILE · SOFTWARE · AI</div>
      </div>
    ),
    size,
  );
}
