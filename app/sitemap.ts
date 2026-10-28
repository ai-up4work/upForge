import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data";
import { site } from "@/lib/content";
import { services } from "@/lib/services";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const now = new Date();
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: u("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: u("/work"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: u("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: u("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: u("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: u("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...projects.map((p) => ({ url: u(`/work/${p.slug}`), lastModified: new Date(p.updatedAt || p.publishedAt), changeFrequency: "monthly" as const, priority: 0.7, images: p.image ? [new URL(p.image, site.url).toString()] : undefined })),
    ...posts.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: new Date(p.updatedAt || p.publishedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
