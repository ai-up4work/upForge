import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowIcon } from "./bits";

export default function ContactBand() {
  return (
    <section className="dark contact section">
      <div className="grain" aria-hidden="true" />
      <div className="contact-aura" aria-hidden="true" />
      <div className="container band">
        <Reveal>
          <span className="label">Start a project</span>
          <h2 style={{ marginTop: "1.25rem" }}>
            Have an idea?
            <br />
            <span className="tone">Let&apos;s build it.</span>
          </h2>
          <p className="lead">Tell us what you&apos;re making. We reply within one working day with next steps and a rough timeline.</p>
          <div className="band-actions">
            <Link href="/contact" className="pill light">Start a project <ArrowIcon /></Link>
            <Link href="/work" className="text-link">See our work <span className="chev" aria-hidden="true">›</span></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
