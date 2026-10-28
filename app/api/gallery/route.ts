import { NextResponse } from "next/server";
import { getGallery } from "@/lib/data";
import { MEDIA_ROOT } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

/** GET /api/gallery            → public gallery images
 *  GET /api/gallery?scope=all  → every image under the media root (used by the admin) */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const max = Number(sp.get("max")) || 500;
  const data = sp.get("scope") === "all" ? await getGallery(max, MEDIA_ROOT) : await getGallery(max);
  return NextResponse.json({ success: true, data, total: data.length });
}
