import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #10224a, #050a24)" }}>
        <svg width="118" height="118" viewBox="0 0 64 64">
          <path d="M8 18H20V40A12 12 0 0 0 44 40V12L56 4V40A24 24 0 0 1 8 40Z" fill="#C6DCF0" />
          <path d="M32 18.5l6 6-6 6-6-6z" fill="#F0A06C" />
        </svg>
      </div>
    ),
    size,
  );
}
