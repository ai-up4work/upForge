/** Cloudinary public id from a delivery URL (ignores transformations and version), e.g. "root/Project_Images/alzia/cover". */
export function cloudinaryId(url?: string) {
  if (!url || !url.includes("/upload/")) return null;
  const parts = url.split("/upload/")[1].split("?")[0].split("/");
  while (parts.length > 1 && (/^v\d+$/.test(parts[0]) || parts[0].includes(",") || /^[a-z]{1,3}_[^/]+$/.test(parts[0]))) parts.shift();
  return decodeURIComponent(parts.join("/")).replace(/\.[a-z0-9]+$/i, "");
}
