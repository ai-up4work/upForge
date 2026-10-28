import Image from "next/image";
import { cld } from "@/lib/format";

/** A cover image with a branded placeholder when no image exists. */
export default function Cover({ src, alt, sizes, priority, width = 1600, className }: { src?: string; alt: string; sizes: string; priority?: boolean; width?: number; className?: string }) {
  if (!src) {
    return (
      <div className={`cover-fallback ${className ?? ""}`} aria-hidden="true">
        <span>{alt.slice(0, 1)}</span>
      </div>
    );
  }
  return <Image src={cld(src, width)} alt={alt} fill sizes={sizes} priority={priority} className={className} style={{ objectFit: "cover" }} />;
}
