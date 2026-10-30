import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LabHero from "@/components/lab/LabHero";
import LabBar from "@/components/lab/LabBar";
import Reveal from "@/components/Reveal";
import WorkStrip from "@/components/WorkStrip";
import ServiceCards from "@/components/ServiceCards";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import { LogoMark } from "@/components/Logo";
import { SceneLink } from "@/components/Scene";
import { isAdmin } from "@/lib/auth";
import { hero } from "@/lib/content";
import { services } from "@/lib/services";
import { getProjects } from "@/lib/data";
import type { LabVariant } from "@/components/lab/LabObject";

// Private: only rendered for a signed-in admin, never cached, never indexed.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hero lab",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function HeroLabPage({ params }: { params: Promise<{ variant: string }> }) {
  if (!(await isAdmin().catch(() => false))) notFound();
  const n = Number((await params).variant);
  if (![1, 2, 3, 4, 5].includes(n)) notFound();

  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  const projects = featured.length ? featured.slice(0, 4) : all.slice(0, 4);

  return (
    <>
      <LabBar n={n} />
      <LabHero variant={n as LabVariant} label={hero.label} title={hero.title} sub={hero.sub} />

      <section className="section home-intro" id="studio">
        <span className="home-intro-topo" aria-hidden="true" />
        <Reveal className="home-intro-inner">
          <p className="tracked">Software development company · Sri Lanka</p>
          <h2 className="serif-lg">We design and build software <span className="teal">people love to use</span></h2>
          <p className="home-intro-p">
            Upforge (formerly Up4Work) is a software company in Colombo, Sri Lanka. We build websites, web applications, mobile apps,
            custom business software and AI tools for growing businesses at home and abroad.
          </p>
          <div className="home-intro-actions">
            <SceneLink href="/contact" className="btn-line"><span>Start a project</span><span aria-hidden="true">→</span></SceneLink>
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
        </Reveal>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Selected work</p><h2 className="serif-md">Products we&apos;ve shipped</h2></div>
        <WorkStrip projects={projects} />
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Services</p><h2 className="serif-md">What we build</h2></div>
        <ServiceCards items={services} />
      </section>

      <ContactPanel />
      <Footer />
    </>
  );
}
