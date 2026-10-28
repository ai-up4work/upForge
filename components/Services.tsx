"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { services, type Service } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

function Art({ id }: { id: string }) {
  switch (id) {
    case "web":
      return (
        <div className="art art-web" aria-hidden="true">
          <div className="dots"><i /><i /><i /></div>
          <div className="bars">
            {[38, 52, 46, 64, 58, 76, 88].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      );
    case "mobile":
      return (
        <div className="art art-phone" aria-hidden="true">
          <div className="island" />
          <div className="scr">
            <div className="card" />
            <div className="row"><i /><b /></div>
            <div className="row"><i /><b /></div>
            <div className="row"><i /><b /></div>
          </div>
        </div>
      );
    case "ai":
      return <div className="art art-ai" aria-hidden="true" />;
    case "software":
      return (
        <pre className="art art-code" aria-hidden="true">
{`stock.reorder({
  sku: "TEA-250",
  when: `}<b>{`below(40)`}</b>{`
})`}
        </pre>
      );
    case "design":
      return <div className="art art-grid" aria-hidden="true" />;
    case "cloud":
      return (
        <div className="art art-pulse" aria-hidden="true">
          <i /> All systems normal
        </div>
      );
    default:
      return null;
  }
}

function Tile({ s, i }: { s: Service; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`tile ${s.tone} ${s.size}`}
      initial={reduce ? false : { opacity: 0, y: 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease, delay: (i % 3) * 0.08 }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.5, ease } }}
    >
      <span className="kick">{s.kicker}</span>
      <h3>{s.title}</h3>
      <p>{s.body}</p>
      {s.id === "cloud" && (
        <div className="uptime" aria-label="Uptime over the last 30 days">
          {Array.from({ length: 30 }, (_, k) => (
            <i key={k} className={k === 11 ? "dim" : undefined} />
          ))}
        </div>
      )}
      <div className="chips" style={s.id === "cloud" ? { marginTop: 0 } : undefined}>
        {s.stack.map((t) => (
          <span className="chip" key={t}>{t}</span>
        ))}
      </div>
      <Art id={s.id} />
    </motion.article>
  );
}

export default function Services({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className="section" id="services" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <span className="label">Services</span>
          <h2>
            Everything your product needs.
            <br />
            <span style={{ color: "var(--mute)" }}>Under one roof.</span>
          </h2>
          {showLink && (
            <Link href="/about" className="text-link">
              How we work <span className="chev" aria-hidden="true">›</span>
            </Link>
          )}
        </div>
        <div className="bento">
          {services.map((s, i) => (
            <Tile key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
