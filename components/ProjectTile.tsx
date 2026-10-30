import ProjectGlyph from "./ProjectGlyph";
import Showcase from "./Showcase";
import ActiveInView from "./ActiveInView";
import { SceneLink } from "./Scene";
import { servicesOf } from "@/lib/services";
import { cld } from "@/lib/format";
import type { ProjectDTO } from "@/lib/types";

/**
 * Project card in the reference style: the project's emblem sits on the card,
 * and the screenshot drops open over it on hover (or when centred on a phone).
 */
export default function ProjectTile({ p, index, sizes = "(min-width: 1100px) 45vw, 92vw" }: { p: ProjectDTO; index: number; sizes?: string }) {
  const cover = p.image || p.images?.[0];
  const svc = servicesOf(p).slice(0, 3).map((s) => s.name);
  const meta = svc.length ? svc : (p.tags ?? []).slice(0, 3);
  return (
    <ActiveInView className="ptile-li">
      <SceneLink href={`/work/${p.slug}`} bar={cld(cover, 900)} className="ptile" aria-label={`${p.title}: open case study`}>
        <span className="wcard-marker" aria-hidden="true" />
        <span className="ptile-media">
          <span className="ptile-glyph"><ProjectGlyph p={p} /></span>
          <span className="ptile-shot" aria-hidden="true">
            <Showcase flat slug={p.slug} title={p.title} image={cover} link={p.link} sizes={sizes} />
          </span>
        </span>
        <span className="ptile-row">
          <span className="ptile-title">{p.title}</span>
          <span className="wcard-num">{String(index + 1).padStart(2, "0")}</span>
        </span>
        {meta.length > 0 && <span className="ptile-meta">{meta.join(" · ")}</span>}
        <span className="wcard-bar" aria-hidden="true" />
      </SceneLink>
    </ActiveInView>
  );
}
