import Link from "next/link";
import Cover from "./Cover";
import type { ProjectDTO } from "@/lib/types";

export default function ProjectCard({ p, large = false, priority = false }: { p: ProjectDTO; large?: boolean; priority?: boolean }) {
  return (
    <Link href={`/work/${p.slug}`} className={`project-card${large ? " large" : ""}`}>
      <div className="project-card-media">
        <Cover src={p.image || p.images?.[0]} alt={p.title} priority={priority} sizes={large ? "(min-width: 1180px) 1180px, 100vw" : "(min-width: 900px) 580px, 100vw"} />
        <span className="project-card-shine" aria-hidden="true" />
        <span className="project-card-go" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
        </span>
      </div>
      <div className="project-card-meta">
        <div>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
        <span className="cat">
          {(p.tags ?? []).slice(0, 2).join(" · ")}
          {p.publishedAt && <><br />{new Date(p.publishedAt).getFullYear()}</>}
        </span>
      </div>
    </Link>
  );
}
