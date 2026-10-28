"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { steps as stages } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** A pinned chapter: the stage list stays put while scrolling advances through the four stages. */
export default function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const n = stages.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999))));
  });

  const local = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v * n - active)));

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (i + 0.5)) / n, behavior: reduce ? "auto" : "smooth" });
  };

  const s = stages[active];

  return (
    <section className="dark process" id="process">
      <div className="grain" aria-hidden="true" />
      <div className="process-track" ref={trackRef} style={{ height: `${100 + n * 70}vh` }}>
        <div className="process-sticky">
          <div className="container">
            <div className="process-grid">
              <div>
                <span className="label">How a build runs</span>
                <h2 style={{ fontSize: "var(--t-h2)", marginTop: "1.25rem" }}>
                  Four stages.
                  <br />
                  <span className="tone">No surprises.</span>
                </h2>
                <div className="stage-list" role="tablist" aria-label="Project stages">
                  {stages.map((st, i) => (
                    <button
                      key={st.name}
                      role="tab"
                      aria-selected={i === active}
                      className={`stage-item${i === active ? " on" : ""}`}
                      onClick={() => goTo(i)}
                    >
                      <span className="n">Stage {i + 1}</span>
                      <span className="t">{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="stage-card" role="tabpanel" aria-live="polite">
                <div className="stage-orb" aria-hidden="true" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -16, filter: "blur(8px)" }}
                    transition={{ duration: 0.55, ease }}
                    style={{ display: "grid", gap: "1.25rem" }}
                  >
                    <div className="meta">
                      <span className="label">Stage {active + 1} of {n}</span>
                      <span className="dur">{s.duration}</span>
                    </div>
                    <h3>{s.name}</h3>
                    <p>{s.body}</p>
                    <ul>
                      {s.points.map((p) => (
                        <li key={p}><Check />{p}</li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
                <div className="stage-bar" aria-hidden="true">
                  <motion.i style={{ scaleX: local }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
