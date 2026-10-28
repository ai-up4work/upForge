"use client";

import { useState } from "react";
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
    </motion.figure>
  );
}

function Grid({ images }: { images: GalleryImageDTO[] }) {
  const { open } = useLightbox();
  const items = images.map((g) => ({ src: g.large, alt: "" }));
  return <div className="masonry">{images.map((img, i) => <Tile key={img.id} img={img} i={i} onOpen={() => open(items, i)} />)}</div>;
}

export default function GalleryGrid({ images = [] }: { images?: GalleryImageDTO[] }) {
  if (!images.length) return <p className="empty-note">New photos from the studio will appear here.</p>;
  return <LightboxProvider><Grid images={images} /></LightboxProvider>;
}
