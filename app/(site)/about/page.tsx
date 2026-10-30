import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import CardRow from "@/components/CardRow";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { capabilities, principles, steps, techGroups, statement } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us: Software Company in Colombo",
  description: "Meet Upforge (formerly Up4Work), a software development company in Colombo, Sri Lanka. How we work, what we build and the tools we use.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page">
      <JsonLd data={breadcrumbs([{ name: "About", path: "/about" }])} />
      <PageIntro label="About the studio" lines={["A small studio", "for serious", "software"]} kicker="Colombo · Sri Lanka" />

      <section className="section">
        <Reveal><p className="statement">{statement}</p></Reveal>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">What we build</p><h2 className="serif-md">Three things, done properly</h2></div>
        <CardRow cards={capabilities.map((c) => ({ title: c.name.split(" ")[0], accent: c.name.split(" ").slice(1).join(" "), body: c.body, image: c.image }))} />
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">How a build runs</p><h2 className="serif-md">Four stages, no surprises</h2></div>
        <CardRow cards={steps.map((s, i) => ({ title: s.name, body: s.body, meta: s.duration, icon: <span className="stage-glyph">{String(i + 1).padStart(2, "0")}</span> }))} />
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Working with us</p><h2 className="serif-md">What you can count on</h2></div>
        <ul className="principles" role="list">
          {principles.map((p) => (
            <Reveal as="li" key={p.title} className="principle">
              <span className="wcard-marker" aria-hidden="true" />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-head"><p className="tracked">Our stack</p><h2 className="serif-md">Proven tools</h2></div>
        <div className="stack">
          {techGroups.map((g) => (
            <Reveal key={g.title} className="stack-group">
              <p className="tracked">{g.title}</p>
              <ul>{g.items.map((t) => <li key={t.name}>{t.name}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </section>

      <ContactPanel />
      <Footer />
    </div>
  );
}
