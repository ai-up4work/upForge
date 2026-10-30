import "./lab.css";
import { SceneLink } from "../Scene";
import { labOptions } from "@/lib/lab";

/** Floating switcher on the private hero lab pages. */
export default function LabBar({ n }: { n: number }) {
  const N = labOptions.length;
  const prev = n === 1 ? N : n - 1, next = n === N ? 1 : n + 1;
  const o = labOptions.find((x) => x.n === n)!;
  return (
    <div className="lab-bar" role="navigation" aria-label="Hero lab">
      <span className="lab-badge">Private · Hero lab</span>
      <SceneLink href={`/lab/hero/${prev}`} className="lab-arrow" aria-label="Previous option">‹</SceneLink>
      <span className="lab-name"><b>{String(n).padStart(2, "0")}</b> {o.name}</span>
      <SceneLink href={`/lab/hero/${next}`} className="lab-arrow" aria-label="Next option">›</SceneLink>
      <SceneLink href="/lab" className="lab-all">All options</SceneLink>
    </div>
  );
}
