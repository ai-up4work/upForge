"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Showcase from "./Showcase";
import { motion, useReducedMotion } from "motion/react";
import ProjectGlyph from "./ProjectGlyph";
import { SceneLink, useScene } from "./Scene";
import type { ProjectDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
const CARD = 375; // design units (1600 × 1200 stage)
const GAP = 17;
const VISIBLE = 4;

const pad = (n: number) => String(n).padStart(2, "0");
const splitTitle = (t: string) => {
  const words = t.trim().split(/\s+/);
  if (words.length < 2) return [t, ""];
  return [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")];
};

/** Scene 02: the work index as a row of cards. Hover, scroll or use ← → to change the active card. */
export default function WorkScene({ projects }: { projects: ProjectDTO[] }) {
  const reduce = useReducedMotion();
  const { go } = useScene();
  const [active, setActive] = useState(-1);
  const [start, setStart] = useState(0);
  const lock = useRef(0);
  const n = projects.length;
  const windowed = useMemo(() => projects.slice(start, start + VISIBLE), [projects, start]);

  // After the cards land, open the first one (as in the reference sequence).
  useEffect(() => {
    const t = setTimeout(() => setActive((a) => (a === -1 ? 0 : a)), reduce ? 0 : 1250);
    return () => clearTimeout(t);
  }, [reduce]);

  const select = useCallback(
    (abs: number) => {
      const i = Math.max(0, Math.min(n - 1, abs));
      if (i < start) setStart(i);
      else if (i >= start + VISIBLE) setStart(i - VISIBLE + 1);
      setActive(i);
    },
    [n, start],
  );

  useEffect(() => {
    const step = (d: number) => {
      const now = Date.now();
      if (now - lock.current < 650) return;
      lock.current = now;
      if (d < 0 && active <= 0) return go("/");
      select(active + d);
    };
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 900) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) > 25) step(d > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      if (e.key === "Enter" && projects[active] && document.activeElement === document.body) go(`/work/${projects[active].slug}`);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, go, projects, select]);

  if (!n) {
    return (
      <section className="work-scene">
        <div className="stage empty-stage">
          <p className="tracked">Projects are on their way</p>
          <h1 className="serif-xl">New work soon</h1>
        </div>
      </section>
    );
  }

  const count = windowed.length;
  const rowW = count * CARD + (count - 1) * GAP;
  const left0 = (1600 - rowW) / 2;
  const activeLocal = active - start;
  const ax = activeLocal >= 0 && activeLocal < count ? left0 + activeLocal * (CARD + GAP) + CARD / 2 : 800;

  return (
    <section className="work-scene" aria-label="Selected work">
      <div className="stage work-stage" style={{ ["--ax" as string]: ax }}>
        <motion.div
          className="work-frame"
          initial={reduce ? false : { opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.55 }}
          aria-hidden="true"
        >
          <span className="work-frame-topo" />
        </motion.div>

        <ul className="work-cards" role="list">
          {windowed.map((p, k) => {
            const i = start + k;
            const on = i === active;
            const [a, b] = splitTitle(p.title.toUpperCase());
            const cover = p.image || p.images?.[0];
            return (
              <motion.li
                key={p.slug}
                className={`wcard${on ? " is-active" : ""}`}
                style={{ left: `calc(${left0 + k * (CARD + GAP)} * var(--s))` }}
                initial={reduce ? false : { opacity: 0, x: "70%", y: "-42%", scale: 0.42 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 1.05, ease, delay: 0.08 + k * 0.07 }}
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              >
                <SceneLink
                  href={`/work/${p.slug}`}
                  className="wcard-hit"
                  onFocus={() => setActive(i)}
                  onClick={(e) => {
                    if (!on && !window.matchMedia("(hover: hover)").matches) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  aria-label={`${p.title}, project ${pad(i + 1)}. Open case study`}
                >
                  <span className="wcard-marker" aria-hidden="true" />
                  <span className="wcard-media" aria-hidden="true">
                    <Showcase slug={p.slug} title={p.title} image={cover} secondary={p.images?.find((x) => x !== cover)} link={p.link} sizes="(min-width: 900px) 24vw, 90vw" priority={i < 2} />
                  </span>
                  <span className="wcard-glyph"><ProjectGlyph p={p} /></span>
                  <span className="wcard-dot" aria-hidden="true" />
                  <span className="wcard-text">
                    <span className="wcard-title">
                      {a}
                      {b && <em> {b}</em>}
                    </span>
                    <span className="wcard-num">{pad(i + 1)}</span>
                  </span>
                  <span className="wcard-bar" aria-hidden="true" />
                </SceneLink>
              </motion.li>
            );
          })}
        </ul>

        <motion.div className="work-pager" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}>
          <button onClick={() => select(active - 1)} disabled={active <= 0} aria-label="Previous project">‹</button>
          <span className="tracked">
            <b>{pad(Math.max(active, 0) + 1)}</b> / {pad(n)}
          </span>
          <button onClick={() => select(active + 1)} disabled={active >= n - 1} aria-label="Next project">›</button>
          {projects[active] && (
            <SceneLink href={`/work/${projects[active].slug}`} className="tracked work-open">
              Open case study <span aria-hidden="true">→</span>
            </SceneLink>
          )}
        </motion.div>
      </div>

      {/* Phones: a vertical stack of open cards */}
      <ul className="work-list" role="list">
        {projects.map((p, i) => {
          const [a, b] = splitTitle(p.title.toUpperCase());
          const cover = p.image || p.images?.[0];
          return (
            <motion.li key={p.slug} initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
              <SceneLink href={`/work/${p.slug}`} className="wcard-m">
                <span className="wcard-m-media"><Showcase slug={p.slug} title={p.title} image={cover} secondary={p.images?.find((x) => x !== cover)} link={p.link} sizes="92vw" label={(p.tags ?? [])[0]} /></span>
                <span className="wcard-title">{a}{b && <em> {b}</em>}</span>
                <span className="wcard-num">{pad(i + 1)}</span>
                <span className="wcard-bar" aria-hidden="true" />
              </SceneLink>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
