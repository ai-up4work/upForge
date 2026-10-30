import type { Metadata } from "next";
import ServiceArt from "@/components/ServiceArt";
import ProjectTile from "@/components/ProjectTile";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import Faq from "@/components/Faq";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { SceneLink } from "@/components/Scene";
import { servicesOf, getService, services } from "@/lib/services";
import { getProjects } from "@/lib/data";
import { breadcrumbs, faqPage, serviceSchema } from "@/lib/seo";
import { steps } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return { title: "Service not found" };
  return {
    title: { absolute: `${s.title} | Upforge` },
    keywords: [s.keyword, `${s.name} Sri Lanka`, `${s.name} Colombo`, `best ${s.keyword}`, ...s.matchTags.map((t) => `${t} Sri Lanka`)],
    description: s.description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.title, description: s.description, url: `/services/${s.slug}` },
  };
}

export default async function ServicePageView({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const projects = await getProjects();
  const related = projects.filter((p) => servicesOf(p).some((x) => x.slug === s.slug)).slice(0, 4);
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <div className="page">
      <JsonLd data={[serviceSchema(s), breadcrumbs([{ name: "Services", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }]), faqPage(s.faqs)]} />
      <PageIntro label={s.name} lines={s.h1} kicker={s.kicker} />

      <section className="section svc-hero">
        <Reveal className="svc-hero-media">
          <span className="detail-cover-inner"><ServiceArt slug={s.slug} /></span>
        </Reveal>
        <div className="svc-hero-copy">
          <Reveal><p className="case-lead">{s.intro}</p></Reveal>
          <Reveal>
            <div className="svc-actions">
              <SceneLink href={`/contact?need=${encodeURIComponent(s.need)}`} className="btn-line">
                <span>Get a fixed quote</span><span aria-hidden="true">→</span>
              </SceneLink>
              <span className="tracked dim">Reply within one working day</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">What you get</p><h2 className="serif-md">What we deliver</h2></div>
        <div className="deliver">
          <span className="cpanel-topo" aria-hidden="true" />
          <ul role="list">
            {s.deliverables.map((d, i) => (
              <Reveal as="li" key={d} delay={i * 0.04}><span className="wcard-num">{String(i + 1).padStart(2, "0")}</span>{d}</Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Who it&apos;s for</p><h2 className="serif-md">A good fit if you are</h2></div>
        <ul className="principles three" role="list">
          {s.goodFor.map((g) => (
            <Reveal as="li" key={g} className="principle"><span className="wcard-marker" aria-hidden="true" /><h3>{g}</h3></Reveal>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">How it runs</p><h2 className="serif-md">Four stages, fixed price</h2></div>
        <ol className="mini-steps">
          {steps.map((st, i) => (
            <Reveal as="li" key={st.name}><span className="wcard-num">{String(i + 1).padStart(2, "0")}</span><strong>{st.name}</strong><span>{st.duration}</span><p>{st.body}</p></Reveal>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Technology</p><h2 className="serif-md">Tools we use</h2></div>
        <ul className="tech-chips" role="list">{s.stack.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><p className="tracked">Projects with this service</p><h2 className="serif-md">{s.name} we&apos;ve delivered</h2></div>
          <ul className="ptile-grid" role="list">
            {related.map((p, i) => <ProjectTile key={p.slug} p={p} index={i} />)}
          </ul>
          <div className="center-link"><SceneLink href={`/work?service=${s.slug}`} className="tracked link-under">All {s.name.toLowerCase()} projects →</SceneLink></div>
        </section>
      )}

      <section className="section faq-split">
        <div className="section-head">
          <p className="tracked">Questions</p>
          <h2 className="serif-md">{s.name} FAQ</h2>
          <p className="faq-side">Common questions from businesses planning {s.name.toLowerCase()} work in Sri Lanka.</p>
          <SceneLink href={`/contact?need=${encodeURIComponent(s.need)}`} className="tracked link-under">Get a quote →</SceneLink>
        </div>
        <Faq items={s.faqs} />
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Also from Upforge</p><h2 className="serif-md">Other services</h2></div>
        <ul className="other-svcs" role="list">
          {others.map((o) => (
            <li key={o.slug}><SceneLink href={`/services/${o.slug}`}><span>{o.name}</span><span className="tracked dim">{o.keyword}</span><span aria-hidden="true">→</span></SceneLink></li>
          ))}
        </ul>
      </section>

      <ContactPanel title={["Let's build", "your", s.name.toLowerCase().includes("design") ? "product" : "project"]} />
      <Footer />
    </div>
  );
}
