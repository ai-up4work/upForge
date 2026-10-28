"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LogoMark } from "./Logo";
import { SceneLink } from "./Scene";
import { useColomboTime } from "./bits";
import { site } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/** The closing call to action used at the end of every scrolling page. */
export default function ContactPanel({ title = ["Let's build", "something", "remarkable"] }: { title?: string[] }) {
  const reduce = useReducedMotion();
  const time = useColomboTime();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* address stays selectable */
    }
  };
  return (
    <section className="cpanel-wrap" aria-label="Start a project">
      <motion.div
        className="cpanel"
        initial={reduce ? false : { clipPath: "inset(0% 50% 0% 50%)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1.2, ease }}
      >
        <span className="cpanel-topo" aria-hidden="true" />
        <span className="cpanel-divider" aria-hidden="true" />
        <div className="cpanel-left">
          <span className="cpanel-emblem" aria-hidden="true"><LogoMark /></span>
          <h2 className="serif-lg">
            {title.map((l, i) => (
              <span key={i} className={i === title.length - 1 ? "teal" : undefined}>{l}<br /></span>
            ))}
          </h2>
          <span className="caret-down" aria-hidden="true" />
          <p className="kicker-orange">Start a project</p>
        </div>
        <div className="cpanel-right">
          <p className="cpanel-lead">Tell us what you&apos;re building. You&apos;ll hear back within one working day with next steps and a rough timeline.</p>
          <SceneLink href="/contact" className="btn-line">
            <span>Start a project</span>
            <span aria-hidden="true">→</span>
          </SceneLink>
          <div className="cpanel-mail">
            <span className="tracked">Or write to us</span>
            <span className="cpanel-email">
              <span className="selectable">{site.email}</span>
              <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            </span>
          </div>
          <p className="tracked dim">Colombo · {time || "--:--"} · UTC+05:30</p>
        </div>
      </motion.div>
    </section>
  );
}
