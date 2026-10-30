"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Loader2, X } from "lucide-react";
import { Field, Section, Switch, useConfirm, useToast } from "./ui";
import { CoverField, ImageListField } from "./MediaFields";
import MarkdownEditor from "./MarkdownEditor";
import { slugify } from "@/lib/format";
import { services as SERVICES } from "@/lib/services";
import type { PostDTO, ProjectDTO } from "@/lib/types";

export type Kind = "projects" | "blog";
type Item = Partial<ProjectDTO & PostDTO>;

type Form = {
  title: string; slug: string; description: string; image: string; images: string[]; content: string;
  tags: string; featured: boolean; order: number; publishedAt: string; readTime: string;
  link: string; avatars: string; author: string; tag: string; services: string[];
  metaTitle: string; metaDescription: string; ogImage: string;
};

const today = () => new Date().toISOString().slice(0, 10);
const toForm = (it?: Item): Form => ({
  title: it?.title ?? "", slug: it?.slug ?? "", description: it?.description ?? "", image: it?.image ?? "",
  images: it?.images ?? [], content: it?.content ?? "", tags: (it?.tags ?? []).join(", "),
  featured: it?.featured ?? false, order: it?.order ?? 0,
  publishedAt: it?.publishedAt ? new Date(it.publishedAt).toISOString().slice(0, 10) : today(),
  readTime: it?.metadata?.readTime ?? "", link: it?.link ?? "", avatars: (it?.avatars ?? []).map((a) => a.src).join(", "),
  author: it?.author ?? "", tag: it?.metadata?.tag ?? "", services: it?.services ?? [],
  metaTitle: it?.seo?.metaTitle ?? "", metaDescription: it?.seo?.metaDescription ?? "", ogImage: it?.seo?.ogImage ?? "",
});

/** Slide-over editor for a project or journal post. */
export default function Editor({ kind, item, mediaRoot, onClose, onSaved }: { kind: Kind; item: Item | null; mediaRoot: string; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const isNew = !item?._id && !item?.slug;
  const initial = useMemo(() => toForm(item ?? undefined), [item]);
  const [f, setF] = useState<Form>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const noun = kind === "projects" ? "project" : "article";
  const folder = `${mediaRoot}/${kind === "projects" ? "Project_Images" : "Blog_Images"}/${f.slug || "drafts"}`;

  const close = async () => {
    if (dirty && !(await confirm({ title: "Discard changes?", body: "Your edits haven't been saved.", confirmLabel: "Discard", danger: true }))) return;
    onClose();
  };

  const save = async () => {
    const e: typeof errors = {};
    if (!f.title.trim()) e.title = "Add a title.";
    if (!f.slug.trim()) e.slug = "Add a URL slug.";
    else if (!/^[a-z0-9-]+$/.test(f.slug)) e.slug = "Use lowercase letters, numbers and hyphens only.";
    if (!f.description.trim()) e.description = "Add a short summary.";
    if (kind === "projects" && !f.image) e.image = "Projects need a cover image.";
    if (!f.content.trim()) e.content = "Write some content.";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Check the highlighted fields.");
      requestAnimationFrame(() => document.querySelector(".a-drawer .a-error")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      slug: f.slug, title: f.title.trim(), description: f.description.trim(), image: f.image, content: f.content,
      tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean), featured: f.featured, order: Number(f.order) || 0,
      publishedAt: f.publishedAt, metadata: { readTime: f.readTime },
      seo: { metaTitle: f.metaTitle, metaDescription: f.metaDescription, ogImage: f.ogImage },
    };
    if (kind === "projects") {
      payload.images = f.images;
      payload.link = f.link;
      payload.services = f.services;
      payload.avatars = f.avatars.split(",").map((s) => ({ src: s.trim() })).filter((a) => a.src);
    } else {
      payload.author = f.author;
      payload.metadata.tag = f.tag;
    }
    setSaving(true);
    try {
      const id = item?._id || item?.slug;
      const res = await fetch(isNew ? `/api/${kind}` : `/api/${kind}/${encodeURIComponent(id!)}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const r = await res.json();
      if (!r.success) throw new Error(r.error || "Save failed");
      toast.success(isNew ? `${noun[0].toUpperCase() + noun.slice(1)} published` : "Changes saved");
      onSaved();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const metaTitle = f.metaTitle || f.title || "Page title";
  const metaDesc = f.metaDescription || f.description || "Summary shown in search results.";

  return (
    <motion.div className="a-drawer-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
      <motion.aside
        className="a-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? `New ${noun}` : `Edit ${noun}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="a-drawer-head">
          <div>
            <span className="a-eyebrow">{isNew ? `New ${noun}` : `Editing ${noun}`}</span>
            <h2>{f.title || "Untitled"}</h2>
          </div>
          <div className="a-row">
            {!isNew && item?.slug && (
              <a className="a-btn ghost sm" href={`/${kind === "projects" ? "work" : "blog"}/${item.slug}`} target="_blank" rel="noopener noreferrer">
                View <ExternalLink size={13} />
              </a>
            )}
            <button className="a-icon-btn" onClick={close} aria-label="Close editor"><X size={18} /></button>
          </div>
        </header>

        <div className="a-drawer-body">
          <Section title="Basics">
            <Field label="Title" htmlFor="f-title" error={errors.title}>
              <input id="f-title" value={f.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder={kind === "projects" ? "Alzia" : "How much does a web app cost?"} />
            </Field>
            <Field label="URL slug" htmlFor="f-slug" error={errors.slug} hint={`upforge…/${kind === "projects" ? "work" : "blog"}/${f.slug || "your-slug"}`}>
              <input id="f-slug" value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
            </Field>
            <Field label="Summary" htmlFor="f-desc" error={errors.description} hint={`${f.description.length}/200 · shown on cards and in search results`}>
              <textarea id="f-desc" rows={3} value={f.description} maxLength={400} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <div className="a-grid-2">
              <Field label="Tags" htmlFor="f-tags" hint="Comma separated, e.g. Web app, E-commerce">
                <input id="f-tags" value={f.tags} onChange={(e) => set("tags", e.target.value)} />
              </Field>
              <Field label="Publish date" htmlFor="f-date">
                <input id="f-date" type="date" value={f.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
              </Field>
            </div>
            <div className="a-grid-2">
              <Switch id="f-featured" checked={f.featured} onChange={(v) => set("featured", v)} label={kind === "projects" ? "Feature on the home page" : "Feature at the top of the journal"} />
              <Field label="Sort order" htmlFor="f-order" hint="Lower numbers show first">
                <input id="f-order" type="number" value={f.order} onChange={(e) => set("order", Number(e.target.value))} />
              </Field>
            </div>
          </Section>

          {kind === "projects" && (
            <Section title="Services provided" desc="Tick what you delivered. The project then appears under that service on the site and in the work filters.">
              <div className="a-checks">
                {SERVICES.map((s) => {
                  const on = f.services.includes(s.slug);
                  return (
                    <label key={s.slug} className={`a-check${on ? " on" : ""}`}>
                      <input type="checkbox" checked={on} onChange={() => set("services", on ? f.services.filter((x) => x !== s.slug) : [...f.services, s.slug])} />
                      <span>{s.name}</span>
                    </label>
                  );
                })}
              </div>
            </Section>
          )}

          <Section title="Media" desc={kind === "projects" ? "The cover shows on cards and at the top of the case study. Extra images appear in the Screens section." : "Optional cover image for the article."}>
            <Field label="Cover image" error={errors.image}>
              <CoverField id="f-cover" value={f.image} onChange={(v) => set("image", v)} folder={folder} />
            </Field>
            {kind === "projects" && (
              <Field label="Screens">
                <ImageListField value={f.images} onChange={(v) => set("images", v)} folder={folder} onMakeCover={(u) => { set("image", u); toast.info("Cover image updated"); }} />
              </Field>
            )}
          </Section>

          <Section title="Content">
            <Field label="Body" htmlFor="f-content" error={errors.content}>
              <MarkdownEditor id="f-content" value={f.content} onChange={(v) => set("content", v)} folder={folder} />
            </Field>
          </Section>

          <Section title="Details">
            {kind === "projects" ? (
              <div className="a-grid-2">
                <Field label="Live site link" htmlFor="f-link"><input id="f-link" type="url" placeholder="https://" value={f.link} onChange={(e) => set("link", e.target.value)} /></Field>
                <Field label="Read time" htmlFor="f-rt" hint="Leave empty to calculate"><input id="f-rt" placeholder="4 min read" value={f.readTime} onChange={(e) => set("readTime", e.target.value)} /></Field>
                <Field label="Team avatars" htmlFor="f-av" hint="Image URLs, comma separated"><input id="f-av" value={f.avatars} onChange={(e) => set("avatars", e.target.value)} /></Field>
              </div>
            ) : (
              <div className="a-grid-2">
                <Field label="Author" htmlFor="f-author"><input id="f-author" placeholder="Upforge" value={f.author} onChange={(e) => set("author", e.target.value)} /></Field>
                <Field label="Category" htmlFor="f-cat" hint="Used for the journal filters"><input id="f-cat" placeholder="Guides" value={f.tag} onChange={(e) => set("tag", e.target.value)} /></Field>
                <Field label="Read time" htmlFor="f-rt" hint="Leave empty to calculate"><input id="f-rt" placeholder="5 min read" value={f.readTime} onChange={(e) => set("readTime", e.target.value)} /></Field>
              </div>
            )}
          </Section>

          <Section title="Search & sharing" desc="Optional. Defaults to the title, summary and cover.">
            <div className="a-serp" aria-label="Search result preview">
              <span className="url">up4work.space › {kind === "projects" ? "work" : "blog"} › {f.slug || "slug"}</span>
              <span className="t">{metaTitle.slice(0, 60)}</span>
              <span className="d">{metaDesc.slice(0, 158)}</span>
            </div>
            <Field label="Search title" htmlFor="f-mt" hint={`${f.metaTitle.length}/60`}><input id="f-mt" value={f.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></Field>
            <Field label="Search description" htmlFor="f-md" hint={`${f.metaDescription.length}/158`}><textarea id="f-md" rows={2} value={f.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></Field>
            <Field label="Social image URL" htmlFor="f-og"><input id="f-og" type="url" value={f.ogImage} onChange={(e) => set("ogImage", e.target.value)} /></Field>
          </Section>
        </div>

        <footer className="a-drawer-foot">
          <span className="a-hint">{dirty ? "Unsaved changes · ⌘S to save" : "All changes saved"}</span>
          <div className="a-row">
            <button className="a-btn ghost" onClick={close}>Cancel</button>
            <button className="a-btn primary" onClick={save} disabled={saving}>
              {saving && <Loader2 className="spin" size={15} />}
              {isNew ? `Publish ${noun}` : "Save changes"}
            </button>
          </div>
        </footer>
      </motion.aside>
    </motion.div>
  );
}
