"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useColomboTime } from "./bits";
import { site } from "@/lib/content";

const NEEDS = ["Website", "Web app", "Mobile app", "AI & automation", "Business system", "UI/UX design"];
const BUDGETS = ["Under $3k", "$3k – $10k", "$10k – $30k", "$30k +", "Not sure yet"];
const TIMELINES = ["As soon as possible", "1 – 3 months", "3 – 6 months", "Flexible"];
const ease = [0.22, 1, 0.36, 1] as const;

function Chips({ name, options, value, onChange, multi = false }: { name: string; options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  return (
    <div className="chip-row" role="group" aria-label={name}>
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : on ? [] : [o])}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export default function ContactForm({ initialNeeds = [] }: { initialNeeds?: string[] }) {
  const reduce = useReducedMotion();
  const time = useColomboTime();
  const [needs, setNeeds] = useState<string[]>(initialNeeds.filter((n) => NEEDS.includes(n)));
  const [budget, setBudget] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
      needs,
      budget: budget[0] ?? "",
      timeline: timeline[0] ?? "",
      source: typeof window !== "undefined" ? document.referrer || window.location.pathname : "",
    };
    if (!payload.name) return setError("Add your name so we know who to reply to.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return setError("That email address looks incomplete.");
    setError("");
    setName(payload.name.split(" ")[0]);
    setStatus("sending");
    try {
      const r = await (await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })).json();
      if (!r.success) throw new Error(r.error || "Couldn't send");
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* selectable */
    }
  };

  return (
    <div className="contact-grid">
      <aside className="contact-side">
        <p className="tracked">What happens next</p>
        <ol className="steps">
          <li><span className="wcard-num">01</span><div><strong>We reply within one working day</strong><p>A real person from the team reads every brief.</p></div></li>
          <li><span className="wcard-num">02</span><div><strong>A 30-minute call</strong><p>We talk through goals, users and must-haves. No obligation.</p></div></li>
          <li><span className="wcard-num">03</span><div><strong>A fixed scope and quote</strong><p>You get a timeline and a price before any work starts.</p></div></li>
        </ol>
        <div className="contact-direct">
          <p className="tracked">Prefer email?</p>
          <span className="cpanel-email"><span className="selectable">{site.email}</span><button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button></span>
          <p className="tracked dim">Colombo · {time || "--:--"} · UTC+05:30</p>
        </div>
      </aside>

      <div className="contact-card">
        <span className="cpanel-topo" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div key="done" className="contact-done" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
              <span className="done-ring" aria-hidden="true"><svg viewBox="0 0 52 52"><motion.path d="M14 27l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} /></svg></span>
              <h2 className="serif-lg">Thank you,<br /><span className="teal">{name}.</span></h2>
              <p className="kicker-orange">Brief received</p>
              <p className="contact-done-p">We&apos;ll reply to you within one working day. If it&apos;s urgent, email <span className="selectable">{site.email}</span>.</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="brief" exit={{ opacity: 0, y: -12 }}>
              <fieldset>
                <legend className="tracked">What do you need?</legend>
                <Chips name="What do you need" options={NEEDS} value={needs} onChange={setNeeds} multi />
              </fieldset>
              <div className="brief-2">
                <div className="field"><label htmlFor="c-name">Your name</label><input id="c-name" name="name" autoComplete="name" placeholder="Nimal Perera" /></div>
                <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" /></div>
              </div>
              <div className="field"><label htmlFor="c-company">Company <span className="opt">optional</span></label><input id="c-company" name="company" autoComplete="organization" /></div>
              <fieldset>
                <legend className="tracked">Rough budget</legend>
                <Chips name="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
              </fieldset>
              <fieldset>
                <legend className="tracked">Timeline</legend>
                <Chips name="Timeline" options={TIMELINES} value={timeline} onChange={setTimeline} />
              </fieldset>
              <div className="field"><label htmlFor="c-msg">About the project</label><textarea id="c-msg" name="message" rows={4} placeholder="What are you building, who is it for, and what does success look like?" /></div>
              <input className="hp" tabIndex={-1} autoComplete="off" name="website" aria-hidden="true" />
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="btn-line" type="submit" disabled={status === "sending"}>
                <span>{status === "sending" ? "Sending…" : "Send brief"}</span>
                <span aria-hidden="true">→</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
