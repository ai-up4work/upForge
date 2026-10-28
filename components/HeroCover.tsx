"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Cover from "./Cover";

/** Large cover image that settles into place as it scrolls into view. */
export default function HeroCover({ src, alt }: { src?: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [32, 32] : [48, 32]);
  return (
    <div className="container" ref={ref}>
      <motion.div
        className="hero-cover"
        style={{ scale, borderRadius: radius }}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      >
        <Cover src={src} alt={alt} priority sizes="(min-width: 1180px) 1180px, 100vw" width={2200} />
      </motion.div>
    </div>
  );
}
