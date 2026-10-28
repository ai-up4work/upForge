"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

/** Thin progress bar under the nav while reading a long page. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="reading-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Counts one view per page load (same behaviour as the original API). */
export function ViewPing({ kind, slug }: { kind: "projects" | "blog"; slug: string }) {
  useEffect(() => {
    const key = `viewed:${kind}:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: still count */
    }
    fetch(`/api/${kind}/${encodeURIComponent(slug)}`, { cache: "no-store" }).catch(() => {});
  }, [kind, slug]);
  return null;
}

export function Share({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="share">
      <span className="label">Share</span>
      <div className="share-row">
        <button type="button" className="share-btn" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
        <a className="share-btn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}>LinkedIn</a>
        <a className="share-btn" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}>X</a>
        <a className="share-btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`}>WhatsApp</a>
      </div>
    </div>
  );
}
