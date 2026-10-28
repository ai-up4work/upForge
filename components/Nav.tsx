"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogoMark } from "./Logo";
import { SceneLink } from "./Scene";

const LEFT = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
];
const RIGHT = [
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/** Centred split navigation with the mark in the middle (ABOUT · WORK · ◆ · JOURNAL · CONTACT). */
export default function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const item = (n: { label: string; href: string }, i: number) => (
    <motion.li
      key={n.href}
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <SceneLink href={n.href} className="nav-item" aria-current={active(n.href) ? "page" : undefined}>
        {n.label}
      </SceneLink>
    </motion.li>
  );
  const dot = (k: string, i: number) => (
    <motion.li key={k} className="nav-dot" aria-hidden="true" initial={reduce ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.07 }} />
  );

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <nav aria-label="Main">
        <ul className="nav-row">
          {item(LEFT[0], 0)}
          {dot("d1", 1)}
          {item(LEFT[1], 1)}
          {dot("d2", 2)}
          <motion.li
            className="nav-logo-cell"
            initial={reduce ? false : { opacity: 0, y: -24, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <SceneLink href="/" className="nav-logo" aria-label="Upforge home">
              <LogoMark />
            </SceneLink>
          </motion.li>
          {dot("d3", 3)}
          {item(RIGHT[0], 2)}
          {dot("d4", 4)}
          {item(RIGHT[1], 3)}
        </ul>
        <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="nav-sheet" className="nav-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ul>
              {[{ label: "Home", href: "/" }, ...LEFT, RIGHT[0], { label: "Journal", href: "/blog" }, { label: "Gallery", href: "/gallery" }, RIGHT[1]].map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <SceneLink href={n.href} aria-current={n.href !== "/" && active(n.href) ? "page" : n.href === "/" && pathname === "/" ? "page" : undefined}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    {n.label}
                  </SceneLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
