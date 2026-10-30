"use client";

import Showcase from "./Showcase";
import { motion, useReducedMotion } from "motion/react";
import { LightboxProvider, useLightbox } from "./Lightbox";
import { cld } from "@/lib/format";

function Grid({ images, title }: { images: string[]; title: string }) {
  const { open } = useLightbox();
  const reduce = useReducedMotion();
  const items = images.map((src, i) => ({ src: cld(src, 2200), alt: `${title} screen ${i + 1}` }));
  return (
    <div className={`screens screens-${Math.min(images.length, 3)}`}>
      {images.map((src, i) => (
        <motion.button
          key={src + i}
          type="button"
          className="screen"
          onClick={() => open(items, i)}
          aria-label={`View ${title} screen ${i + 1} full size`}
          initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.1 }}
        >
          <span className="screen-inner"><Showcase single slug={`${title}-${i}`} title={`${title} screen ${i + 1}`} image={src} sizes="(min-width: 900px) 50vw, 100vw" /></span>
          <span className="screen-num tracked">{String(i + 1).padStart(2, "0")}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default function Screens({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;
  return <LightboxProvider><Grid images={images} title={title} /></LightboxProvider>;
}
