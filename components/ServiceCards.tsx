import Image from "next/image";
import { SceneLink } from "./Scene";
import type { ServicePage } from "@/lib/services";

/** Grid of service cards linking to the keyword landing pages. */
export default function ServiceCards({ items }: { items: ServicePage[] }) {
  return (
    <ul className="svc-grid" role="list">
      {items.map((s, i) => (
        <li key={s.slug}>
          <SceneLink href={`/services/${s.slug}`} className="svc-card">
            <span className="wcard-marker" aria-hidden="true" />
            <span className="svc-media"><Image src={s.image} alt="" fill sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 92vw" style={{ objectFit: "cover" }} /></span>
            <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="svc-name">{s.name}</span>
            <span className="svc-kicker">{s.kicker}</span>
            <span className="svc-go">Learn more <span aria-hidden="true">→</span></span>
            <span className="wcard-bar" aria-hidden="true" />
          </SceneLink>
        </li>
      ))}
    </ul>
  );
}
