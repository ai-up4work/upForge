import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/** Root folder that holds all site media (kept from the original project so existing images still show). */
export const MEDIA_ROOT = process.env.CLOUDINARY_ROOT_FOLDER || "Up4work-portfolio";

export const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

/** Extract the public_id from a Cloudinary delivery URL. */
export function publicIdFromUrl(url: string) {
  if (!url.includes("res.cloudinary.com")) return null;
  const m = url.match(/\/upload\/(?:[^/]+\/)*?v\d+\/(.+)\.\w+$/) || url.match(/\/v\d+\/(.+)\.\w+$/);
  return m?.[1] ?? null;
}

export async function destroyByUrls(urls: (string | undefined)[]) {
  if (!isCloudinaryConfigured()) return;
  const ids = urls.filter(Boolean).map((u) => publicIdFromUrl(u as string)).filter(Boolean) as string[];
  await Promise.allSettled(ids.map((id) => cloudinary.uploader.destroy(id)));
}

export { cloudinary };
