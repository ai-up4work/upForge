"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import LabObject, { type LabVariant } from "./LabObject";
import { SceneLink } from "../Scene";

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ["Sphere", "Phone", "Browser", "Logo"];

/**
 * HERO LAB copy of components/Hero.tsx with the ring swapped for a candidate object.
 * Uses the same classes as the live hero so layout and type are identical.
 */
export default function LabHero({ variant, label, title, sub }: { variant: LabVariant; label: string; title: string; sub: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const fade = (delay: number, y = 14) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease, delay },
  });

  return (
    <section className="hero lab-hero" aria-label="Upforge">
      <LabObject key={variant} variant={variant} onStep={setStep} />
      <motion.div className="hero-dim" initial={reduce ? false : { opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.6, ease }} aria-hidden="true" />
      <div className="stage hero-stage">
        {variant === 4 && (
          <div className="lab-steps" aria-hidden="true">
            {STEPS.map((s, i) => <span key={s} className={i === step ? "on" : undefined}>{s}</span>)}
          </div>
        )}
        <motion.div className="hero-index" {...fade(1.1, 0)}>
          <SceneLink href="/work" aria-label="Next: Work">
            <span>01</span>
            <i className="hero-index-line"><motion.b initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 1.3 }} /></i>
          </SceneLink>
        </motion.div>
        <div className="hero-text">
          <motion.p aria-hidden="true" className="hero-label" initial={reduce ? false : { opacity: 0, letterSpacing: "1.6em" }} animate={{ opacity: 1, letterSpacing: "1em" }} transition={{ duration: 1.6, ease, delay: 0.9 }}>
            {label}
          </motion.p>
          <h1 className="hero-title" style={{ ["--hfs" as string]: Math.min(128, Math.round(860 / (title.length * 0.62))) }}>
            <span className="mask">
              <motion.span initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease, delay: 1.0 }}>{title}</motion.span>
            </span>
          </h1>
          <motion.span className="hero-caret" {...fade(1.5, 6)} aria-hidden="true" />
          <motion.p className="hero-sub" initial={reduce ? false : { opacity: 0, letterSpacing: "1.1em" }} animate={{ opacity: 1, letterSpacing: "0.56em" }} transition={{ duration: 1.6, ease, delay: 1.55 }}>
            {sub}
          </motion.p>
        </div>
      </div>
      <motion.button className="hero-scroll" onClick={() => document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" })} {...fade(2.2, 0)} aria-label="Scroll down">
        <span>Scroll</span><i />
      </motion.button>
    </section>
  );
}
