"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Centred page opener: tracked label, serif title (last line teal), caret, orange kicker. */
export default function PageIntro({ label, lines, kicker, children, long = false }: { label: string; lines: string[]; kicker?: string; children?: ReactNode; long?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <header className="intro">
      <span className="intro-topo" aria-hidden="true" />
      <motion.p
        className="tracked intro-label"
        initial={reduce ? false : { opacity: 0, letterSpacing: "1.4em" }}
        animate={{ opacity: 1, letterSpacing: "0.9em" }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
      >
        {label}
      </motion.p>
      <h1 className={long ? "serif-long" : "serif-xl"}>
        {lines.map((l, i) => (
          <span className="mask" key={i}>
            <motion.span
              className={i === lines.length - 1 && lines.length > 1 ? "teal" : undefined}
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease, delay: 0.35 + i * 0.12 }}
            >
              {l}
            </motion.span>
            {" "}
          </span>
        ))}
      </h1>
      <motion.span className="caret-down" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} aria-hidden="true" />
      {kicker && (
        <motion.p className="kicker-orange" initial={reduce ? false : { opacity: 0, letterSpacing: "1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 1.3, ease, delay: 0.95 }}>
          {kicker}
        </motion.p>
      )}
      {children && <motion.div className="intro-extra" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.1 }}>{children}</motion.div>}
    </header>
  );
}
