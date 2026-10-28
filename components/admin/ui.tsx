"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

/* ---------------- Toasts ---------------- */
type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; text: string };
type ToastApi = { success: (t: string) => void; error: (t: string) => void; info: (t: string) => void };

const ToastCtx = createContext<ToastApi | null>(null);
export const useToast = () => {
  const c = useContext(ToastCtx);
  if (!c) throw new Error("useToast outside provider");
  return c;
};

/* ---------------- Confirm ---------------- */
type ConfirmOpts = { title: string; body?: string; confirmLabel?: string; danger?: boolean };
const ConfirmCtx = createContext<((o: ConfirmOpts) => Promise<boolean>) | null>(null);
export const useConfirm = () => {
  const c = useContext(ConfirmCtx);
  if (!c) throw new Error("useConfirm outside provider");
  return c;
};

export function AdminProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = useCallback((kind: ToastKind, text: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3500);
  }, []);
  const api: ToastApi = {
    success: (t) => push("success", t),
    error: (t) => push("error", t),
    info: (t) => push("info", t),
  };

  const [dialog, setDialog] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setDialog({ ...o, resolve })), []);
  const answer = (v: boolean) => {
    dialog?.resolve(v);
    setDialog(null);
  };
  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && answer(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  const Icon = { success: CheckCircle2, error: XCircle, info: Info };

  return (
    <ToastCtx.Provider value={api}>
      <ConfirmCtx.Provider value={confirm}>
        {children}
        <div className="a-toasts" aria-live="polite">
          <AnimatePresence>
            {toasts.map((t) => {
              const I = Icon[t.kind];
              return (
                <motion.div key={t.id} className={`a-toast ${t.kind}`} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.3 }}>
                  <I size={18} />
                  <span>{t.text}</span>
                  <button aria-label="Dismiss" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}><X size={14} /></button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {dialog && (
            <motion.div className="a-modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => answer(false)}>
              <motion.div className="a-modal" role="alertdialog" aria-modal="true" aria-labelledby="a-modal-title" initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}>
                {dialog.danger && <div className="a-modal-icon"><AlertTriangle size={22} /></div>}
                <h3 id="a-modal-title">{dialog.title}</h3>
                {dialog.body && <p>{dialog.body}</p>}
                <div className="a-modal-actions">
                  <button className="a-btn ghost" onClick={() => answer(false)} autoFocus>Cancel</button>
                  <button className={`a-btn ${dialog.danger ? "danger" : "primary"}`} onClick={() => answer(true)}>{dialog.confirmLabel ?? "Confirm"}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

/* ---------------- Small form parts ---------------- */
export function Field({ label, hint, htmlFor, children, error }: { label: string; hint?: string; htmlFor?: string; children: ReactNode; error?: string }) {
  return (
    <div className="a-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <span className="a-error">{error}</span> : hint ? <span className="a-hint">{hint}</span> : null}
    </div>
  );
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id: string }) {
  return (
    <label className="a-switch" htmlFor={id}>
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track"><span className="thumb" /></span>
      <span>{label}</span>
    </label>
  );
}

export function Section({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <section className="a-section">
      <header>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
      </header>
      <div className="a-section-body">{children}</div>
    </section>
  );
}

/* ---------------- Upload helper with progress ---------------- */
export function uploadImage(file: File, folder: string, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const r = JSON.parse(xhr.responseText);
        if (r.success) resolve(r.url);
        else reject(new Error(r.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}
