export function formatDate(iso?: string, style: "long" | "short" = "long") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "Asia/Colombo",
  });
}

export function readTime(markdown = "", given?: string) {
  if (given) return given;
  const words = markdown.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/** Ask Cloudinary for a resized, auto-format version of an image. Leaves other URLs untouched. */
export function cld(url: string | undefined, width: number) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Break a title into up to three balanced lines (uppercase), used for serif scene titles. */
export function titleLines(title: string) {
  const w = title.toUpperCase().trim().split(/\s+/);
  if (w.length <= 3) return w;
  const per = Math.ceil(w.length / 3);
  return [w.slice(0, per).join(" "), w.slice(per, per * 2).join(" "), w.slice(per * 2).join(" ")].filter(Boolean);
}

/** Split long text into `n` lines of roughly equal character length, keeping case. */
export function balanceLines(text: string, n = 2) {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return words;
  const target = text.length / n;
  const lines: string[] = [];
  let cur: string[] = [];
  for (const w of words) {
    const next = [...cur, w].join(" ");
    if (cur.length && next.length > target * 1.08 && lines.length < n - 1) {
      lines.push(cur.join(" "));
      cur = [w];
    } else cur.push(w);
  }
  if (cur.length) lines.push(cur.join(" "));
  return lines;
}
