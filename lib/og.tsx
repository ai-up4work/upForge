import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cld } from "./format";

export const ogSize = { width: 1200, height: 630 };

const font = (f: string) => readFile(join(process.cwd(), "lib/og-fonts", f));

async function imageSrc(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return cld(url, 1200);
  try {
    const buf = await readFile(join(process.cwd(), "public", decodeURIComponent(url)));
    const ext = url.split(".").pop()?.toLowerCase();
    return `data:image/${ext === "jpg" ? "jpeg" : ext};base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

const Mark = ({ s = 64 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 64 64">
    <path d="M8 18H20V40A12 12 0 0 0 44 40V12L56 4V40A24 24 0 0 1 8 40Z" fill="#C6DCF0" />
    <path d="M32 18.5l6 6-6 6-6-6z" fill="#F0A06C" />
  </svg>
);

/**
 * Branded 1200×630 share image in the site's scene style:
 * framed screenshot on the left, title panel on the right (or a centred title when there's no image).
 */
export async function renderOg({ eyebrow, title, kicker, image }: { eyebrow: string; title: string; kicker: string; image?: string }) {
  const [serif, sans6, sans4, src] = await Promise.all([font("playfair-500.ttf"), font("poppins-600.woff"), font("poppins-400.woff"), imageSrc(image)]);
  const words = title.split(/\s+/);
  const last = words.length > 1 ? words.pop()! : "";
  const first = words.join(" ");
  const fs = title.length > 34 ? 50 : title.length > 22 ? 60 : 72;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "radial-gradient(ellipse at 30% 0%, #10275a 0%, #050b2a 55%, #00041c 100%)", color: "#f9fcff", fontFamily: "Poppins" }}>
        <div style={{ position: "absolute", left: src ? 590 : 160, right: src ? 40 : 160, top: 60, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: src ? "#0b1236" : "transparent", border: src ? "1.5px solid #1c2350" : "none", paddingLeft: src ? 80 : 0, paddingRight: src ? 14 : 0 }}>
          <div style={{ display: "flex", width: 84, height: 84, borderRadius: 84, border: "4px solid #1d2452", background: "#0b1236", alignItems: "center", justifyContent: "center", marginBottom: 26 }}><Mark s={46} /></div>
          <div style={{ fontSize: 14, letterSpacing: 5, color: "#9aa3e6", textTransform: "uppercase", marginBottom: 18 }}>{eyebrow}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Playfair", fontSize: fs, lineHeight: 1.08, textTransform: "uppercase" }}>
            <span>{first || last}</span>
            {first && last && <span style={{ color: "#79dabd" }}>{last}</span>}
          </div>
          <div style={{ fontSize: 15, letterSpacing: 6, color: "#f0b888", marginTop: 28, textTransform: "uppercase" }}>{kicker}</div>
        </div>
        {src && (
          <div style={{ display: "flex", position: "absolute", left: 56, top: 115, width: 600, height: 400, padding: 7, background: "linear-gradient(165deg, #f2c47c 0%, #d98c4c 30%, #e7a866 55%, #2f9c75 80%, #e9b26c 100%)", boxShadow: "0 30px 60px rgba(0,0,10,.55)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={src} width={586} height={386} style={{ objectFit: "cover", objectPosition: "center top" }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 56, bottom: 38, display: "flex", alignItems: "center", gap: 12, fontSize: 15, letterSpacing: 6, color: "#c6dcf0", opacity: src ? 1 : 0 }}>
          UPFORGE · SRI LANKA
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Playfair", data: serif, weight: 500, style: "normal" },
        { name: "Poppins", data: sans6, weight: 600, style: "normal" },
        { name: "Poppins", data: sans4, weight: 400, style: "normal" },
      ],
    },
  );
}
