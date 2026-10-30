import "@/components/lab/lab.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import Footer from "@/components/Footer";
import { SceneLink } from "@/components/Scene";
import { isAdmin } from "@/lib/auth";
import { labOptions } from "@/lib/lab";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hero lab",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const Bar = ({ v }: { v: number }) => (
  <span className="lab-meter" aria-label={`${v} out of 5`}>{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < v ? "on" : undefined} />)}</span>
);

/** Private index of the hero candidates. Visible only to a signed-in admin. */
export default async function LabIndex() {
  if (!(await isAdmin().catch(() => false))) notFound();
  return (
    <div className="page">
      <PageIntro label="Private · not public" lines={["Hero", "lab"]} kicker="Pick the landing-page object" />
      <section className="section">
        <ul className="lab-grid" role="list">
          {[...labOptions].sort((a, b) => a.n - b.n).map((o) => (
            <li key={o.n}>
              <SceneLink href={`/lab/hero/${o.n}`} className="lab-card">
                {o.pick && <span className="lab-pick">Recommended</span>}
                <span className="wcard-num">{String(o.n).padStart(2, "0")}</span>
                <span className="lab-card-name">{o.name}</span>
                <span className="lab-card-line">{o.line}</span>
                <span className="lab-card-meta">
                  <span>Brand fit <Bar v={o.fit} /></span>
                  <span>Speed on phones <Bar v={o.speed} /></span>
                  <span>Build: {o.effort}</span>
                </span>
                <span className="tracked lab-open">Open full page →</span>
                <span className="wcard-bar" aria-hidden="true" />
              </SceneLink>
            </li>
          ))}
        </ul>
        <p className="lab-note">These pages only open while you&apos;re signed in to the admin. Everyone else gets &ldquo;page not found&rdquo;, and search engines are told not to index them. Your live home page is unchanged.</p>
      </section>
      <Footer />
    </div>
  );
}
