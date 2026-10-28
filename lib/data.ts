import "server-only";
import connectDB, { isDbConfigured } from "./mongodb";
import { BlogPost, Project } from "./models";
import { cloudinary, isCloudinaryConfigured, MEDIA_ROOT } from "./cloudinary";
import { demoGallery, demoPosts, demoProjects } from "./demo";
import type { GalleryImageDTO, PostDTO, ProjectDTO } from "./types";

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
