import { SceneLink } from "./Scene";
import { LogoMark } from "./Logo";
import { site } from "@/lib/content";
import { services } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <SceneLink href="/" className="footer-logo" aria-label="Upforge home"><LogoMark /></SceneLink>
          <p>Upforge Studio (formerly Up4Work) is a software development company in Colombo, Sri Lanka, building websites, apps, business software and AI tools.</p>
          <p className="tracked dim">{site.email}</p>
        </div>
        <nav className="footer-col" aria-label="Services">
          <p className="tracked">Services</p>
          {services.map((s) => <SceneLink key={s.slug} href={`/services/${s.slug}`}>{s.keyword.replace(/^./, (c) => c.toUpperCase())}</SceneLink>)}
        </nav>
        <nav className="footer-col" aria-label="Studio">
          <p className="tracked">Studio</p>
          <SceneLink href="/about">About</SceneLink>
          <SceneLink href="/work">Work</SceneLink>
          <SceneLink href="/blog">Journal</SceneLink>
          <SceneLink href="/gallery">Gallery</SceneLink>
          <SceneLink href="/contact">Contact</SceneLink>
        </nav>
        <div className="footer-col">
          <p className="tracked">Follow</p>
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="/api/rss">RSS feed</a>
        </div>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} {site.legalName} · Colombo, Sri Lanka</p>
    </footer>
  );
}
