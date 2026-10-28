"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProjectCard from "./ProjectCard";
import type { ProjectDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WorkGrid({ projects }: { projects: ProjectDTO[] }) {
  const reduce = useReducedMotion();
  const tags = useMemo(() => {
    const count = new Map<string, number>();
    projects.forEach((p) => p.tags?.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  }, [projects]);
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? projects.filter((p) => p.tags?.includes(tag)) : projects;

  if (!projects.length) {
    return (
      <div className="container">
        <div className="empty">
          <h3>Projects are on their way.</h3>
          <p>New case studies are being written up. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {tags.length > 1 && (
        <div className="filter-row" role="group" aria-label="Filter projects">
          <button aria-pressed={!tag} onClick={() => setTag(null)}>All <span>{projects.length}</span></button>
          {tags.map((t) => (
            <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
      )}
      <motion.div layout={!reduce} className="work-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout={!reduce}
              className={i === 0 && !tag ? "span-2" : undefined}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.9, ease, delay: (i % 2) * 0.08 }}
            >
              <ProjectCard p={p} large={i === 0 && !tag} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
