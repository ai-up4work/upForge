import Image from "next/image";
import { techGroups } from "@/lib/content";
import Reveal from "./Reveal";

export default function TechStack() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <span className="label">Our stack</span>
          <h2>Proven tools.<br /><span style={{ color: "var(--mute)" }}>Chosen for your project.</span></h2>
        </div>
        <Reveal>
          <div className="stack-grid">
            {techGroups.map((g) => (
              <div className="stack-group" key={g.title}>
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((t) => (
                    <li key={t.name}>
                      {"icon" in t && t.icon ? (
                        <Image src={t.icon} alt="" width={20} height={20} />
                      ) : (
                        <span className="stack-dot" aria-hidden="true">{t.name.slice(0, 1)}</span>
                      )}
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
