"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Cover from "./Cover";
import { formatDate, readTime } from "@/lib/format";
import type { PostDTO } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;
const tagOf = (p: PostDTO) => p.metadata?.tag || p.tags?.[0] || "";

export default function PostIndex({ posts }: { posts: PostDTO[] }) {
  const reduce = useReducedMotion();
  const tags = useMemo(() => [...new Set(posts.map(tagOf).filter(Boolean))], [posts]);
  const [tag, setTag] = useState<string | null>(null);

  if (!posts.length) {
    return (
      <div className="container">
        <div className="empty"><h3>The first articles are on their way.</h3><p>Check back soon.</p></div>
      </div>
    );
  }

  const featured = !tag ? posts.find((p) => p.featured) ?? posts[0] : null;
  const rest = (tag ? posts.filter((p) => tagOf(p) === tag || p.tags?.includes(tag)) : posts).filter((p) => p !== featured);

  return (
    <div className="container">
      {featured && (
        <motion.div initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }}>
          <Link href={`/blog/${featured.slug}`} className="feature-post">
            <div className="feature-media">
              <Cover src={featured.image} alt={featured.title} priority sizes="(min-width: 900px) 640px, 100vw" />
            </div>
            <div className="feature-copy">
              <span className="label">Featured · {formatDate(featured.publishedAt, "short")}</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <span className="text-link">Read article <span className="chev" aria-hidden="true">›</span></span>
            </div>
          </Link>
        </motion.div>
      )}

      {tags.length > 1 && (
        <div className="filter-row" role="group" aria-label="Filter articles" style={{ marginTop: "4rem" }}>
          <button aria-pressed={!tag} onClick={() => setTag(null)}>All</button>
          {tags.map((t) => (
            <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
      )}

      <ul className="post-rows">
        {rest.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: Math.min(i, 4) * 0.05 }}
          >
            <Link href={`/blog/${p.slug}`} className="post-row">
              <span className="date">{formatDate(p.publishedAt, "short")}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
              <span className="meta">{tagOf(p) && <>{tagOf(p)} · </>}{readTime(p.content, p.metadata?.readTime)}</span>
              {p.image && (
                <span className="thumb"><Cover src={p.image} alt="" sizes="160px" width={400} /></span>
              )}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
