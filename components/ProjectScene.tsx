"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import ProjectGlyph from "./ProjectGlyph";
import { SceneLink } from "./Scene";
import { cld, titleLines } from "@/lib/format";
import type { ProjectDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

/** Scene 03: project cover beside the title panel. */
export default function ProjectScene({ p, kicker }: { p: ProjectDTO; kicker: string }) {
  const reduce = useReducedMotion();
  const cover = p.image || p.images?.[0];
  const lines = titleLines(p.title);
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = longest > 11 ? 52 : longest > 8 ? 64 : 78;
  const top = 465 + (3 - lines.length) * 41 + (78 - fs) * 1.2;
  const r = (d: number) => (reduce ? 0 : d);

  return (
    <section className="detail-scene" aria-label={p.title}>
      <div className="stage detail-stage">
        <SceneLink href="/work" className="detail-back tracked">‹ All work</SceneLink>

        <motion.div
          className="detail-panel"
          initial={reduce ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.2, ease, delay: r(0.35) }}
        >
          <span className="detail-topo" aria-hidden="true" />
          <span className="detail-divider" aria-hidden="true" />
          <svg className="detail-arc" viewBox="0 0 700 700" aria-hidden="true">
            <motion.circle
              cx="350" cy="350" r="348"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease, delay: r(0.7) }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="detail-cover"
          initial={reduce ? false : { opacity: 0, scale: 0.82, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
        >
          <span className="detail-cover-inner">
            {cover ? <Image src={cld(cover, 1400)} alt={`${p.title} cover`} fill priority sizes="(min-width: 900px) 36vw, 92vw" style={{ objectFit: "cover" }} /> : <span className="glyph-fallback"><ProjectGlyph p={p} /></span>}
          </span>
        </motion.div>

        <div className="detail-copy">
          <motion.span
            className="detail-emblem"
            initial={reduce ? false : { scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: r(0.9) }}
            aria-hidden="true"
          >
            {p.avatars?.[0]?.src || cover ? (
              <Image src={cld(p.avatars?.[0]?.src || cover!, 300)} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
            ) : (
              <ProjectGlyph p={p} />
            )}
          </motion.span>
          <h1 className="detail-title" style={{ ["--fs" as string]: fs, ["--t" as string]: top }}>
            {lines.map((l, i) => (
              <span className="mask" key={i}>
                <motion.span
                  className={i === lines.length - 1 && lines.length > 1 ? "teal" : undefined}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease, delay: r(1.0 + i * 0.12) }}
                >
                  {l}
                </motion.span>
                {" "}
              </span>
            ))}
          </h1>
          <motion.span className="detail-caret" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: r(1.45) }} aria-hidden="true" />
          <motion.p
            className="detail-kicker"
            initial={reduce ? false : { opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.4, ease, delay: r(1.5) }}
          >
            {kicker}
          </motion.p>
        </div>

        <motion.span className="detail-scroll tracked" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: r(2.2) }} aria-hidden="true">
          Scroll for the story <i />
        </motion.span>
      </div>
    </section>
  );
}
