import Image from "next/image";
import { cld } from "@/lib/format";

/**
 * Turns raw website screenshots into a composed presentation:
 * a lit colour plate, a back window and a front browser window with real chrome.
 * Layout adapts to the box it's placed in (portrait or landscape) via container queries.
 */

const PALETTES = [
  { a: "#2a1233", b: "#f0915f", c: "#ffd2a8" }, // ember
  { a: "#071f3a", b: "#3fb3d1", c: "#bdeeff" }, // tide
  { a: "#141040", b: "#8a78f5", c: "#d9d2ff" }, // aurora
  { a: "#04261f", b: "#3fbf95", c: "#c8f5e4" }, // jade
  { a: "#1f0f2e", b: "#e0789f", c: "#ffd0e0" }, // dusk
];

export function paletteFor(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

const domainOf = (link?: string, slug?: string) => {
  if (link) {
    try {
      return new URL(link).hostname.replace(/^www\./, "");
    } catch {
      /* fall through */
    }
  }
  return `${slug ?? "project"}.app`;
};

export default function Showcase({
  slug,
  title,
  image,
  secondary,
  link,
  label,
  sizes = "(min-width: 900px) 40vw, 92vw",
  priority,
  single = false,
  flat = false,
}: {
  slug: string;
  title: string;
  image?: string;
  secondary?: string;
  link?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  single?: boolean;
  flat?: boolean;
}) {
  const pal = paletteFor(slug);
  const style = { ["--pa" as string]: pal.a, ["--pb" as string]: pal.b, ["--pc" as string]: pal.c };
  const back = !single && !flat ? secondary : undefined;
  return (
    <span className={`show${flat ? " show-flat" : single ? " show-single" : back ? "" : " show-solo"}`} style={style} aria-hidden={label ? undefined : true}>
      <span className="show-plate" />
      <span className="show-grid" />
      {back && (
        <span className="show-win show-back">
          <span className="show-chrome"><i /><i /><i /></span>
          <span className="show-view">
            <Image src={cld(back, 900)} alt="" fill sizes={sizes} style={{ objectFit: "cover", objectPosition: "center top" }} />
          </span>
        </span>
      )}
      <span className="show-win show-front">
        <span className="show-chrome">
          <i /><i /><i />
          <span className="show-url">{domainOf(link, slug)}</span>
        </span>
        <span className="show-view">
          {image ? (
            <Image src={cld(image, 1400)} alt={`${title} website screenshot`} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: "center top" }} />
          ) : (
            <span className="show-empty">{title.slice(0, 1)}</span>
          )}
        </span>
      </span>
      {label && <span className="show-label">{label}</span>}
    </span>
  );
}
