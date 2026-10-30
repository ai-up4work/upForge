import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import WorkStrip from "@/components/WorkStrip";
import ServiceCards from "@/components/ServiceCards";
import Faq from "@/components/Faq";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { LogoMark } from "@/components/Logo";
import { SceneLink } from "@/components/Scene";
import { hero, steps } from "@/lib/content";
import { homeFaqs, services } from "@/lib/services";
import { faqPage } from "@/lib/seo";
import { getPosts, getProjects } from "@/lib/data";
import { formatDate, readTime } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const [all, posts] = await Promise.all([getProjects(), getPosts({ limit: 3 })]);
  const featured = all.filter((p) => p.featured);
  const projects = featured.length ? featured.slice(0, 4) : all.slice(0, 4);

  return (
    <>
      <JsonLd data={faqPage(homeFaqs)} />
      <Hero label={hero.label} title={hero.title} sub={hero.sub} />

      <section className="section home-intro" id="studio">
        <span className="home-intro-topo" aria-hidden="true" />
        <Reveal className="home-intro-inner">
          <p className="tracked">Software development company · Sri Lanka</p>
          <h2 className="serif-lg">We design and build software <span className="teal">people love to use</span></h2>
          <p className="home-intro-p">
            Upforge (formerly Up4Work) is a software company in Colombo, Sri Lanka. We build websites, web applications, mobile apps,
            custom business software and AI tools for growing businesses at home and abroad. One senior team, weekly progress you can see,
            and code you fully own.
          </p>
          <div className="home-intro-actions">
            <SceneLink href="/contact" className="btn-line"><span>Start a project</span><span aria-hidden="true">→</span></SceneLink>
            <SceneLink href="/work" className="tracked link-under">See the work</SceneLink>
          </div>
        </Reveal>
        <Reveal className="studio-card" delay={0.15}>
          <span className="studio-card-topo" aria-hidden="true" />
          <span className="studio-card-emblem" aria-hidden="true"><LogoMark /></span>
          <dl className="studio-facts">
            <div><dt>{String(all.length).padStart(2, "0")}</dt><dd>Products shipped, shown in our work</dd></div>
            <div><dt>1<small>day</small></dt><dd>Reply time on every new enquiry</dd></div>
            <div><dt>Weekly</dt><dd>Live demos you can click and test</dd></div>
            <div><dt>100<small>%</small></dt><dd>Of the code and designs are yours</dd></div>
          </dl>
          <ul className="studio-svcs" role="list">
            {services.map((s) => <li key={s.slug}><SceneLink href={`/services/${s.slug}`}>{s.name}</SceneLink></li>)}
          </ul>
        </Reveal>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Selected work</p><h2 className="serif-md">Products we&apos;ve shipped</h2></div>
        <WorkStrip projects={projects} />
        <div className="center-link"><SceneLink href="/work" className="tracked link-under">View all projects →</SceneLink></div>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Services</p><h2 className="serif-md">What we build</h2></div>
        <ServiceCards items={services} />
        <p className="swipe-hint" aria-hidden="true">Swipe <i /></p>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">How a build runs</p><h2 className="serif-md">Four stages, no surprises</h2></div>
        <ol className="mini-steps">
          {steps.map((st, i) => (
            <Reveal as="li" key={st.name}><span className="wcard-num">{String(i + 1).padStart(2, "0")}</span><strong>{st.name}</strong><span>{st.duration}</span><p>{st.body}</p></Reveal>
          ))}
        </ol>
      </section>

      {posts.length > 0 && (
        <section className="section">
          <div className="section-head"><p className="tracked">Journal</p><h2 className="serif-md">Notes from the studio</h2></div>
          <ul className="more-posts" role="list">
            {posts.map((m) => (
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

      <section className="section faq-split">
        <div className="section-head">
          <p className="tracked">Questions</p>
          <h2 className="serif-md">Frequently asked</h2>
          <p className="faq-side">Straight answers about cost, timelines and how we work. Anything else, ask us directly.</p>
          <SceneLink href="/contact" className="tracked link-under">Ask a question →</SceneLink>
        </div>
        <Faq items={homeFaqs} />
      </section>

      <ContactPanel />
      <Footer />
    </>
  );
}
