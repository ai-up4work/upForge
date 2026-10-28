"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type Item = { src: string; alt?: string };
type Ctx = { open: (items: Item[], index: number) => void };

const LightboxContext = createContext<Ctx | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used inside <LightboxProvider>");
  return ctx;
}

/** Full-screen image viewer with keyboard (←, →, Esc) and swipe-friendly buttons. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = useCallback((list: Item[], i: number) => {
    setItems(list);
    setIndex(i);
  }, []);
  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback((d: number) => setIndex((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  const cur = items[index];

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {cur && (
              <motion.div
                className="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={cur.alt || "Image viewer"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={close}
              >
                <motion.img
                  key={cur.src}
                  src={cur.src}
                  alt={cur.alt || ""}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button className="lb-btn lb-close" aria-label="Close" onClick={close}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
                {items.length > 1 && (
                  <>
                    <button className="lb-btn lb-prev" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button className="lb-btn lb-next" aria-label="Next image" onClick={(e) => { e.stopPropagation(); step(1); }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                    <span className="lb-count">{index + 1} / {items.length}</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}
