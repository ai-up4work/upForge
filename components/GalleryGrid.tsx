"use client";

import { useEffect, useMemo, useState } from "react";
import { SceneLink } from "./Scene";
import { motion, useReducedMotion } from "motion/react";
import { LightboxProvider, useLightbox } from "./Lightbox";
import type { GalleryImageDTO } from "@/lib/types";

function Tile({ img, i, onOpen }: { img: GalleryImageDTO; i: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const ratio = img.width && img.height ? `${img.width} / ${img.height}` : "4 / 3";
  return (
    <motion.figure className="g-tile" initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}>
      <button type="button" onClick={onOpen} style={{ aspectRatio: ratio }} aria-label="Open image full size">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }} src={img.medium} alt="" loading={i < 6 ? "eager" : "lazy"} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} className={loaded ? "is-loaded" : undefined} />
        <span className="g-num">{String(i + 1).padStart(2, "0")}</span>
      </button>
      {img.project && (
        <figcaption className="g-cap">
          <SceneLink href={`/work/${img.project.slug}`}>{img.project.title} <span aria-hidden="true">→</span></SceneLink>
        </figcaption>
      )}
    </motion.figure>
  );
}

function Grid({ images: all }: { images: GalleryImageDTO[] }) {
  const { open } = useLightbox();
  const [sel, setSel] = useState("");
  const groups = useMemo(() => {
    const m = new Map<string, { slug: string; title: string; n: number }>();
    let studio = 0;
    for (const g of all) {
      if (!g.project) { studio++; continue; }
      const x = m.get(g.project.slug) ?? { ...g.project, n: 0 };
      x.n++;
      m.set(g.project.slug, x);
    }
    return { projects: [...m.values()], studio };
  }, [all]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("project");
    if (q) setSel(q);
  }, []);
  const pick = (v: string) => {
    setSel(v);
    const url = new URL(window.location.href);
    if (v) url.searchParams.set("project", v); else url.searchParams.delete("project");
    window.history.replaceState(null, "", url);
  };
  const images = sel === "" ? all : sel === "studio" ? all.filter((g) => !g.project) : all.filter((g) => g.project?.slug === sel);
  const items = images.map((g) => ({ src: g.large, alt: g.project ? g.project.title : "" }));
  return (
    <>
      {groups.projects.length > 0 && (
        <nav className="work-filters g-filters" aria-label="Filter gallery by project">
          <button type="button" className={sel === "" ? "on" : undefined} onClick={() => pick("")}>All <sup>{all.length}</sup></button>
          {groups.studio > 0 && <button type="button" className={sel === "studio" ? "on" : undefined} onClick={() => pick("studio")}>Studio <sup>{groups.studio}</sup></button>}
          {groups.projects.map((p) => (
            <button type="button" key={p.slug} className={sel === p.slug ? "on" : undefined} onClick={() => pick(p.slug)}>{p.title} <sup>{p.n}</sup></button>
          ))}
        </nav>
      )}
      <div className="masonry" key={sel}>{images.map((img, i) => <Tile key={img.id} img={img} i={i} onOpen={() => open(items, i)} />)}</div>
    </>
  );
}

export default function GalleryGrid({ images = [] }: { images?: GalleryImageDTO[] }) {
  if (!images.length) return <p className="empty-note">New photos from the studio will appear here.</p>;
  return <LightboxProvider><Grid images={images} /></LightboxProvider>;
}
