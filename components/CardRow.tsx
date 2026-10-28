"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
export type RowCard = { title: string; accent?: string; body: string; image?: string; meta?: string; icon?: ReactNode };

/** Reference-style outlined cards in a row; hovering one opens it. Number shown only when `numbered`. */
export default function CardRow({ cards, numbered = false }: { cards: RowCard[]; numbered?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="card-row-frame">
      <span className="card-row-topo" aria-hidden="true" />
      <ul className={`card-row n${cards.length}`} role="list">
        {cards.map((c, i) => (
          <motion.li
            key={c.title}
            className="rcard"
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, x: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease, delay: i * 0.08 }}
          >
            <span className="wcard-marker" aria-hidden="true" />
            {c.image ? (
              <span className="rcard-media"><Image src={c.image} alt="" fill sizes="(min-width: 900px) 25vw, 90vw" style={{ objectFit: "cover" }} /></span>
            ) : (
              <span className="rcard-icon" aria-hidden="true">{c.icon}</span>
            )}
            <span className="wcard-dot" aria-hidden="true" />
            <span className="rcard-title">{c.title.toUpperCase()}{c.accent && <em> {c.accent.toUpperCase()}</em>}</span>
            {numbered ? <span className="wcard-num">{String(i + 1).padStart(2, "0")}</span> : c.meta ? <span className="wcard-num">{c.meta}</span> : null}
            <span className="rcard-body">{c.body}</span>
            <span className="wcard-bar" aria-hidden="true" />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
