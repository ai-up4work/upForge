"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { ExternalLink, FileText, FolderKanban, Image as ImageIcon, Inbox, LogOut, Menu, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import Logo from "@/components/Logo";
import { AdminProviders, useConfirm, useToast } from "./ui";
import Editor, { type Kind } from "./Editor";
import GalleryManager from "./GalleryManager";
import Inquiries from "./Inquiries";
import type { PostDTO, ProjectDTO } from "@/lib/types";

type Tab = Kind | "gallery" | "inquiries";
type Item = ProjectDTO & Partial<PostDTO>;

const TABS: { id: Tab; label: string; icon: typeof FileText; noun: string }[] = [
  { id: "projects", label: "Projects", icon: FolderKanban, noun: "project" },
  { id: "blog", label: "Journal", icon: FileText, noun: "article" },
  { id: "gallery", label: "Gallery", icon: ImageIcon, noun: "photo" },
  { id: "inquiries", label: "Inquiries", icon: Inbox, noun: "enquiry" },
];

const thumb = (u?: string) => (u && u.includes("res.cloudinary.com") ? u.replace("/upload/", "/upload/f_auto,q_auto,c_fill,w_160,h_120/") : u);
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

function Shell({ status }: { status: { db: boolean; cloud: boolean; mediaRoot: string } }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState<Tab>("projects");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Item | null | undefined>(undefined); // undefined = closed, null = new
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const h = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === h)) setTab(h);
  }, []);

  const load = useCallback(async (k: Tab) => {
    if (k === "gallery" || k === "inquiries") return;
    setLoading(true);
    try {
      const r = await (await fetch(`/api/${k}`, { cache: "no-store" })).json();
      if (!r.success) throw new Error(r.error);
      setItems(r.data);
    } catch {
      setItems([]);
      toast.error(status.db ? "Couldn't load content. Try refreshing." : "Database isn't connected. Add MONGODB_URI.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.db]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${tab}`);
    setQ("");
    load(tab);
  }, [tab, load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => [i.title, i.slug, i.description, ...(i.tags ?? [])].join(" ").toLowerCase().includes(s)) : items;
  }, [items, q]);

  const stats = useMemo(() => ({
    total: items.length,
    featured: items.filter((i) => i.featured).length,
    views: items.reduce((a, i) => a + (i.metadata?.views ?? 0), 0),
  }), [items]);

  const toggleFeatured = async (it: Item) => {
    setItems((x) => x.map((i) => (i.slug === it.slug ? { ...i, featured: !i.featured } : i)));
    try {
      const r = await (await fetch(`/api/${tab}/${encodeURIComponent(it.slug)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "toggleFeatured" }) })).json();
      if (!r.success) throw new Error(r.error);
      toast.success(it.featured ? "Removed from featured" : "Featured");
    } catch (e) {
      setItems((x) => x.map((i) => (i.slug === it.slug ? { ...i, featured: it.featured } : i)));
      toast.error((e as Error).message || "Couldn't update");
    }
  };

  const remove = async (it: Item) => {
    const ok = await confirm({ title: `Delete “${it.title}”?`, body: "It will be removed from the site and its images deleted from Cloudinary. This can't be undone.", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    try {
      const r = await (await fetch(`/api/${tab}/${encodeURIComponent(it._id || it.slug)}`, { method: "DELETE" })).json();
      if (!r.success) throw new Error(r.error);
      setItems((x) => x.filter((i) => i.slug !== it.slug));
      toast.success("Deleted");
    } catch (e) {
      toast.error((e as Error).message || "Delete failed");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  };

  const cur = TABS.find((t) => t.id === tab)!;
  const publicBase = tab === "projects" ? "/work" : "/blog";

  return (
    <div className="a-shell">
      <aside className={`a-side${navOpen ? " open" : ""}`}>
        <div className="a-brand"><Logo /> <span>upforge</span> <em>Studio</em></div>
        <nav>
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "on" : undefined} onClick={() => { setTab(t.id); setNavOpen(false); }}>
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="a-side-foot">
          <div className="a-status">
            <span className={status.db ? "ok" : "bad"}>Database {status.db ? "connected" : "not set"}</span>
            <span className={status.cloud ? "ok" : "bad"}>Images {status.cloud ? "connected" : "not set"}</span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> View site</a>
          <button onClick={logout}><LogOut size={16} /> Log out</button>
        </div>
      </aside>
      {navOpen && <div className="a-scrim" onClick={() => setNavOpen(false)} />}

      <main className="a-main">
        <header className="a-top">
          <button className="a-icon-btn a-menu" aria-label="Open navigation" onClick={() => setNavOpen(true)}><Menu size={18} /></button>
          <div>
            <h1>{cur.label}</h1>
            <p>{tab === "inquiries" ? "Project briefs sent from the contact page." : tab === "gallery" ? "Photos for the public gallery, plus every image used on the site." : `${stats.total} ${cur.noun}${stats.total === 1 ? "" : "s"} · ${stats.featured} featured · ${stats.views.toLocaleString()} views`}</p>
          </div>
          {tab !== "gallery" && tab !== "inquiries" && (
            <button className="a-btn primary" onClick={() => setEditing(null)} disabled={!status.db}>
              <Plus size={16} /> New {cur.noun}
            </button>
          )}
        </header>

        {!status.db && tab !== "gallery" && tab !== "inquiries" && (
          <div className="a-banner">Add <code>MONGODB_URI</code> to your environment to load and save content. The public site is showing demo content until then.</div>
        )}

        {tab === "inquiries" ? (
          <Inquiries dbReady={status.db} />
        ) : tab === "gallery" ? (
          <GalleryManager mediaRoot={status.mediaRoot} cloudReady={status.cloud} />
        ) : (
          <>
            <div className="a-search">
              <Search size={16} />
              <input type="search" placeholder={`Search ${cur.label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Search ${cur.label.toLowerCase()}`} />
              {q && <button aria-label="Clear search" onClick={() => setQ("")}><X size={14} /></button>}
            </div>

            <div className="a-list" role="table" aria-label={cur.label}>
              <div className="a-list-head" role="row">
                <span role="columnheader">{tab === "projects" ? "Project" : "Article"}</span>
                <span role="columnheader">Published</span>
                <span role="columnheader">Views</span>
                <span role="columnheader" className="sr-only">Actions</span>
              </div>
              {loading
                ? Array.from({ length: 4 }, (_, i) => <div className="a-row-item skeleton" key={i} />)
                : shown.length === 0
                  ? (
                    <div className="a-empty">
                      <h3>{q ? "No matches" : `No ${cur.noun}s yet`}</h3>
                      <p>{q ? "Try a different search." : `Create your first ${cur.noun} and it will appear on the site straight away.`}</p>
                      {!q && status.db && <button className="a-btn primary" onClick={() => setEditing(null)}><Plus size={16} /> New {cur.noun}</button>}
                    </div>
                  )
                  : shown.map((it) => (
                    <div className="a-row-item" role="row" key={it._id || it.slug}>
                      <button className="a-row-main" onClick={() => setEditing(it)} role="cell">
                        <span className="a-row-thumb">
                          {it.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb(it.image)} alt="" />
                          ) : <span>{it.title.slice(0, 1)}</span>}
                        </span>
                        <span className="a-row-text">
                          <strong>{it.title}</strong>
                          <span>{publicBase}/{it.slug}{it.tags?.length ? ` · ${it.tags.slice(0, 2).join(", ")}` : ""}</span>
                        </span>
                      </button>
                      <span role="cell" className="a-cell-date">{fmt(it.publishedAt)}</span>
                      <span role="cell" className="a-cell-views">{(it.metadata?.views ?? 0).toLocaleString()}</span>
                      <span role="cell" className="a-row-actions">
                        <button className={`a-star${it.featured ? " on" : ""}`} aria-pressed={it.featured} aria-label={it.featured ? "Unfeature" : "Feature"} title={it.featured ? "Featured" : "Feature"} onClick={() => toggleFeatured(it)}><Star size={15} /></button>
                        <a href={`${publicBase}/${it.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View on site" title="View on site"><ExternalLink size={15} /></a>
                        <button aria-label="Edit" title="Edit" onClick={() => setEditing(it)}><Pencil size={15} /></button>
                        <button aria-label="Delete" title="Delete" className="danger" onClick={() => remove(it)}><Trash2 size={15} /></button>
                      </span>
                    </div>
                  ))}
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {editing !== undefined && (tab === "projects" || tab === "blog") && (
          <Editor
            key={editing?.slug ?? "new"}
            kind={tab}
            item={editing}
            mediaRoot={status.mediaRoot}
            onClose={() => setEditing(undefined)}
            onSaved={() => { setEditing(undefined); load(tab); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminApp(props: { status: { db: boolean; cloud: boolean; mediaRoot: string } }) {
  return (
    <AdminProviders>
      <Shell {...props} />
    </AdminProviders>
  );
}
