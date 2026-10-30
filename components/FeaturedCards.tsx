"use client";

import { useRef, useState } from "react";
import "./FeaturedCards.css";
import ProjectGlyph from "./ProjectGlyph";
import Showcase from "./Showcase";
import { SceneLink } from "./Scene";
import { cld } from "@/lib/format";
import { servicesOf } from "@/lib/services";
import type { ProjectDTO } from "@/lib/types";

/**
 * Desktop "Selected work" on the home page, in the style of the Work page:
 * all projects in one row of cards; the hovered card widens and its screenshot drops open,
 * the others show the project emblem. Light on purpose: no per-card backgrounds.
 */
export default function FeaturedCards({ projects }: { projects: ProjectDTO[] }) {
  const [on, setOn] = useState(0);
  const t = useRef<number | undefined>(undefined);
  // a short delay stops cards flickering while the row re-flows under the pointer
  const hover = (i: number) => {
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setOn(i), 110);
  };

  return (
    <div className="fc-frame">
      <ul className="fc-row" role="list" onPointerLeave={() => window.clearTimeout(t.current)}>
        {projects.map((p, i) => {
          const cover = p.image || p.images?.[0];
          const kind = servicesOf(p).slice(0, 2).map((s) => s.name).join(" · ") || (p.tags ?? []).slice(0, 2).join(" · ");
          return (
            <li key={p.slug} className={`fc-card${i === on ? " is-on" : ""}`} onPointerMove={() => i !== on && hover(i)}>
              <SceneLink href={`/work/${p.slug}`} bar={cld(cover, 900)} className="fc-hit" style={{ position: "absolute", overflow: "hidden" }} onFocus={() => setOn(i)} aria-label={`${p.title}: open case study`}>
                <span className="wcard-marker" aria-hidden="true" />
                <span className="fc-media" aria-hidden="true" style={{ position: "absolute", overflow: "hidden" }}>
                  <Showcase flat slug={p.slug} title={p.title} image={cover} link={p.link} sizes="(min-width: 900px) 42vw, 1px" />
                </span>
                <span className="fc-glyph" aria-hidden="true"><ProjectGlyph p={p} asImage /></span>
                <span className="fc-text">
                  <span className="fc-title">{p.title}</span>
                  {kind && <span className="fc-kind">{kind}</span>}
                  <span className="wcard-num">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="wcard-bar" aria-hidden="true" />
              </SceneLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
