"use client";

import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Link2, Loader2, Star, Trash2 } from "lucide-react";
import { uploadImage, useToast } from "./ui";

const thumb = (url: string, w = 600) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/") ? url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${w}/`) : url;

function useDrop(onFiles: (f: File[]) => void) {
  const [over, setOver] = useState(false);
  return {
    over,
    bind: {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        if (files.length) onFiles(files);
      },
    },
  };
}

/** Cover image: drag-and-drop or click to upload to Cloudinary, or paste a URL. */
export function CoverField({ value, onChange, folder, id }: { value: string; onChange: (v: string) => void; folder: string; id: string }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const upload = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setPct(0);
    try {
      onChange(await uploadImage(f, folder, setPct));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setPct(null);
    }
  };
  const drop = useDrop(upload);

  return (
    <div className="a-media">
      {value ? (
        <div className="a-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(value, 1000)} alt="Cover preview" />
          <div className="a-cover-actions">
            <button type="button" className="a-btn sm glass" onClick={() => input.current?.click()}>Replace</button>
            <button type="button" className="a-btn sm glass" onClick={() => onChange("")} aria-label="Remove cover image"><Trash2 size={14} /></button>
          </div>
          {pct !== null && <div className="a-progress"><i style={{ width: `${pct}%` }} /></div>}
        </div>
      ) : mode === "upload" ? (
        <button type="button" className={`a-drop${drop.over ? " over" : ""}`} onClick={() => input.current?.click()} {...drop.bind} disabled={pct !== null}>
          {pct !== null ? <Loader2 className="spin" size={22} /> : <ImagePlus size={22} />}
          <strong>{pct !== null ? `Uploading… ${pct}%` : "Drop an image or click to upload"}</strong>
          <span>JPG, PNG or WebP up to 10 MB. 16:9 looks best.</span>
        </button>
      ) : (
        <div className="a-url-row">
          <input id={id} type="url" placeholder="https://…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onChange((e.target as HTMLInputElement).value.trim()); } }} />
          <button type="button" className="a-btn" onClick={(e) => onChange(((e.currentTarget.previousSibling as HTMLInputElement).value || "").trim())}>Use URL</button>
        </div>
      )}
      {!value && (
        <button type="button" className="a-link-btn" onClick={() => setMode(mode === "upload" ? "url" : "upload")}>
          {mode === "upload" ? <><Link2 size={13} /> Paste a URL instead</> : <><ImagePlus size={13} /> Upload a file instead</>}
        </button>
      )}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { upload(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
    </div>
  );
}

/** Ordered list of extra images: upload many at once, reorder, remove, set as cover. */
export function ImageListField({ value, onChange, folder, onMakeCover }: { value: string[]; onChange: (v: string[]) => void; folder: string; onMakeCover?: (url: string) => void }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ name: string; pct: number }[]>([]);
  const [url, setUrl] = useState("");

  const upload = async (files: File[]) => {
    setPending(files.map((f) => ({ name: f.name, pct: 0 })));
    const results = await Promise.allSettled(
      files.map((f, i) => uploadImage(f, folder, (pct) => setPending((p) => p.map((x, j) => (j === i ? { ...x, pct } : x))))),
    );
    const ok = results.filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled").map((r) => r.value);
    const failed = results.length - ok.length;
    onChange([...value, ...ok]);
    setPending([]);
    if (ok.length) toast.success(`${ok.length} image${ok.length > 1 ? "s" : ""} added`);
    if (failed) toast.error(`${failed} image${failed > 1 ? "s" : ""} failed to upload`);
  };
  const drop = useDrop(upload);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="a-media">
      <div className="a-thumbs">
        {value.map((src, i) => (
          <div className="a-thumb" key={src + i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb(src, 400)} alt={`Image ${i + 1}`} />
            <span className="a-thumb-n">{i + 1}</span>
            <div className="a-thumb-actions">
              <button type="button" aria-label="Move left" onClick={() => move(i, -1)} disabled={i === 0}><ArrowLeft size={13} /></button>
              <button type="button" aria-label="Move right" onClick={() => move(i, 1)} disabled={i === value.length - 1}><ArrowRight size={13} /></button>
              {onMakeCover && <button type="button" aria-label="Use as cover" title="Use as cover" onClick={() => onMakeCover(src)}><Star size={13} /></button>}
              <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, k) => k !== i))}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {pending.map((p) => (
          <div className="a-thumb pending" key={p.name}>
            <Loader2 className="spin" size={18} />
            <span>{p.pct}%</span>
          </div>
        ))}
        <button type="button" className={`a-thumb add${drop.over ? " over" : ""}`} onClick={() => input.current?.click()} {...drop.bind}>
          <ImagePlus size={20} />
          <span>Add images</span>
        </button>
      </div>
      <div className="a-url-row">
        <input type="url" placeholder="Or paste an image URL" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) { e.preventDefault(); onChange([...value, url.trim()]); setUrl(""); } }} />
        <button type="button" className="a-btn" disabled={!url.trim()} onClick={() => { onChange([...value, url.trim()]); setUrl(""); }}>Add</button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) upload(f); e.target.value = ""; }} />
    </div>
  );
}
