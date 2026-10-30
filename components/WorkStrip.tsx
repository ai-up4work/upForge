import Image from "next/image";
import { SceneLink } from "./Scene";
import ProjectGlyph from "./ProjectGlyph";
import { cld } from "@/lib/format";
import type { ProjectDTO } from "@/lib/types";

const split = (t: string) => {
  const w = t.toUpperCase().split(/\s+/);
  return w.length < 2 ? [t.toUpperCase(), ""] : [w.slice(0, Math.ceil(w.length / 2)).join(" "), w.slice(Math.ceil(w.length / 2)).join(" ")];
};

/** In-flow version of the work cards (home page): open cards with cover, title and number. */
export default function WorkStrip({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;
  return (
    <div className="strip-frame">
      <span className="card-row-topo" aria-hidden="true" />
      <ul className={`strip n${Math.min(projects.length, 4)}`} role="list">
        {projects.slice(0, 4).map((p, i) => {
          const [a, b] = split(p.title);
          const cover = p.image || p.images?.[0];
          return (
            <li key={p.slug}>
              <SceneLink href={`/work/${p.slug}`} className="strip-card">
                <span className="strip-media">
                  {cover ? <Image src={cld(cover, 900)} alt={`${p.title} project by Upforge`} fill sizes="(min-width: 1100px) 24vw, (min-width: 700px) 45vw, 92vw" style={{ objectFit: "cover" }} /> : <span className="glyph-fallback"><ProjectGlyph p={p} /></span>}
                </span>
                <span className="wcard-title">{a}{b && <em> {b}</em>}</span>
                <span className="wcard-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="strip-tags">{(p.tags ?? []).slice(0, 2).join(" · ")}</span>
                <span className="wcard-bar" aria-hidden="true" />
              </SceneLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
