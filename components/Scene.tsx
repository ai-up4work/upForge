"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

type Ctx = { go: (href: string) => void; leaving: boolean };
const SceneCtx = createContext<Ctx>({ go: () => {}, leaving: false });
export const useScene = () => useContext(SceneCtx);

/**
 * Plays an exit animation (fade, slight zoom, blur) before every route change,
 * so pages hand over to each other like scenes instead of hard cuts.
 */
export function SceneProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLeaving(false);
    if (timer.current) clearTimeout(timer.current);
  }, [pathname]);

  const go = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === pathname && !url.hash) return;
      if (reduce) return router.push(href);
      router.prefetch(href);
      setLeaving(true);
      timer.current = setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
      }, 560);
    },
    [pathname, reduce, router],
  );

  return <SceneCtx.Provider value={{ go, leaving }}>{children}</SceneCtx.Provider>;
}

/** The part of the page that fades out between scenes (the nav stays put). */
export function SceneMain({ children }: { children: ReactNode }) {
  const { leaving } = useScene();
  return (
    <motion.div
      className="scene-root"
      animate={leaving ? { opacity: 0, scale: 0.965, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: leaving ? 0.55 : 0.01, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Internal link that plays the scene exit before navigating. */
export function SceneLink({ href, children, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { go } = useScene();
  const router = useRouter();
  return (
    <a
      href={href}
      onMouseEnter={() => router.prefetch(href)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || rest.target === "_blank") return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
