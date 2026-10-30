import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import PageIntro from "@/components/PageIntro";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SceneLink } from "@/components/Scene";
import { ReadingProgress, Share, ViewPing } from "@/components/ArticleTools";
import { getPost, getPosts } from "@/lib/data";
import { balanceLines, cld, formatDate, readTime } from "@/lib/format";
import { site } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { articleSchema, breadcrumbs } from "@/lib/seo";

export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost(decodeURIComponent((await params).slug));
  if (!p) return { title: "Article not found" };
  return {
    title: p.seo?.metaTitle || p.title,
    description: p.seo?.metaDescription || p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.description, type: "article", publishedTime: p.publishedAt, modifiedTime: p.updatedAt, authors: [p.author || "Upforge Studio"] },
  };
}

export default async function PostPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const [p, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!p) notFound();
  const more = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const tag = p.metadata?.tag || p.tags?.[0];
  const lines = balanceLines(p.title, p.title.length > 48 ? 3 : 2);

  return (
    <article className="page">
      <JsonLd data={[articleSchema(p), breadcrumbs([{ name: "Journal", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }])]} />
      <ReadingProgress />
      <ViewPing kind="blog" slug={p.slug} />
      <PageIntro long label={`${tag ? `${tag} · ` : ""}${formatDate(p.publishedAt)}`} lines={lines} kicker={`${p.author || site.name} · ${readTime(p.content, p.metadata?.readTime)}`} />
      {p.image && (
        <Reveal className="article-cover">
          <span className="detail-cover-inner"><Image src={cld(p.image, 1800)} alt={p.title} fill priority sizes="(min-width: 1100px) 1000px, 92vw" style={{ objectFit: "cover" }} /></span>
        </Reveal>
      )}
      <section className="article">
        <p className="case-lead">{p.description}</p>
        <Markdown source={p.content} />
        <Share title={p.title} url={`${site.url}/blog/${p.slug}`} />
      </section>
      {more.length > 0 && (
        <section className="section">
          <div className="section-head"><p className="tracked">Keep reading</p><h2 className="serif-md">More from the journal</h2></div>
          <ul className="more-posts" role="list">
            {more.map((m) => (
              <li key={m.slug}>
                <SceneLink href={`/blog/${m.slug}`} className="more-post">
                  <span className="wcard-marker" aria-hidden="true" />
                  <span className="tracked">{formatDate(m.publishedAt, "short")}</span>
                  <span className="more-title">{m.title}</span>
                  <span className="wcard-num">{readTime(m.content, m.metadata?.readTime)}</span>
                  <span className="wcard-bar" aria-hidden="true" />
                </SceneLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ContactPanel />
      <Footer />
    </article>
  );
}
