import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectScene from "@/components/ProjectScene";
import Markdown from "@/components/Markdown";
import Screens from "@/components/Screens";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SceneLink } from "@/components/Scene";
import ProjectGlyph from "@/components/ProjectGlyph";
import { ReadingProgress, Share, ViewPing } from "@/components/ArticleTools";
import { getProject, getProjects } from "@/lib/data";
import { formatDate, readTime } from "@/lib/format";
import { site } from "@/lib/content";
import { servicesOf } from "@/lib/services";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, projectSchema } from "@/lib/seo";

export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject(decodeURIComponent((await params).slug));
  if (!p) return { title: "Project not found" };
  return {
    title: p.seo?.metaTitle || `${p.title}: ${servicesOf(p)[0]?.name ?? (p.tags ?? [])[0] ?? "Software"} Project in Sri Lanka`,
    description: p.seo?.metaDescription || p.description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.seo?.metaTitle || p.title, description: p.seo?.metaDescription || p.description, type: "article" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);
  const [p, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!p) notFound();

  const cover = p.image || p.images?.[0];
  const shots = (p.images ?? []).filter((s) => s && s !== cover);
  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const year = new Date(p.publishedAt).getFullYear();
  const svcs = servicesOf(p);
  const kicker = [svcs[0]?.name ?? (p.tags ?? [])[0], String(year)].filter(Boolean).join(" · ");

  return (
    <article className="page">
      <JsonLd data={[projectSchema(p), breadcrumbs([{ name: "Work", path: "/work" }, { name: p.title, path: `/work/${p.slug}` }])]} />
      <ReadingProgress />
      <ViewPing kind="projects" slug={p.slug} />
      <ProjectScene p={p} kicker={kicker} />

      <section className="case">
        <Reveal className="case-meta">
          <dl>
            <div><dt className="tracked">Year</dt><dd>{year}</dd></div>
            {p.tags?.length ? <div><dt className="tracked">Scope</dt><dd>{p.tags.join(", ")}</dd></div> : null}
            {svcs.length > 0 && (
              <div>
                <dt className="tracked">Services provided</dt>
                <dd className="svc-chips">
                  {svcs.map((s) => <SceneLink key={s.slug} href={`/work?service=${s.slug}`} className="svc-chip">{s.name}</SceneLink>)}
                </dd>
              </div>
            )}
            <div><dt className="tracked">Published</dt><dd>{formatDate(p.publishedAt)}</dd></div>
            <div><dt className="tracked">Read</dt><dd>{readTime(p.content, p.metadata?.readTime)}</dd></div>
          </dl>
          {p.link && (
            <a className="btn-line" href={p.link} target="_blank" rel="noopener noreferrer">
              <span>Visit live site</span><span aria-hidden="true">↗</span>
            </a>
          )}
        </Reveal>
        <div className="case-body">
          <Reveal><p className="case-lead">{p.description}</p></Reveal>
          <Markdown source={p.content} />
          <Share title={p.title} url={`${site.url}/work/${p.slug}`} />
        </div>
      </section>

      {shots.length > 0 && (
        <section className="section">
          <div className="section-head"><p className="tracked">Screens</p><h2 className="serif-md">A closer look</h2></div>
          <Screens images={shots} title={p.title} />
          <div className="center-link"><SceneLink href={`/gallery?project=${p.slug}`} className="tracked link-under">All {p.title} images in the gallery →</SceneLink></div>
        </section>
      )}

      {next && (
        <section className="section">
          <SceneLink href={`/work/${next.slug}`} className="next-card">
            <span className="next-glyph"><ProjectGlyph p={next} /></span>
            <span className="next-text">
              <span className="tracked">Next project</span>
              <span className="serif-md">{next.title}</span>
            </span>
            <span className="next-go tracked">Open <span aria-hidden="true">→</span></span>
            <span className="wcard-bar" aria-hidden="true" />
          </SceneLink>
        </section>
      )}

      <ContactPanel title={["Want results", "like these?", "Let's talk"]} />
      <Footer />
    </article>
  );
}
