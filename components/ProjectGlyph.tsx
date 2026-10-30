import type { ProjectDTO } from "@/lib/types";
import { cld } from "@/lib/format";

/**
 * The lavender emblem on a project card, as in the reference: the project's own logo (first avatar,
 * tinted to the card colour; or the plain image with `asImage`) or, when none is uploaded, a geometric mark picked from the project.
 */
const MARKS: Record<string, React.ReactNode> = {
  // nested arcs, like a stylised D / crescent
  arcs: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
      <path d="M30 22v76" />
      <path d="M30 22h18a38 38 0 0 1 0 76H30" />
      <path d="M48 42a18 18 0 0 1 0 36" />
    </g>
  ),
  // ring with an orbiting moon
  orbit: (
    <g>
      <circle cx="56" cy="66" r="30" fill="none" stroke="currentColor" strokeWidth="10" />
      <circle cx="56" cy="66" r="10" fill="currentColor" />
      <circle cx="94" cy="26" r="9" fill="none" stroke="currentColor" strokeWidth="5" />
    </g>
  ),
  // folded diamond with an arrow cut
  fold: (
    <g fill="currentColor">
      <path d="M60 10l34 34-17 17-17-17-17 17-17-17z" />
      <path d="M43 61l17 17 17-17 17 17-34 34-34-34z" opacity=".72" />
    </g>
  ),
  // slanted stacked bars
  stack: (
    <g fill="currentColor">
      <path d="M26 26h62l-10 16H16z" />
      <path d="M38 52h62l-10 16H28z" opacity=".85" />
      <path d="M26 78h62l-10 16H16z" opacity=".7" />
    </g>
  ),
  // four petals
  petal: (
    <g fill="currentColor">
      <path d="M60 60V18a42 42 0 0 1 42 42z" />
      <path d="M60 60h-42a42 42 0 0 0 42 42z" />
      <path d="M60 60H18A42 42 0 0 1 60 18z" opacity=".55" />
      <path d="M60 60h42a42 42 0 0 1-42 42z" opacity=".55" />
    </g>
  ),
  // hexagon with a node
  hex: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round">
      <path d="M60 14l40 23v46l-40 23-40-23V37z" />
      <path d="M60 60V36M60 60l21 12M60 60L39 72" strokeLinecap="round" />
      <circle cx="60" cy="60" r="7" fill="currentColor" stroke="none" />
    </g>
  ),
};

const KEYS = Object.keys(MARKS);

function markFor(p: ProjectDTO) {
  const text = `${p.title} ${p.description ?? ""} ${(p.tags ?? []).join(" ")} ${(p.services ?? []).join(" ")}`.toLowerCase();
  if (/\bai\b|automation|chatbot|machine/.test(text)) return "hex";
  if (/prayer|time|clock|display|signage/.test(text)) return "arcs";
  if (/beauty|fashion|cosmetic|skincare/.test(text)) return "petal";
  if (/print|store|shop|commerce/.test(text)) return "stack";
  if (/business|management|erp|crm|inventory|pos/.test(text)) return "fold";
  let h = 0;
  for (let i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) >>> 0;
  return KEYS[h % KEYS.length];
}

export default function ProjectGlyph({ p, asImage = false }: { p: ProjectDTO; asImage?: boolean }) {
  const logo = p.avatars?.[0]?.src;
  if (logo && asImage) {
    // the real logo image (used by the home "Products we've shipped" cards)
    // eslint-disable-next-line @next/next/no-img-element
    return <span className="glyph glyph-img" aria-hidden="true"><img src={cld(logo, 300)} alt="" loading="lazy" decoding="async" /></span>;
  }
  if (logo) {
    return <span className="glyph glyph-logo" style={{ WebkitMaskImage: `url("${logo}")`, maskImage: `url("${logo}")` }} aria-hidden="true" />;
  }
  return (
    <svg className="glyph glyph-mark" viewBox="0 0 120 120" aria-hidden="true">
      {MARKS[markFor(p)]}
    </svg>
  );
}
