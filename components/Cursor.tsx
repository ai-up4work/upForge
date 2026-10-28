"use client";

import { useEffect, useRef } from "react";

/** Desktop-only trailing ring that swells over interactive elements. The native cursor stays. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ring.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      el.classList.add("on");
      const t = e.target as Element | null;
      el.classList.toggle("hot", !!t?.closest?.("a, button, [role=button], .rcard, input, textarea, select"));
    };
    const leave = () => el.classList.remove("on");
    const down = () => el.classList.add("press");
    const up = () => el.classList.remove("press");
    const tick = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  return <div ref={ring} className="cursor" aria-hidden="true"><span /></div>;
}
