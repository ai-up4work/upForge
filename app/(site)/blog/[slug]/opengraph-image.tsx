import { ogSize, renderOg } from "@/lib/og";
import { getPost } from "@/lib/data";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article from the Upforge journal";

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost(decodeURIComponent((await params).slug));
  return renderOg({ eyebrow: "Upforge journal", title: p?.title ?? "Journal", kicker: "Software · Sri Lanka", image: p?.seo?.ogImage || p?.image });
}
