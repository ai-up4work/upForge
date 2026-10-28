"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Bold, Code, FileUp, Heading2, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Quote, Table } from "lucide-react";
import { uploadImage, useToast } from "./ui";

const Markdown = dynamic(() => import("@/components/Markdown"), { ssr: false, loading: () => <p className="a-hint">Loading preview…</p> });

type View = "write" | "preview" | "split";

/** Markdown editor with toolbar, live preview, inline image upload and .md import (images re-hosted on Cloudinary). */
export default function MarkdownEditor({ value, onChange, folder, id }: { value: string; onChange: (v: string) => void; folder: string; id: string }) {
  const toast = useToast();
  const ta = useRef<HTMLTextAreaElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<View>("split");
  const [busy, setBusy] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [mdFile, setMdFile] = useState<File | null>(null);
  const [mdImages, setMdImages] = useState<File[]>([]);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const el = ta.current;
    if (!el) return;
    const s = value.lastIndexOf("\n", el.selectionStart - 1) + 1;
    onChange(value.slice(0, s) + prefix + value.slice(s));
    requestAnimationFrame(() => el.focus());
  };
  const insert = (text: string) => {
    const el = ta.current;
    const pos = el ? el.selectionStart : value.length;
    onChange(value.slice(0, pos) + text + value.slice(pos));
  };

  const uploadInline = async (files: File[]) => {
    if (!files.length) return;
    setBusy(`Uploading ${files.length} image${files.length > 1 ? "s" : ""}…`);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, folder)));
      insert(urls.map((u, i) => `\n![${files[i].name.replace(/\.[^.]+$/, "")}](${u})\n`).join(""));
      toast.success("Image added to content");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const importMd = async () => {
    if (!mdFile) return;
    setBusy("Importing Markdown…");
    try {
      let md = await mdFile.text();
      const map: Record<string, string> = {};
      for (const f of mdImages) {
        const url = await uploadImage(f, folder);
        const names = [f.name, f.name.replace(/ /g, "%20")];
        names.forEach((n) => ["", "./", "images/", "./images/"].forEach((p) => (map[p + n] = url)));
      }
      let missing = 0;
      md = md.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (m, alt, path) => {
        if (/^https?:\/\//.test(path)) return m;
        const decoded = decodeURIComponent(path);
        const hit = map[path] || map[decoded] || map[decoded.split("/").pop() ?? ""];
        if (!hit) missing++;
        return hit ? `![${alt}](${hit})` : m;
      });
      onChange(md);
      toast.success(`Imported ${mdFile.name}${mdImages.length ? ` with ${mdImages.length} image${mdImages.length > 1 ? "s" : ""}` : ""}`);
      if (missing) toast.info(`${missing} image reference${missing > 1 ? "s" : ""} had no matching file. Upload those images and import again.`);
      setImportOpen(false);
      setMdFile(null);
      setMdImages([]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const words = value.split(/\s+/).filter(Boolean).length;
  const tools = [
    { icon: Heading2, label: "Heading", run: () => linePrefix("## ") },
    { icon: Bold, label: "Bold", run: () => wrap("**") },
    { icon: Italic, label: "Italic", run: () => wrap("_") },
    { icon: Link2, label: "Link", run: () => wrap("[", "](https://)", "link text") },
    { icon: Quote, label: "Quote", run: () => linePrefix("> ") },
    { icon: List, label: "Bulleted list", run: () => linePrefix("- ") },
    { icon: ListOrdered, label: "Numbered list", run: () => linePrefix("1. ") },
    { icon: Code, label: "Code block", run: () => wrap("\n```ts\n", "\n```\n", "code") },
    { icon: Table, label: "Table", run: () => insert("\n| Column | Column |\n| --- | --- |\n| Value | Value |\n") },
  ];

  return (
    <div className="a-md">
      <div className="a-md-bar">
        <div className="a-md-tools" role="toolbar" aria-label="Formatting">
          {tools.map((t) => (
            <button key={t.label} type="button" title={t.label} aria-label={t.label} onClick={t.run}><t.icon size={15} /></button>
          ))}
          <span className="sep" />
          <button type="button" title="Upload image into content" aria-label="Upload image into content" onClick={() => imgInput.current?.click()}><ImagePlus size={15} /></button>
          <button type="button" title="Import a .md file" aria-label="Import a .md file" onClick={() => setImportOpen((o) => !o)} className={importOpen ? "on" : undefined}><FileUp size={15} /></button>
        </div>
        <div className="a-seg" role="tablist" aria-label="Editor view">
          {(["write", "split", "preview"] as View[]).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}>{v[0].toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
      </div>

      {importOpen && (
        <div className="a-import">
          <p><strong>Import Markdown.</strong> Pick a .md file (Notion, Obsidian and Google Docs exports work) plus the images it references. Images are uploaded and links are rewritten automatically. This replaces the current content.</p>
          <div className="a-import-row">
            <label className="a-file">
              <input type="file" accept=".md,.markdown,text/markdown" onChange={(e) => setMdFile(e.target.files?.[0] ?? null)} />
              <span>{mdFile ? mdFile.name : "Choose .md file"}</span>
            </label>
            <label className="a-file">
              <input type="file" accept="image/*" multiple onChange={(e) => setMdImages(Array.from(e.target.files ?? []))} />
              <span>{mdImages.length ? `${mdImages.length} image${mdImages.length > 1 ? "s" : ""}` : "Choose images (optional)"}</span>
            </label>
            <button type="button" className="a-btn primary" disabled={!mdFile || !!busy} onClick={importMd}>Import</button>
          </div>
        </div>
      )}

      <div className={`a-md-panes ${view}`}>
        {view !== "preview" && (
          <textarea
            id={id}
            ref={ta}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
              if (files.length) {
                e.preventDefault();
                uploadInline(files);
              }
            }}
            onDrop={(e) => {
              const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
              if (files.length) {
                e.preventDefault();
                uploadInline(files);
              }
            }}
            placeholder={"## Overview\n\nWrite in Markdown. Paste or drop images to upload them."}
            spellCheck
          />
        )}
        {view !== "write" && (
          <div className="a-md-preview">
            {value.trim() ? <Markdown source={value} /> : <p className="a-hint">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
      <div className="a-md-foot">
        <span>{busy ? <><Loader2 className="spin" size={12} /> {busy}</> : "Markdown · paste or drop images to upload"}</span>
        <span>{words.toLocaleString()} words · {Math.max(1, Math.round(words / 220))} min read</span>
      </div>
      <input ref={imgInput} type="file" accept="image/*" multiple hidden onChange={(e) => { uploadInline(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
    </div>
  );
}
