"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ProjectGlyph from "./ProjectGlyph";
import ProjectTile from "./ProjectTile";
import Showcase from "./Showcase";
import { SceneLink, useScene } from "./Scene";
import { services, servicesOf } from "@/lib/services";
import { cld } from "@/lib/format";
import type { ProjectDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
// Stage is 1600 × 1200 design units. Four cards always span the same total width:
// four equal cards before one opens, then one wide (landscape screenshot) card and three narrow ones.
const ROW = 1551;
const GAP = 17;
const OPEN = 600;
const VISIBLE = 4;

const pad = (n: number) => String(n).padStart(2, "0");

/** Scene 02: the work index. Hover, scroll or use ← → to open a card; filter by service. */
export default function WorkScene({ projects: all }: { projects: ProjectDTO[] }) {
  const reduce = useReducedMotion();
  const { go } = useScene();
  const [svc, setSvc] = useState("");
  const [active, setActive] = useState(-1);
  const [start, setStart] = useState(0);
  const lock = useRef(0);
  const hoverT = useRef<number | undefined>(undefined);

  // ?service=… preselects a filter (links from service pages and case studies)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("service");
    if (q && services.some((s) => s.slug === q)) setSvc(q);
  }, []);

  const projects = useMemo(() => (svc ? all.filter((p) => servicesOf(p).some((s) => s.slug === svc)) : all), [all, svc]);
  const chips = useMemo(() => services.filter((s) => all.some((p) => servicesOf(p).some((x) => x.slug === s.slug))), [all]);
  const n = projects.length;
  const windowed = useMemo(() => projects.slice(start, start + VISIBLE), [projects, start]);

  const pick = (slug: string) => {
    setSvc(slug);
    setStart(0);
    setActive(-1);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("service", slug);
    else url.searchParams.delete("service");
    window.history.replaceState(null, "", url);
  };

  // No card is open until you hover one, scroll, or use the arrow keys (as on the home page).
  const via = useRef<"hover" | "key">("hover");

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
      via.current = "key";
      select(active < 0 ? 0 : active + d);
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

  const filters = chips.length > 1 && (
    <nav className="work-filters" aria-label="Filter projects by service">
      <button type="button" className={!svc ? "on" : undefined} onClick={() => pick("")}>All <sup>{all.length}</sup></button>
      {chips.map((s) => (
        <button type="button" key={s.slug} className={svc === s.slug ? "on" : undefined} onClick={() => pick(s.slug)}>
          {s.name} <sup>{all.filter((p) => servicesOf(p).some((x) => x.slug === s.slug)).length}</sup>
        </button>
      ))}
    </nav>
  );

  if (!all.length) {
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
  const activeLocal = active - start;
  const hasOpen = activeLocal >= 0 && activeLocal < count;
  const narrow = count > 1 ? (ROW - OPEN - GAP * (VISIBLE - 1)) / (VISIBLE - 1) : OPEN;
  const even = (ROW - GAP * (VISIBLE - 1)) / VISIBLE;
  const widths = windowed.map((_, k) => (hasOpen ? (k === activeLocal ? OPEN : narrow) : even));
  const rowW = widths.reduce((a, b) => a + b, 0) + GAP * (count - 1);
  const lefts: number[] = [];
  widths.reduce((x, w) => (lefts.push(x), x + w + GAP), (1600 - rowW) / 2);
  const ax = hasOpen ? lefts[activeLocal] + widths[activeLocal] / 2 : 800;

  return (
    <section className="work-scene" aria-label="Selected work">
      <div className="stage work-stage" style={{ ["--ax" as string]: ax }}>
        {filters}
        <motion.div
          className="work-frame"
          initial={reduce ? false : { opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.55 }}
          aria-hidden="true"
        >
          <span className="work-frame-topo" />
        </motion.div>

        <ul
          className="work-cards"
          role="list"
          key={svc || "all"}
          onPointerLeave={() => {
            window.clearTimeout(hoverT.current);
            if (via.current === "hover") setActive(-1); // close again when the mouse leaves the row
          }}
        >
          {windowed.map((p, k) => {
            const i = start + k;
            const on = i === active;
            const cover = p.image || p.images?.[0];
            const kind = servicesOf(p).slice(0, 2).map((s) => s.name).join(" · ") || (p.tags ?? []).slice(0, 2).join(" · ");
            return (
              <motion.li
                key={p.slug}
                className={`wcard${on ? " is-active" : ""}`}
                style={{ left: `calc(${lefts[k]} * var(--s))`, width: `calc(${widths[k]} * var(--s))` }}
                initial={reduce ? false : { opacity: 0, x: "70%", y: "-42%", scale: 0.42 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 1.05, ease, delay: 0.08 + k * 0.07 }}
                onPointerMove={() => {
                  if (on || !window.matchMedia("(hover: hover)").matches) return;
                  window.clearTimeout(hoverT.current);
                  hoverT.current = window.setTimeout(() => { via.current = "hover"; setActive(i); }, 110);
                }}
                onPointerLeave={() => window.clearTimeout(hoverT.current)}
              >
                <SceneLink href={`/work/${p.slug}`} bar={cld(cover, 900)} className="wcard-hit" onFocus={() => setActive(i)} aria-label={`${p.title}, project ${pad(i + 1)}. Open case study`}>
                  <span className="wcard-marker" aria-hidden="true" />
                  <span className="wcard-media" aria-hidden="true">
                    <Showcase flat slug={p.slug} title={p.title} image={cover} link={p.link} sizes="(min-width: 900px) 40vw, 90vw" priority={k < 2} />
                  </span>
                  <span className="wcard-glyph"><ProjectGlyph p={p} /></span>
                  <span className="wcard-dot" aria-hidden="true" />
                  <span className="wcard-text">
                    <span className="wcard-title">{p.title}</span>
                    <span className="wcard-kind">{kind}</span>
                    <span className="wcard-num">{pad(i + 1)}</span>
                  </span>
                  <span className="wcard-bar" aria-hidden="true" />
                </SceneLink>
              </motion.li>
            );
          })}
        </ul>

        <motion.div className="work-pager" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}>
          <button onClick={() => { via.current = "key"; select(active - 1); }} disabled={active <= 0} aria-label="Previous project">‹</button>
          <span className="tracked">
            <b>{pad(Math.max(active, 0) + 1)}</b> / {pad(n)}
          </span>
          <button onClick={() => { via.current = "key"; select(active + 1); }} disabled={active >= n - 1} aria-label="Next project">›</button>
          {projects[active] && (
            <SceneLink href={`/work/${projects[active].slug}`} className="tracked work-open">
              Open case study <span aria-hidden="true">→</span>
            </SceneLink>
          )}
        </motion.div>
      </div>

      {/* Phones: landscape cards; each opens while it is centred on screen */}
      <div className="work-mobile">
        {filters}
        <ul className="ptile-grid work-list" role="list" key={svc || "all"}>
          {projects.map((p, i) => <ProjectTile key={p.slug} p={p} index={i} sizes="92vw" />)}
        </ul>
      </div>
    </section>
  );
}
