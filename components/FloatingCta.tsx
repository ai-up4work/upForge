"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SceneLink } from "./Scene";

/** "Start a project" button that appears after the first screen, hidden on the contact page and near the footer CTA. */
export default function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => {
      const panel = document.querySelector(".cpanel-wrap");
      const nearPanel = panel ? panel.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShow(window.scrollY > window.innerHeight * 0.8 && !nearPanel);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [pathname]);
  if (pathname.startsWith("/contact")) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fcta" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <SceneLink href="/contact" className="fcta-btn">
            <span className="fcta-dot" aria-hidden="true" />
            <span>Start a project</span>
            <span aria-hidden="true">→</span>
          </SceneLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
