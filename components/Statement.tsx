"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { statement } from "@/lib/content";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ["#c9ccd3", "#0a0b0e"]);
  return (
    <motion.span className="w" style={{ color }}>
      {children}{" "}
    </motion.span>
  );
}

/** A paragraph whose words light up one by one as it scrolls through the viewport. */
export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");

  return (
    <section className="statement" id="studio">
      <div className="container">
        <p className="label" style={{ marginBottom: "2rem" }}>The studio</p>
        <p ref={ref} className="big" aria-label={statement}>
          {reduce
            ? statement
            : words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
        </p>
      </div>
    </section>
  );
}
