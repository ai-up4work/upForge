import { ogSize, renderOg } from "@/lib/og";
import { getService, services } from "@/lib/services";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Upforge service in Sri Lanka";
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  return renderOg({ eyebrow: "Upforge · Colombo, Sri Lanka", title: s?.name ?? "Services", kicker: s?.kicker ?? "Software company Sri Lanka" });
}
