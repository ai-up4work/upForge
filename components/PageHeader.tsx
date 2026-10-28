"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHeader({ label, title, lead, children, center = false, meta }: { label: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; center?: boolean; meta?: string[] }) {
  const reduce = useReducedMotion();
  const item = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 1.1, ease, delay: d },
  });
  return (
    <header className={`page-header${center ? " center" : ""}`}>
      <div className="container">
        <motion.div className="page-kicker" {...item(0)}>
          <span className="label">{label}</span>
          {meta && meta.length > 0 && (
            <span className="page-meta">
              {meta.map((m) => <span key={m}>{m}</span>)}
            </span>
          )}
        </motion.div>
        <motion.h1 {...item(0.08)}>{title}</motion.h1>
        {lead && <motion.p className="page-lead" {...item(0.18)}>{lead}</motion.p>}
        {children && <motion.div className="page-header-extra" {...item(0.28)}>{children}</motion.div>}
      </div>
      {!center && <motion.div className="container page-rule-wrap" aria-hidden="true"><motion.span className="page-rule" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease, delay: 0.35 }} /></motion.div>}
    </header>
  );
}
