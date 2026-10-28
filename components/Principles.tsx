import { principles } from "@/lib/content";
import Reveal from "./Reveal";

const icons = [
  <path key="a" d="M3 12h4l3-8 4 16 3-8h4" />,
  <path key="b" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  <g key="c"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></g>,
  <g key="d"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
];

export default function Principles() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <span className="label">Working with us</span>
          <h2>Why teams choose Upforge.</h2>
        </div>
        <Reveal>
          <div className="principles">
            {principles.map((p, i) => (
              <div className="principle" key={p.title}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {icons[i]}
                </svg>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
