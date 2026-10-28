import Image from "next/image";
import { capabilities } from "@/lib/content";
import Reveal from "./Reveal";

export default function Capabilities() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <span className="label">What we build</span>
          <h2>Three things.<br /><span style={{ color: "var(--mute)" }}>Done properly.</span></h2>
        </div>
        <div className="caps">
          {capabilities.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08} className="cap">
              <div className="cap-media">
                <Image src={c.image} alt={c.name} fill sizes="(min-width: 900px) 380px, 100vw" style={{ objectFit: "cover" }} />
              </div>
              <h3>{c.name}</h3>
              <p>{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
