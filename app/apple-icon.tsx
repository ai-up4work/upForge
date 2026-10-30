import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1a3a" }}>
        <svg width="110" height="110" viewBox="0 0 64 64">
          <path d="M13 10v24a19 19 0 0 0 38 0v-12" stroke="#AECAE3" strokeWidth="9.5" fill="none" />
          <path d="M51 2 63.5 20h-25z" fill="#AECAE3" />
        </svg>
      </div>
    ),
    size,
  );
}
