"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cld } from "@/lib/format";
import type { ProjectDTO } from "@/lib/types";
import Reveal from "./Reveal";

/** Home page: featured projects from the database in a sideways carousel. */
export default function Work({ projects }: { projects: ProjectDTO[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".project");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 600) + 20), behavior: "smooth" });
  };

  if (!projects.length) return null;

  return (
    <section className="section" id="work">
      <div className="container">
        <div className="section-head work-head">
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <span className="label">Selected work</span>
            <h2>Built to be used.<br /><span style={{ color: "var(--mute)" }}>Every single day.</span></h2>
          </div>
          <div className="carousel-ctrls">
            <Link href="/work" className="text-link" style={{ marginRight: "0.75rem" }}>
              All work <span className="chev" aria-hidden="true">›</span>
            </Link>
            <button className="round" aria-label="Previous project" disabled={edge.start} onClick={() => page(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button className="round" aria-label="Next project" disabled={edge.end} onClick={() => page(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>
      <Reveal y={60}>
        <div className="carousel" ref={ref} onScroll={update} tabIndex={0} aria-label="Featured projects, scroll sideways">
          {projects.map((p, i) => {
            const img = p.image || p.images?.[0];
            return (
              <Link href={`/work/${p.slug}`} className="project" key={p.slug}>
                <div className="project-visual">
                  {img ? (
                    <Image className="obj-img" src={cld(img, 1400)} alt={p.title} fill sizes="(min-width: 900px) 760px, 86vw" priority={i === 0} style={{ objectFit: "cover" }} />
                  ) : (
                    <div className="cover-fallback"><span>{p.title.slice(0, 1)}</span></div>
                  )}
                </div>
                <div className="project-meta">
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                  <span className="cat">
                    {(p.tags ?? []).slice(0, 2).join(" · ")}
                    <br />
                    {new Date(p.publishedAt).getFullYear()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
