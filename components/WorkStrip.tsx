import ProjectTile from "./ProjectTile";
import type { ProjectDTO } from "@/lib/types";

/** Home page: featured projects as wide landscape cards (emblem first, screenshot on hover). */
export default function WorkStrip({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;
  return (
    <div className="strip-frame">
      <span className="card-row-topo" aria-hidden="true" />
      <ul className={`ptile-grid n${Math.min(projects.length, 4)}`} role="list">
        {projects.slice(0, 4).map((p, i) => <ProjectTile key={p.slug} p={p} index={i} />)}
      </ul>
    </div>
  );
}
