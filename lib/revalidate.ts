import "server-only";
import { revalidatePath } from "next/cache";

/** Refresh cached pages after content changes so the public site updates immediately. */
export function refreshSite(kind: "projects" | "blog" | "gallery", slugs: (string | undefined)[] = []) {
  revalidatePath("/");
  if (kind === "projects") {
    revalidatePath("/work");
    revalidatePath("/about");
    slugs.filter(Boolean).forEach((s) => revalidatePath(`/work/${s}`));
  }
  if (kind === "blog") {
    revalidatePath("/blog");
    slugs.filter(Boolean).forEach((s) => revalidatePath(`/blog/${s}`));
  }
  if (kind === "gallery") revalidatePath("/gallery");
  revalidatePath("/sitemap.xml");
}
