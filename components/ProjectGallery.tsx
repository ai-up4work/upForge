"use client";

import Image from "next/image";
import { LightboxProvider, useLightbox } from "./Lightbox";
import Reveal from "./Reveal";
import { cld } from "@/lib/format";

function Grid({ images, title }: { images: string[]; title: string }) {
  const { open } = useLightbox();
  const items = images.map((src, i) => ({ src: cld(src, 2200), alt: `${title} screen ${i + 1}` }));
  return (
    <div className={`shots shots-${Math.min(images.length, 3)}`}>
      {images.map((src, i) => (
        <Reveal key={src + i} delay={(i % 2) * 0.08} className="shot">
          <button type="button" onClick={() => open(items, i)} aria-label={`View ${title} screen ${i + 1} full size`}>
            <Image src={cld(src, 1600)} alt={`${title} screen ${i + 1}`} fill sizes="(min-width: 900px) 600px, 100vw" style={{ objectFit: "cover" }} />
          </button>
        </Reveal>
      ))}
    </div>
  );
}

export default function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  if (!images.length) return null;
  return (
    <LightboxProvider>
      <Grid images={images} title={title} />
    </LightboxProvider>
  );
}
