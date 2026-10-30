"use client";

import { motion, useReducedMotion } from "motion/react";
import AiCore from "./AiCore";
import { SceneLink } from "./Scene";

const ease = [0.22, 1, 0.36, 1] as const;
const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Scene 01: full-screen hero. "01 →" and the side pager open the work scene; scrolling continues down the page. */
export default function Hero({ label, title, sub }: { label: string; title: string; sub: string }) {
  const reduce = useReducedMotion();
  const fade = (delay: number, y = 14) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease, delay },
  });

  return (
    <section className="hero" aria-label="Upforge">
      <AiCore />
      <motion.div className="hero-dim" initial={reduce ? false : { opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.6, ease }} aria-hidden="true" />
      <div className="hero-floor" aria-hidden="true" />
      <div className="stage hero-stage">
        <motion.div className="hero-index" {...fade(1.1, 0)}>
          <SceneLink href="/work" aria-label="Next: Work">
            <span>01</span>
            <i className="hero-index-line"><motion.b initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 1.3 }} /></i>
          </SceneLink>
        </motion.div>

        <motion.div className="hero-pager" {...fade(1.2, 0)}>
          <span className="hero-rail" aria-hidden="true"><i /></span>
          <ul aria-label="Sections">
            {PAGES.map((p, i) => (
              <li key={p.href}>
                {i === 0 ? (
                  <span className="pager-ring" aria-current="page" title={p.label}>
                    <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" /><circle className="arc" cx="18" cy="18" r="15" /></svg>
                    <i />
                    <span className="sr-only">{p.label}</span>
                  </span>
                ) : (
                  <SceneLink href={p.href} className="pager-dot" aria-label={p.label} title={p.label} />
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="hero-text">
          <motion.p
            aria-hidden="true"
            className="hero-label"
            initial={reduce ? false : { opacity: 0, letterSpacing: "1.6em" }}
            animate={{ opacity: 1, letterSpacing: "1em" }}
            transition={{ duration: 1.6, ease, delay: 0.9 }}
          >
            {label}
          </motion.p>
          <h1 className="hero-title" style={{ ["--hfs" as string]: Math.min(128, Math.round(860 / (title.length * 0.62))) }}>
            <span className="sr-only">{label}: </span>
            <span className="mask">
              <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease, delay: 1.0 }}>
                {title}
              </motion.span>
            </span>
            <span className="sr-only"> software development company in Colombo, Sri Lanka</span>
          </h1>
          <motion.span className="hero-caret" {...fade(1.5, 6)} aria-hidden="true" />
          <motion.p
            className="hero-sub"
            initial={reduce ? false : { opacity: 0, letterSpacing: "1.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.56em" }}
            transition={{ duration: 1.6, ease, delay: 1.55 }}
          >
            {sub}
          </motion.p>
        </div>
      </div>
      <motion.button className="hero-scroll" onClick={() => document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" })} {...fade(2.2, 0)} aria-label="Scroll to the studio introduction">
        <span>Scroll</span><i />
      </motion.button>
    </section>
  );
}
