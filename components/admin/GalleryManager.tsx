"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { Copy, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { uploadImage, useConfirm, useToast } from "./ui";
import type { GalleryImageDTO, ProjectDTO } from "@/lib/types";
import { cloudinaryId } from "@/lib/format";

type Group = "all" | "gallery" | "projects" | "blog";

export default function GalleryManager({ mediaRoot, cloudReady }: { mediaRoot: string; cloudReady: boolean }) {
  const toast = useToast();
  const confirm = useConfirm();
  const input = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group>("all");
  const [uploads, setUploads] = useState<{ name: string; pct: number }[]>([]);
  const [over, setOver] = useState(false);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [project, setProject] = useState(""); // "" = all projects

  const load = async () => {
    setLoading(true);
    try {
      const r = await (await fetch("/api/gallery?scope=all", { cache: "no-store" })).json();
      if (!r.success) throw new Error(r.error);
      setImages(r.data);
      const pr = await (await fetch("/api/projects", { cache: "no-store" })).json().catch(() => null);
      if (pr?.success) setProjects(pr.data);
    } catch {
      toast.error("Couldn't load images. Check the Cloudinary keys.");
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const groupOf = (id: string): Group => (id.includes("/Project_Images/") ? "projects" : id.includes("/Blog_Images/") ? "blog" : "gallery");
  const counts = useMemo(() => {
    const c: Record<Group, number> = { all: images.length, gallery: 0, projects: 0, blog: 0 };
    images.forEach((i) => c[groupOf(i.id)]++);
    return c;
  }, [images]);
  // Which project an image belongs to: used on the project (cover, screens, logo), or uploaded into its folder.
  const ownerOf = useMemo(() => {
    const byId = new Map<string, ProjectDTO>();
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    for (const p of projects) for (const u of [p.image, ...(p.images ?? []), ...(p.avatars ?? []).map((a) => a.src)]) {
      const id = cloudinaryId(u);
      if (id) byId.set(id, p);
    }
    return (img: GalleryImageDTO) => byId.get(img.id) ?? bySlug.get(img.id.match(/Project_Images\/([^/]+)\//)?.[1] ?? "");
  }, [projects]);
  const projectCounts = useMemo(() => {
    const c = new Map<string, number>();
    images.forEach((i) => { const p = ownerOf(i); if (p) c.set(p.slug, (c.get(p.slug) ?? 0) + 1); });
    return c;
  }, [images, ownerOf]);
  const byGroup = group === "all" ? images : images.filter((i) => groupOf(i.id) === group);
  const shown = project ? images.filter((i) => ownerOf(i)?.slug === project) : byGroup;

  const upload = async (files: File[]) => {
    if (!files.length) return;
    setUploads(files.map((f) => ({ name: f.name, pct: 0 })));
    const res = await Promise.allSettled(files.map((f, i) => uploadImage(f, `${mediaRoot}/gallery`, (pct) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, pct } : x))))));
    const ok = res.filter((r) => r.status === "fulfilled").length;
    setUploads([]);
    if (ok) toast.success(`${ok} photo${ok > 1 ? "s" : ""} added to the gallery`);
    if (ok < files.length) toast.error(`${files.length - ok} upload${files.length - ok > 1 ? "s" : ""} failed`);
    load();
  };

  const remove = async (img: GalleryImageDTO) => {
    const usedElsewhere = groupOf(img.id) !== "gallery";
    const ok = await confirm({
      title: "Delete this image?",
      body: usedElsewhere ? "This image belongs to a project or article. Deleting it will leave a broken image there." : "It will be removed from the gallery and from Cloudinary. This can't be undone.",
      confirmLabel: "Delete image",
      danger: true,
    });
    if (!ok) return;
    try {
      const r = await (await fetch(`/api/upload?publicId=${encodeURIComponent(img.id)}`, { method: "DELETE" })).json();
      if (!r.success) throw new Error(r.error || "Delete failed");
      setImages((x) => x.filter((i) => i.id !== img.id));
      toast.success("Image deleted");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image URL copied");
    } catch {
      toast.error("Couldn't copy. Open the image and copy its address instead.");
    }
  };

  if (!cloudReady) {
    return (
      <div className="a-empty">
        <h3>Connect Cloudinary to manage images</h3>
        <p>Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment, then redeploy.</p>
      </div>
    );
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    upload(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
  };

  return (
    <div className="a-gallery">
      <button type="button" className={`a-drop wide${over ? " over" : ""}`} onClick={() => input.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop} disabled={uploads.length > 0}>
        {uploads.length ? <Loader2 className="spin" size={22} /> : <ImagePlus size={22} />}
        <strong>{uploads.length ? `Uploading ${uploads.length} photo${uploads.length > 1 ? "s" : ""}… ${Math.round(uploads.reduce((a, u) => a + u.pct, 0) / uploads.length)}%` : "Drop photos here or click to upload"}</strong>
        <span>They go to the public Gallery page. Up to 10 MB each.</span>
      </button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { upload(Array.from(e.target.files ?? [])); e.target.value = ""; }} />

      <div className="a-toolbar">
        <div className="a-seg" role="tablist" aria-label="Filter images">
          {(["all", "gallery", "projects", "blog"] as Group[]).map((g) => (
            <button key={g} role="tab" aria-selected={!project && group === g} onClick={() => { setGroup(g); setProject(""); }}>
              {{ all: "All", gallery: "Gallery", projects: "Projects", blog: "Journal" }[g]} <span>{counts[g]}</span>
            </button>
          ))}
        </div>
        {projects.length > 0 && (
          <label className="a-proj-filter">
            <span>Project</span>
            <select value={project} onChange={(e) => setProject(e.target.value)} aria-label="Show images from one project">
              <option value="">All projects</option>
              {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title} ({projectCounts.get(p.slug) ?? 0})</option>)}
            </select>
          </label>
        )}
        <button className="a-btn ghost sm" onClick={load}><RefreshCw size={13} /> Refresh</button>
      </div>

      {loading ? (
        <div className="a-img-grid">{Array.from({ length: 8 }, (_, i) => <div className="a-img skeleton" key={i} />)}</div>
      ) : shown.length === 0 ? (
        <div className="a-empty"><h3>{project ? "No images found for this project" : "No images here yet"}</h3><p>Upload photos above and they'll appear on the Gallery page.</p></div>
      ) : (
        <div className="a-img-grid">
          {shown.map((img) => (
            <figure className="a-img" key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbnail} alt="" loading="lazy" />
              <figcaption>
                <span title={ownerOf(img)?.title}>{ownerOf(img)?.title ?? (groupOf(img.id) === "gallery" ? "Gallery" : groupOf(img.id) === "projects" ? "Project" : "Journal")} · {img.width}×{img.height}</span>
                <div>
                  <button aria-label="Copy image URL" title="Copy URL" onClick={() => copy(img.url)}><Copy size={13} /></button>
                  <button aria-label="Delete image" title="Delete" onClick={() => remove(img)}><Trash2 size={13} /></button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
