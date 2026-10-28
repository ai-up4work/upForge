"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { SceneLink } from "./Scene";
import { cld, formatDate, readTime } from "@/lib/format";
import type { PostDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
const tagOf = (p: PostDTO) => p.metadata?.tag || p.tags?.[0] || "";

export default function PostRows({ posts = [] }: { posts?: PostDTO[] }) {
  const reduce = useReducedMotion();
  const tags = useMemo(() => [...new Set(posts.map(tagOf).filter(Boolean))], [posts]);
  const [tag, setTag] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const shown = tag ? posts.filter((p) => tagOf(p) === tag || p.tags?.includes(tag)) : posts;
  const preview = posts.find((p) => p.slug === hover);

  if (!posts.length) return <p className="empty-note">The first articles are on their way.</p>;

  return (
    <div className="posts-wrap">
      {tags.length > 1 && (
        <div className="chip-row" role="group" aria-label="Filter articles">
          <button aria-pressed={!tag} onClick={() => setTag(null)}>All</button>
          {tags.map((t) => <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>)}
        </div>
      )}
      <div className="posts-grid">
        <ul className="post-rows" role="list" onMouseLeave={() => setHover(null)}>
          {shown.map((p, i) => (
            <motion.li key={p.slug} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: Math.min(i, 5) * 0.06 }}>
              <SceneLink href={`/blog/${p.slug}`} className="post-row" onMouseEnter={() => setHover(p.slug)} onFocus={() => setHover(p.slug)}>
                <span className="post-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="post-main">
                  <span className="post-date tracked">{formatDate(p.publishedAt, "short")}{tagOf(p) ? ` · ${tagOf(p)}` : ""}</span>
                  <span className="post-title">{p.title}</span>
                  <span className="post-desc">{p.description}</span>
                </span>
                <span className="post-read tracked">{readTime(p.content, p.metadata?.readTime)} <span aria-hidden="true">→</span></span>
              </SceneLink>
            </motion.li>
          ))}
        </ul>
        <div className="post-preview" aria-hidden="true">
          <div className="post-preview-frame">
            {(preview?.image || shown[0]?.image) && (
              <Image key={preview?.slug ?? shown[0]?.slug} src={cld(preview?.image || shown[0]?.image, 900)} alt="" fill sizes="30vw" style={{ objectFit: "cover" }} className="fade-in" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
