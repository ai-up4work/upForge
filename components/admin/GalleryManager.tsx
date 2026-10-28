"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { Copy, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { uploadImage, useConfirm, useToast } from "./ui";
import type { GalleryImageDTO } from "@/lib/types";

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

  const load = async () => {
    setLoading(true);
    try {
      const r = await (await fetch("/api/gallery?scope=all", { cache: "no-store" })).json();
      if (!r.success) throw new Error(r.error);
      setImages(r.data);
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
  const shown = group === "all" ? images : images.filter((i) => groupOf(i.id) === group);

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
            <button key={g} role="tab" aria-selected={group === g} onClick={() => setGroup(g)}>
              {{ all: "All", gallery: "Gallery", projects: "Projects", blog: "Journal" }[g]} <span>{counts[g]}</span>
            </button>
          ))}
        </div>
        <button className="a-btn ghost sm" onClick={load}><RefreshCw size={13} /> Refresh</button>
      </div>

      {loading ? (
        <div className="a-img-grid">{Array.from({ length: 8 }, (_, i) => <div className="a-img skeleton" key={i} />)}</div>
      ) : shown.length === 0 ? (
        <div className="a-empty"><h3>No images here yet</h3><p>Upload photos above and they'll appear on the Gallery page.</p></div>
      ) : (
        <div className="a-img-grid">
          {shown.map((img) => (
            <figure className="a-img" key={img.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbnail} alt="" loading="lazy" />
              <figcaption>
                <span>{groupOf(img.id) === "gallery" ? "Gallery" : groupOf(img.id) === "projects" ? "Project" : "Journal"} · {img.width}×{img.height}</span>
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
