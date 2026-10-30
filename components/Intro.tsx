"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";

const KEY = "uf-intro";

/**
 * First-visit intro: your logo rises in, the wordmark follows, then the curtain lifts.
 * Self-contained: its styles live here (not in globals.css), and it is hidden unless the inline
 * script switches it on before paint, so it can never show up as a block on the page.
 * It always uses the current logo from Logo.tsx, and draws it: each shape's outline is traced, then filled.
 * (If the logo is ever an image instead of an SVG, it falls back to a soft wipe reveal.)
 */
const css = `
.uf-loader{display:none!important}
html.uf-intro{overflow:hidden}
html.uf-intro .uf-loader{display:grid!important;position:fixed;inset:0;z-index:1000;place-items:center;
  background:radial-gradient(70% 60% at 50% 45%,#0d1a4a,#00041c 70%);clip-path:inset(0 0 0 0);transition:clip-path .9s cubic-bezier(.76,0,.24,1)}
html.uf-intro-out .uf-loader{clip-path:inset(0 0 100% 0)}
.uf-loader-inner{display:grid;justify-items:center;gap:22px;transition:transform .8s cubic-bezier(.22,1,.36,1),opacity .6s}
html.uf-intro-out .uf-loader-inner{transform:translateY(-40px);opacity:0}
.uf-loader-mark{display:block;width:clamp(84px,11vw,132px);color:#c6dcf0;filter:drop-shadow(0 0 22px rgba(120,170,230,.25))}
.uf-loader-mark.is-wipe{clip-path:inset(100% 0 0 0);transform:translateY(18px) scale(.94);animation:uf-l-mark 1.1s cubic-bezier(.22,1,.36,1) .15s forwards}
.uf-loader-mark svg{display:block;width:100%;height:auto}
.uf-loader-word{display:flex;gap:.42em;margin:0;padding-left:.42em;overflow:hidden;font:600 clamp(1rem,1.6vw,1.35rem)/1 var(--sans,sans-serif);color:#eaf2fb}
.uf-loader-word span{display:block;transform:translateY(110%);animation:uf-l-rise .7s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(1.25s + var(--i)*50ms)}
.uf-loader-sub{margin:0;font:500 .62rem/1 var(--sans,sans-serif);letter-spacing:.3em;text-transform:uppercase;color:#f0b888;opacity:0;animation:uf-l-fade .6s ease 1.75s forwards}
@keyframes uf-l-mark{to{clip-path:inset(0 0 0 0);transform:none}}
@keyframes uf-l-rise{to{transform:none}}
@keyframes uf-l-fade{to{opacity:1}}
`;

export default function Intro() {
  // The logo is only mounted while the intro plays. A hidden copy left in the page would hold the
  // logo's gradient ids, and the nav logo would then point at an invisible gradient.
  const [active, setActive] = useState(false);
  const mark = useRef<HTMLSpanElement>(null);

  // Draw the logo: trace every shape's outline, then fade its fill in.
  useEffect(() => {
    const el = mark.current;
    if (!active || !el) return;
    const svg = el.querySelector("svg");
    const shapes = svg ? Array.from(svg.querySelectorAll<SVGGeometryElement>("path, circle, rect, ellipse, polygon, polyline, line")) : [];
    if (!svg || !shapes.length || typeof shapes[0].getTotalLength !== "function") {
      el.classList.add("is-wipe");
      return;
    }
    const vb = svg.viewBox.baseVal;
    const stroke = Math.max(0.5, ((vb && vb.width) || 64) / 90);
    const anims: Animation[] = [];
    shapes.forEach((sh, i) => {
      const len = sh.getTotalLength();
      sh.style.stroke = "#d6e6f8";
      sh.style.strokeWidth = String(stroke);
      sh.style.strokeLinejoin = "round";
      sh.style.strokeDasharray = String(len);
      sh.style.strokeDashoffset = String(len);
      sh.style.fillOpacity = "0";
      const delay = 150 + i * 260;
      anims.push(sh.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1050, delay, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }));
      anims.push(sh.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 600, delay: delay + 850, easing: "ease-out", fill: "forwards" }));
      anims.push(sh.animate([{ strokeOpacity: 1 }, { strokeOpacity: 0 }], { duration: 500, delay: delay + 1150, fill: "forwards" }));
    });
    return () => anims.forEach((a) => a.cancel());
  }, [active]);
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("uf-intro")) return;
    setActive(true);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
    const out = window.setTimeout(() => html.classList.add("uf-intro-out"), 2300);
    const done = window.setTimeout(() => {
      html.classList.remove("uf-intro", "uf-intro-out");
      setActive(false);
    }, 3200);
    return () => { window.clearTimeout(out); window.clearTimeout(done); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("uf-intro")}catch(e){}`,
        }}
      />
      <div className="uf-loader" aria-hidden="true">
        {active && (
          <div className="uf-loader-inner">
            <span className="uf-loader-mark" ref={mark}><LogoMark /></span>
            <p className="uf-loader-word">
              {"UPFORGE".split("").map((c, i) => <span key={i} style={{ ["--i" as string]: i }}>{c}</span>)}
            </p>
            <p className="uf-loader-sub">Studio · Sri Lanka</p>
          </div>
        )}
      </div>
    </>
  );
}
