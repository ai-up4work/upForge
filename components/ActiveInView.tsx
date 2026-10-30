"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * On touch screens (no hover) the card "opens" while it sits in the middle of the screen,
 * the phone equivalent of hovering it on desktop.
 */
export default function ActiveInView({ children, className = "", as = "li" }: { children: ReactNode; className?: string; as?: "li" | "div" }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-30% 0px -30% 0px", threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`${className}${on ? " is-active" : ""}`}>
      {children}
    </Tag>
  );
}
