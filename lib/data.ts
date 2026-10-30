import "server-only";
import connectDB, { isDbConfigured } from "./mongodb";
import { BlogPost, Project } from "./models";
import { cloudinary, isCloudinaryConfigured, MEDIA_ROOT } from "./cloudinary";
import { demoGallery, demoPosts, demoProjects } from "./demo";
import type { GalleryImageDTO, PostDTO, ProjectDTO } from "./types";
import { cld } from "./format";
import { cloudinaryId } from "./cloudinary-id";

/** Server-side reads used by pages. Falls back to demo content only when no database is configured. */

const plain = <T,>(v: unknown): T => JSON.parse(JSON.stringify(v));
const byOrderThenDate = (a: { order: number; publishedAt: string }, b: { order: number; publishedAt: string }) =>
  a.order - b.order || +new Date(b.publishedAt) - +new Date(a.publishedAt);

export async function getProjects(opts: { featured?: boolean; limit?: number } = {}): Promise<ProjectDTO[]> {
  if (!isDbConfigured()) {
    let list = [...demoProjects].sort(byOrderThenDate);
    if (opts.featured) list = list.filter((p) => p.featured);
    return opts.limit ? list.slice(0, opts.limit) : list;
  }
  try {
    await connectDB();
    let q = Project.find(opts.featured ? { featured: true } : {}).sort({ order: 1, publishedAt: -1 });
    if (opts.limit) q = q.limit(opts.limit);
    return plain<ProjectDTO[]>(await q.lean());
  } catch (e) {
    console.error("getProjects failed:", e);
    return [];
  }
}

export async function getProject(slug: string): Promise<ProjectDTO | null> {
  if (!isDbConfigured()) return demoProjects.find((p) => p.slug === slug) ?? null;
  try {
    await connectDB();
    const doc = await Project.findOne({ slug }).lean();
    return doc ? plain<ProjectDTO>(doc) : null;
  } catch (e) {
    console.error("getProject failed:", e);
    return null;
  }
}

export async function getPosts(opts: { featured?: boolean; limit?: number; tag?: string } = {}): Promise<PostDTO[]> {
  if (!isDbConfigured()) {
    let list = [...demoPosts].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    if (opts.featured) list = list.filter((p) => p.featured);
    if (opts.tag) list = list.filter((p) => p.tags?.includes(opts.tag!));
    return opts.limit ? list.slice(0, opts.limit) : list;
  }
  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (opts.featured) filter.featured = true;
    if (opts.tag) filter.tags = { $in: [opts.tag] };
    let q = BlogPost.find(filter).sort({ publishedAt: -1 });
    if (opts.limit) q = q.limit(opts.limit);
    return plain<PostDTO[]>(await q.lean());
  } catch (e) {
    console.error("getPosts failed:", e);
    return [];
  }
}

export async function getPost(slug: string): Promise<PostDTO | null> {
  if (!isDbConfigured()) return demoPosts.find((p) => p.slug === slug) ?? null;
  try {
    await connectDB();
    const doc = await BlogPost.findOne({ slug }).lean();
    return doc ? plain<PostDTO>(doc) : null;
  } catch (e) {
    console.error("getPost failed:", e);
    return null;
  }
}

/**
 * Public gallery reads GALLERY_FOLDER (default: the whole media root, same as the original site).
 * Set GALLERY_FOLDER=Up4work-portfolio/gallery to show only photos uploaded in the Gallery tab.
 */
export async function getGallery(max = 500, folder = process.env.GALLERY_FOLDER || MEDIA_ROOT): Promise<GalleryImageDTO[]> {
  if (!isCloudinaryConfigured()) return demoGallery;
  try {
    const res = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("created_at", "desc")
      .max_results(Math.min(max, 500))
      .execute();
    const t = (id: string, o: Record<string, unknown>) => cloudinary.url(id, { quality: "auto", fetch_format: "auto", secure: true, ...o });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.resources.map((r: any) => ({
      id: r.public_id,
      url: r.secure_url,
      thumbnail: t(r.public_id, { width: 300, height: 300, crop: "fill" }),
      medium: t(r.public_id, { width: 800, crop: "limit" }),
      large: t(r.public_id, { width: 1920, crop: "limit" }),
      width: r.width,
      height: r.height,
      format: r.format,
      createdAt: r.created_at,
    }));
  } catch (e) {
    console.error("getGallery failed:", e);
    return [];
  }
}

/**
 * Gallery = studio photos (Cloudinary gallery folder) + every project image.
 * Images uploaded under a project's folder, or used on a project, are tagged with that project
 * so visitors can filter the wall to a single project.
 */
export async function getGalleryWithProjects(): Promise<GalleryImageDTO[]> {
  const [images, projects] = await Promise.all([getGallery(), getProjects()]);
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const seen = new Set<string>();
  const seenIds = new Set(images.map((i) => i.id));
  const out: GalleryImageDTO[] = images.map((img) => {
    seen.add(img.url);
    const m = img.id.match(/Project_Images\/([^/]+)\//);
    const p = m ? bySlug.get(m[1]) : undefined;
    return p ? { ...img, project: { slug: p.slug, title: p.title } } : img;
  });
  // tag gallery images that a project uses even if they live elsewhere
  const owner = new Map<string, ProjectDTO>();
  for (const p of projects) for (const u of [p.image, ...(p.images ?? [])]) { if (!u) continue; owner.set(u, p); const id = cloudinaryId(u); if (id) owner.set(id, p); }
  for (const img of out) {
    if (img.project) continue;
    const p = owner.get(img.id) ?? owner.get(img.url);
    if (p) img.project = { slug: p.slug, title: p.title };
  }
  // add project images that aren't in the gallery folder
  for (const p of projects) {
    [p.image, ...(p.images ?? [])].filter(Boolean).forEach((u, i) => {
      const id = cloudinaryId(u);
      if (seen.has(u) || (id && seenIds.has(id))) return;
      seen.add(u);
      out.push({ id: `${p.slug}-${i}`, url: u, thumbnail: cld(u, 300), medium: cld(u, 900), large: cld(u, 1920), width: 1600, height: 1000, project: { slug: p.slug, title: p.title } });
    });
  }
  return out;
}
