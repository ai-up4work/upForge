import Link from "next/link";
import { formatDate, readTime } from "@/lib/format";
import type { PostDTO } from "@/lib/types";
import Reveal from "./Reveal";

/** Home page: latest journal posts from the database. */
export default function Journal({ posts }: { posts: PostDTO[] }) {
  if (!posts.length) return null;
  return (
    <section className="section" id="journal" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head work-head">
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <span className="label">Journal</span>
            <h2>Notes from the studio.</h2>
          </div>
          <Link href="/blog" className="text-link">
            All articles <span className="chev" aria-hidden="true">›</span>
          </Link>
        </div>
        <div className="posts">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link className="post" href={`/blog/${p.slug}`} style={{ height: "100%" }}>
                <span className="label">{formatDate(p.publishedAt, "short")}{p.metadata?.tag ? ` · ${p.metadata.tag}` : ""}</span>
                <h3>{p.title}</h3>
                <div className="foot">
                  <span>{readTime(p.content, p.metadata?.readTime)}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
