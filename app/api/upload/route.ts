import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { cloudinary, isCloudinaryConfigured, MEDIA_ROOT } from "@/lib/cloudinary";
import { refreshSite } from "@/lib/revalidate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const notConfigured = () =>
  NextResponse.json({ success: false, error: "Image uploads aren't set up. Add the Cloudinary keys to .env.local." }, { status: 500 });

/** Only allow folders inside the site's media root, e.g. "Up4work-portfolio/gallery". */
function safeFolder(input: string | null) {
  const f = (input || `${MEDIA_ROOT}/gallery`).replace(/\.\./g, "").replace(/[^A-Za-z0-9_\-/]/g, "").replace(/\/+/g, "/");
  return f.startsWith(MEDIA_ROOT) ? f : `${MEDIA_ROOT}/${f}`;
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isCloudinaryConfigured()) return notConfigured();
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folder = safeFolder(form.get("folder") as string | null);
    if (!file) return NextResponse.json({ success: false, error: "Choose a file to upload." }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ success: false, error: "Only image files can be uploaded." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ success: false, error: "Images must be under 10 MB." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash("md5").update(buffer).digest("hex");

    // Re-use an identical image if it's already in this folder
    try {
      const found = await cloudinary.search.expression(`folder:${folder}/* AND context.content_hash=${hash}`).max_results(1).execute();
      const hit = found.resources?.[0];
      if (hit) return NextResponse.json({ success: true, url: hit.secure_url, public_id: hit.public_id, width: hit.width, height: hit.height, reused: true });
    } catch {
      /* search is best-effort */
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: `${Date.now()}_${crypto.randomBytes(6).toString("hex")}`,
            resource_type: "image",
            context: `content_hash=${hash}|original_filename=${file.name.replace(/[|=]/g, "_")}`,
            transformation: [{ width: 2400, crop: "limit" }],
          },
          (err, res) => (err ? reject(err) : resolve(res)),
        )
        .end(buffer);
    });

    if (folder.includes("/gallery")) refreshSite("gallery");
    return NextResponse.json({ success: true, url: result.secure_url, public_id: result.public_id, width: result.width, height: result.height });
  } catch (e) {
    console.error("upload error", e);
    return NextResponse.json({ success: false, error: "Upload failed. Try again." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isCloudinaryConfigured()) return notConfigured();
  const publicId = new URL(req.url).searchParams.get("publicId");
  if (!publicId || !publicId.startsWith(MEDIA_ROOT)) {
    return NextResponse.json({ success: false, error: "Unknown image." }, { status: 400 });
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    refreshSite("gallery");
    return NextResponse.json({ success: result.result === "ok", result, error: result.result === "ok" ? undefined : "Image not found or already deleted." });
  } catch (e) {
    console.error("delete error", e);
    return NextResponse.json({ success: false, error: "Delete failed. Try again." }, { status: 500 });
  }
}
