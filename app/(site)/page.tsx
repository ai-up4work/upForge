import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import WorkStrip from "@/components/WorkStrip";
import ServiceCards from "@/components/ServiceCards";
import Faq from "@/components/Faq";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SceneLink } from "@/components/Scene";
import { hero, steps } from "@/lib/content";
import { homeFaqs, services } from "@/lib/services";
import { faqPage } from "@/lib/seo";
import { getPosts, getProjects } from "@/lib/data";
import { formatDate, readTime } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const [featured, posts] = await Promise.all([getProjects({ featured: true }), getPosts({ limit: 3 })]);
  const projects = featured.length ? featured : await getProjects({ limit: 4 });

  return (
    <>
      <JsonLd data={faqPage(homeFaqs)} />
      <Hero label={hero.label} title={hero.title} sub={hero.sub} />

      <section className="section home-intro" id="studio">
        <Reveal className="home-intro-inner">
          <p className="tracked">Software development company · Sri Lanka</p>
          <h2 className="serif-lg">We design and build software <span className="teal">people love to use</span></h2>
          <p className="home-intro-p">
            Upforge (formerly Up4Work) is a software company in Colombo, Sri Lanka. We build websites, web applications, mobile apps,
            custom business software and AI tools for growing businesses at home and abroad. One senior team, weekly progress you can see,
            and code you fully own.
          </p>
          <div className="home-intro-actions">
            <SceneLink href="/work" className="tracked link-under">See the work</SceneLink>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Selected work</p><h2 className="serif-md">Products we&apos;ve shipped</h2></div>
        <WorkStrip projects={projects} />
        <p className="swipe-hint" aria-hidden="true">Swipe <i /></p>
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

      <section className="section">
        <div className="section-head"><p className="tracked">Questions</p><h2 className="serif-md">Frequently asked</h2></div>
        <Faq items={homeFaqs} />
      </section>

      <ContactPanel />
      <Footer />
    </>
  );
}
