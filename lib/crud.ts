import "server-only";
import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import connectDB, { isDbConfigured } from "./mongodb";
import { requireAdmin } from "./auth";
import { destroyByUrls } from "./cloudinary";
import { refreshSite } from "./revalidate";

/**
 * Shared handlers for the projects and blog collections.
 * Reads are public. Every write requires a signed-in admin.
 */
type Kind = "projects" | "blog";
const isObjectId = (s: string) => /^[0-9a-fA-F]{24}$/.test(s);
const label = (k: Kind) => (k === "projects" ? "Project" : "Post");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;

const fail = (error: string, status = 500, extra?: object) => NextResponse.json({ success: false, error, ...extra }, { status });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean(body: any) {
  // never let clients write these
  const { _id, createdAt, updatedAt, __v, ...rest } = body ?? {};
  void _id; void createdAt; void updatedAt; void __v;
  if (rest.metadata) {
    delete rest.metadata.views;
    delete rest.metadata.likes;
  }
  return rest;
}

/** Turn { metadata: { readTime } } into { "metadata.readTime": … } so updates never wipe views/likes. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenNested(body: any) {
  const out = { ...body };
  for (const key of ["metadata", "seo"]) {
    if (out[key] && typeof out[key] === "object") {
      for (const [k, v] of Object.entries(out[key])) out[`${key}.${k}`] = v;
      delete out[key];
    }
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validationError(e: any) {
  if (e?.name === "ValidationError") {
    const fields = Object.keys(e.errors ?? {});
    return fail(`Missing or invalid: ${fields.join(", ")}`, 400, { details: fields });
  }
  if (e?.code === 11000) return fail("That slug is already used. Choose another.", 400);
  return null;
}

export function collectionHandlers(model: AnyModel, kind: Kind) {
  async function list(req: Request) {
    if (!isDbConfigured()) return fail("Database isn't configured. Add MONGODB_URI.", 503);
    try {
      await connectDB();
      const sp = new URL(req.url).searchParams;
      const filter: Record<string, unknown> = {};
      if (sp.get("featured") === "true") filter.featured = true;
      if (sp.get("tag")) filter.tags = { $in: [sp.get("tag")] };
      let q = model.find(filter).sort({ order: 1, publishedAt: -1 });
      const limit = Number(sp.get("limit"));
      if (limit > 0) q = q.limit(limit);
      return NextResponse.json({ success: true, data: await q.lean() });
    } catch (e) {
      console.error(`${kind} list error`, e);
      return fail(`Failed to load ${kind}`);
    }
  }

  async function create(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
      await connectDB();
      const body = clean(await req.json());
      if (!body.slug) return fail("Add a slug.", 400);
      if (await model.exists({ slug: body.slug })) return fail("That slug is already used. Choose another.", 400);
      const doc = await model.create(body);
      refreshSite(kind, [body.slug]);
      return NextResponse.json({ success: true, data: doc }, { status: 201 });
    } catch (e) {
      return validationError(e) ?? (console.error(e), fail(`Failed to create ${label(kind).toLowerCase()}`));
    }
  }

  return { list, create };
}

export function itemHandlers(model: AnyModel, kind: Kind) {
  type Ctx = { params: Promise<{ slug: string }> };
  const find = (id: string) => (isObjectId(id) ? model.findById(id) : model.findOne({ slug: id }));

  async function get(req: Request, { params }: Ctx) {
    if (!isDbConfigured()) return NextResponse.json({ success: false, error: "Database isn't configured" });
    try {
      const slug = decodeURIComponent((await params).slug);
      await connectDB();
      const doc = await find(slug).lean();
      if (!doc) return fail(`${label(kind)} not found`, 404);
      if (new URL(req.url).searchParams.get("incrementViews") !== "false") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model.updateOne({ _id: (doc as any)._id }, { $inc: { "metadata.views": 1 } }).catch(() => {});
      }
      return NextResponse.json({ success: true, data: doc });
    } catch (e) {
      console.error(e);
      return fail(`Failed to load ${label(kind).toLowerCase()}`);
    }
  }

  async function put(req: Request, { params }: Ctx) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
      const id = decodeURIComponent((await params).slug);
      await connectDB();
      const body = clean(await req.json());
      const existing = await find(id);
      if (!existing) return fail(`${label(kind)} not found`, 404);
      if (body.slug && body.slug !== existing.slug && (await model.exists({ slug: body.slug }))) {
        return fail("That slug is already used. Choose another.", 400);
      }
      const oldSlug = existing.slug;
      existing.set(flattenNested(body));
      await existing.save();
      refreshSite(kind, [oldSlug, existing.slug]);
      return NextResponse.json({ success: true, data: existing.toObject(), message: `${label(kind)} updated` });
    } catch (e) {
      return validationError(e) ?? (console.error(e), fail(`Failed to update ${label(kind).toLowerCase()}`));
    }
  }

  async function patch(req: Request, { params }: Ctx) {
    try {
      const id = decodeURIComponent((await params).slug);
      await connectDB();
      const body = await req.json();
      if (body.action === "incrementLikes") {
        const doc = await model.findOneAndUpdate(isObjectId(id) ? { _id: id } : { slug: id }, { $inc: { "metadata.likes": 1 } }, { new: true }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return doc ? NextResponse.json({ success: true, data: { likes: (doc as any).metadata?.likes ?? 0 } }) : fail("Not found", 404);
      }
      const denied = await requireAdmin();
      if (denied) return denied;
      const doc = await find(id);
      if (!doc) return fail(`${label(kind)} not found`, 404);
      if (body.action === "toggleFeatured") doc.featured = !doc.featured;
      else doc.set(flattenNested(clean(body)));
      await doc.save();
      refreshSite(kind, [doc.slug]);
      return NextResponse.json({ success: true, data: doc.toObject() });
    } catch (e) {
      return validationError(e) ?? (console.error(e), fail(`Failed to update ${label(kind).toLowerCase()}`));
    }
  }

  async function del(_req: Request, { params }: Ctx) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
      const id = decodeURIComponent((await params).slug);
      await connectDB();
      const doc = await (isObjectId(id) ? model.findByIdAndDelete(id) : model.findOneAndDelete({ slug: id }));
      if (!doc) return fail(`${label(kind)} not found`, 404);
      destroyByUrls([doc.image, ...(doc.images ?? [])]).catch(() => {});
      refreshSite(kind, [doc.slug]);
      return NextResponse.json({ success: true, data: doc, message: `${label(kind)} deleted` });
    } catch (e) {
      console.error(e);
      return fail(`Failed to delete ${label(kind).toLowerCase()}`);
    }
  }

  return { get, put, patch, del };
}
