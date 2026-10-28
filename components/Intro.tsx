"use client";

import { useEffect } from "react";

const U = "M8 18H20V40A12 12 0 0 0 44 40V12L56 4V40A24 24 0 0 1 8 40Z";
const EMBER = "M32 18.5l6 6-6 6-6-6z";
const KEY = "uf-intro";

/**
 * First-visit intro: the mark is drawn, the ember lights, the wordmark rises, then the curtain lifts.
 * An inline script decides before paint whether to show it, so returning visitors never see a flash.
 */
export default function Intro() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("uf-intro")) return;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
    const out = window.setTimeout(() => html.classList.add("uf-intro-out"), 2100);
    const done = window.setTimeout(() => html.classList.remove("uf-intro", "uf-intro-out"), 3000);
    return () => { window.clearTimeout(out); window.clearTimeout(done); };
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("uf-intro")}catch(e){}`,
        }}
      />
      <div className="intro" aria-hidden="true">
        <div className="intro-inner">
          <svg viewBox="0 0 64 64" className="intro-mark">
            <defs>
              <linearGradient id="intro-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E3EFFB" />
                <stop offset=".55" stopColor="#AECAE3" />
                <stop offset="1" stopColor="#6F95C2" />
              </linearGradient>
            </defs>
            <path className="intro-fill" d={U} fill="url(#intro-steel)" />
            <path className="intro-line" d={U} pathLength={1} />
            <path className="intro-ember" d={EMBER} />
          </svg>
          <p className="intro-word">
            {"UPFORGE".split("").map((c, i) => <span key={i} style={{ ["--i" as string]: i }}>{c}</span>)}
          </p>
          <p className="intro-sub">Studio · Sri Lanka</p>
        </div>
      </div>
    </>
  );
}
