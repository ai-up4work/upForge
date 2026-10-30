import type { ProjectDTO } from "@/lib/types";

/**
 * The lavender emblem on a project card, as in the reference design.
 * Pick one per project in the admin (Projects → edit → Card emblem); "Automatic" picks one from the
 * project's title, tags and services. (Team avatars are never used here: they are people, not logos.)
 */
export const MARKS: Record<string, { label: string; svg: React.ReactNode }> = {
  arcs: { label: "Arcs", svg: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
      <path d="M30 22v76" /><path d="M30 22h18a38 38 0 0 1 0 76H30" /><path d="M48 42a18 18 0 0 1 0 36" />
    </g>
  ) },
  orbit: { label: "Orbit", svg: (
    <g>
      <circle cx="56" cy="66" r="30" fill="none" stroke="currentColor" strokeWidth="10" />
      <circle cx="56" cy="66" r="10" fill="currentColor" />
      <circle cx="94" cy="26" r="9" fill="none" stroke="currentColor" strokeWidth="5" />
    </g>
  ) },
  fold: { label: "Fold", svg: (
    <g fill="currentColor">
      <path d="M60 10l34 34-17 17-17-17-17 17-17-17z" />
      <path d="M43 61l17 17 17-17 17 17-34 34-34-34z" opacity=".72" />
    </g>
  ) },
  stack: { label: "Stack", svg: (
    <g fill="currentColor">
      <path d="M26 26h62l-10 16H16z" /><path d="M38 52h62l-10 16H28z" opacity=".85" /><path d="M26 78h62l-10 16H16z" opacity=".7" />
    </g>
  ) },
  petal: { label: "Petal", svg: (
    <g fill="currentColor">
      <path d="M60 60V18a42 42 0 0 1 42 42z" /><path d="M60 60h-42a42 42 0 0 0 42 42z" />
      <path d="M60 60H18A42 42 0 0 1 60 18z" opacity=".55" /><path d="M60 60h42a42 42 0 0 1-42 42z" opacity=".55" />
    </g>
  ) },
  hex: { label: "Network", svg: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round">
      <path d="M60 14l40 23v46l-40 23-40-23V37z" />
      <path d="M60 60V36M60 60l21 12M60 60L39 72" strokeLinecap="round" />
      <circle cx="60" cy="60" r="7" fill="currentColor" stroke="none" />
    </g>
  ) },
  wave: { label: "Wave", svg: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
      <path d="M16 42c11-12 22-12 33 0s22 12 33 0 16-8 22-4" />
      <path d="M16 64c11-12 22-12 33 0s22 12 33 0 16-8 22-4" opacity=".8" />
      <path d="M16 86c11-12 22-12 33 0s22 12 33 0 16-8 22-4" opacity=".6" />
    </g>
  ) },
  blocks: { label: "Blocks", svg: (
    <g fill="currentColor">
      <rect x="18" y="18" width="38" height="38" rx="9" /><rect x="64" y="18" width="38" height="38" rx="19" opacity=".6" />
      <rect x="18" y="64" width="38" height="38" rx="9" opacity=".6" /><rect x="64" y="64" width="38" height="38" rx="9" />
    </g>
  ) },
  spark: { label: "Spark", svg: (
    <g fill="currentColor">
      <path d="M60 10c4 26 14 36 40 40-26 4-36 14-40 40-4-26-14-36-40-40 26-4 36-14 40-40z" />
      <circle cx="96" cy="94" r="8" opacity=".7" />
    </g>
  ) },
  chart: { label: "Chart", svg: (
    <g fill="currentColor">
      <rect x="16" y="64" width="18" height="38" rx="5" opacity=".6" /><rect x="42" y="44" width="18" height="58" rx="5" opacity=".8" />
      <rect x="68" y="24" width="18" height="78" rx="5" />
      <path d="M20 46l26-20 22 12 30-22" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ) },
  bolt: { label: "Bolt", svg: <path d="M68 10L26 66h28l-8 44 46-60H62z" fill="currentColor" /> },
  shield: { label: "Shield", svg: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round">
      <path d="M60 12l38 14v30c0 26-17 44-38 52-21-8-38-26-38-52V26z" />
      <path d="M44 60l12 12 22-24" strokeLinecap="round" />
    </g>
  ) },
  cart: { label: "Cart", svg: (
    <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 22h14l12 50h50l12-36H34" />
      <circle cx="46" cy="94" r="7" fill="currentColor" stroke="none" /><circle cx="84" cy="94" r="7" fill="currentColor" stroke="none" />
    </g>
  ) },
  play: { label: "Play", svg: (
    <g>
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="9" />
      <path d="M50 40l32 20-32 20z" fill="currentColor" />
    </g>
  ) },
};

export const MARK_KEYS: string[] = Object.keys(MARKS);
const AUTO = ["arcs", "orbit", "fold", "stack", "petal", "hex"];

/** The emblem a project gets when its emblem is set to Automatic. */
export function autoMark(p: { title: string; slug: string; description?: string; tags?: string[]; services?: string[] }) {
  const text = `${p.title} ${p.description ?? ""} ${(p.tags ?? []).join(" ")} ${(p.services ?? []).join(" ")}`.toLowerCase();
  if (/\bai\b|automation|chatbot|machine|analytics/.test(text)) return "hex";
  if (/auction|tournament|sport|cricket|broadcast|stream/.test(text)) return "play";
  if (/prayer|clock|signage|screen|display/.test(text)) return "arcs";
  if (/beauty|fashion|cosmetic|skincare/.test(text)) return "petal";
  if (/print|store|shop|commerce|wristband/.test(text)) return "cart";
  if (/business|management|erp|crm|inventory|pos/.test(text)) return "fold";
  let h = 0;
  for (let i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) >>> 0;
  return AUTO[h % AUTO.length];
}

export function MarkSvg({ name, className = "glyph glyph-mark" }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      {(MARKS[name] ?? MARKS.orbit).svg}
    </svg>
  );
}

// `asImage` is accepted so older callers keep compiling; it no longer changes anything.
export default function ProjectGlyph({ p }: { p: ProjectDTO; asImage?: boolean }) {
  const name = p.mark && MARKS[p.mark] ? p.mark : autoMark(p);
  return <MarkSvg name={name} />;
}
