import ProjectTile from "./ProjectTile";
import FeaturedCards from "./FeaturedCards";
import "./FeaturedCards.css";
import type { ProjectDTO } from "@/lib/types";

/**
 * Home page "Selected work".
 * Desktop: a row of cards, the hovered one widens to show its screenshot (FeaturedCards). Phones: the landscape cards that open as you scroll.
 */
export default function WorkStrip({ projects }: { projects: ProjectDTO[] }) {
  if (!projects.length) return null;
  const list = projects.slice(0, 4);
  return (
    <>
      <div className="ws-desktop"><FeaturedCards projects={list} /></div>
      <div className="ws-mobile">
        <ul className={`ptile-grid n${list.length}`} role="list">
          {list.map((p, i) => <ProjectTile key={p.slug} p={p} index={i} />)}
        </ul>
      </div>
    </>
  );
}
