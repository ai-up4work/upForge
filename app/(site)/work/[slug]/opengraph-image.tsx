import { ogSize, renderOg } from "@/lib/og";
import { getProject } from "@/lib/data";
import { servicesOf } from "@/lib/services";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Upforge project case study";

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject(decodeURIComponent((await params).slug));
  const svc = p ? servicesOf(p).map((s) => s.name).slice(0, 2).join(" · ") : "";
  return renderOg({
    eyebrow: "Case study · Upforge Sri Lanka",
    title: p?.title ?? "Project",
    kicker: svc || (p?.tags ?? []).slice(0, 2).join(" · ") || "Software project",
    image: p?.seo?.ogImage || p?.image || p?.images?.[0],
  });
}
