"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Ctx = { go: (href: string, bar?: string) => void; leaving: boolean };
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
  const [waiting, setWaiting] = useState(false);
  const [bar, setBar] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    clearTimers();
    setLeaving(false);
    setWaiting(false);
    // the image strip lingers for a beat while the next scene builds, as in the reference
    const t = setTimeout(() => setBar(null), 380);
    return () => clearTimeout(t);
  }, [pathname]);

  const go = useCallback(
    (href: string, img?: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === pathname && !url.hash && url.search === window.location.search) return;
      // same page, different filter (e.g. /work?service=…): no scene change, just go
      if (reduce || url.pathname === pathname) return router.push(href);
      clearTimers();
      router.prefetch(href);
      setLeaving(true);
      if (img) setBar(img);
      // Start loading almost at once: the exit animation plays while the next page loads,
      // instead of waiting for the animation and then for the page.
      timers.current.push(setTimeout(() => { router.push(href); window.scrollTo(0, 0); }, 280));
      // still loading after a moment: show that something is happening
      timers.current.push(setTimeout(() => setWaiting(true), 1100));
      // never leave a blank screen: fall back to a normal page load
      timers.current.push(setTimeout(() => window.location.assign(href), 9000));
    },
    [pathname, reduce, router],
  );

  return (
    <SceneCtx.Provider value={{ go, leaving }}>
      {children}
      {waiting && !bar && <div className="scene-loading" aria-hidden="true" />}
      <AnimatePresence>
        {bar && (
          <motion.div
            key={bar}
            className={`scene-bar${waiting ? " is-waiting" : ""}`}
            aria-hidden="true"
            style={{ backgroundImage: `url("${bar}")` }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, scaleY: 6, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>
    </SceneCtx.Provider>
  );
}

/** The part of the page that fades out between scenes (the nav stays put). */
export function SceneMain({ children }: { children: ReactNode }) {
  const { leaving } = useScene();
  return (
    <motion.div
      className="scene-root"
      animate={leaving ? { opacity: 0, scale: 0.97 } : { opacity: 1, scale: 1, transitionEnd: { transform: "none" } }}
      transition={{ duration: leaving ? 0.55 : 0.01, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Internal link that plays the scene exit before navigating. */
export function SceneLink({ href, children, onClick, bar, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; bar?: string }) {
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
        go(href, bar);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
