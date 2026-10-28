import type { ProjectDTO } from "@/lib/types";

/**
 * The lavender mark shown on a project card: the project's logo (first avatar),
 * tinted to the card colour, or a geometric monogram when no logo exists.
 */
export default function ProjectGlyph({ p }: { p: ProjectDTO }) {
  const logo = p.avatars?.[0]?.src;
  if (logo) {
    return <span className="glyph glyph-logo" style={{ WebkitMaskImage: `url("${logo}")`, maskImage: `url("${logo}")` }} aria-hidden="true" />;
  }
  const letters = p.title.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const mono = letters.length > 1 ? (letters[0][0] + letters[1][0]).toUpperCase() : (letters[0] ?? "U")[0].toUpperCase();
  return (
    <span className="glyph glyph-mono" aria-hidden="true">
      {mono}
      <i />
    </span>
  );
}
