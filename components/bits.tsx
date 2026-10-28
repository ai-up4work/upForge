"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function ArrowIcon({ size = 16, diag = false }: { size?: number; diag?: boolean }) {
  return (
    <svg className="arrow-ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      {diag ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M4 12h15M13 6l6 6-6 6" />}
    </svg>
  );
}

export function useColomboTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit" });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Rectangular button with a separate arrow cell; fill wipes in on hover. */
export function Btn({ href, children, variant = "primary", onClick, type, disabled, className }: { href?: string; children: ReactNode; variant?: "primary" | "dark" | "light" | "ghost"; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; className?: string }) {
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      <span className="btn-arrow" aria-hidden="true"><ArrowIcon /></span>
    </>
  );
  const cls = `btn btn-${variant}${className ? ` ${className}` : ""}`;
  if (href) {
    const external = /^https?:|^mailto:/.test(href);
    return external ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
  }
  return <button type={type ?? "button"} className={cls} onClick={onClick} disabled={disabled}>{inner}</button>;
}

/** Headline lines that rise out of a mask, one after another. */
export function Lines({ lines, className, delay = 0, as: Tag = "h1" }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" }) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <motion.span
            className="line-in"
            initial={reduce ? false : { y: "108%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.08 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Image frame that opens like a shutter, with a slow inner parallax. */
export function RevealMedia({ children, className, ratio }: { children: ReactNode; className?: string; ratio?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  return (
    <motion.div
      ref={ref}
      className={`reveal-media${className ? ` ${className}` : ""}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      initial={reduce ? false : { clipPath: "inset(18% 8% 18% 8%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.div className="reveal-media-inner" style={{ y, scale: 1.12 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`kicker${light ? " light" : ""}`}>{children}</p>;
}
