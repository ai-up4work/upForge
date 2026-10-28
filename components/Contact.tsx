"use client";

import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/lib/content";
import Reveal from "./Reveal";

const needs = ["Website", "Web app", "Mobile app", "AI tool", "Design"];

function useColomboTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit" });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Contact({ page = false }: { page?: boolean }) {
  const Heading = page ? "h1" : "h2";
  const time = useColomboTime();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "draft">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [firstName, setFirstName] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address stays selectable */
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name) return setError("Add your name so we know who to reply to.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("That email address looks incomplete.");
    setError("");
    setFirstName(name.split(" ")[0]);

    if (!site.formEndpoint) {
      setStatus("draft");
      return;
    }
    try {
      setStatus("sending");
      const res = await fetch(site.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(`We couldn't send that. Please email ${site.email} instead.`);
    }
  };

  return (
    <section className={`dark contact section${page ? " contact-page" : ""}`} id="contact">
      <div className="contact-aura" aria-hidden="true" />
      <div className="container contact-grid">
        <Reveal>
          <span className="label">Start a project</span>
          <Heading style={{ marginTop: "1.25rem" }}>
            Have an idea?
            <br />
            <span className="tone">Let&apos;s build it.</span>
          </Heading>
          <p className="lead">Tell us what you&apos;re making. We reply within one working day with next steps and a rough timeline.</p>
          <div className="direct">
            <div>
              <span className="k">Email</span>
              <span>
                <span style={{ userSelect: "all" }}>{site.email}</span>
                <button type="button" className="copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
              </span>
            </div>
            <div><span className="k">Studio</span><span>{site.city}{time && ` · ${time} local time`}</span></div>
            <div>
              <span className="k">Follow</span>
              <span style={{ display: "flex", gap: "1.25rem" }}>
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" autoComplete="name" placeholder="Nimal Perera" />
            </div>
            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
            </div>
            <div className="field">
              <fieldset>
                <legend>What do you need?</legend>
                <div className="opts">
                  {needs.map((n) => (
                    <label className="opt" key={n}>
                      <input type="checkbox" name="needs" value={n} id={`need-${n.replace(/\s/g, "-").toLowerCase()}`} />
                      <span>{n}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="field">
              <label htmlFor="f-msg">About the project</label>
              <textarea id="f-msg" name="message" placeholder="A few lines on what you want to build and by when." />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {status === "sent" && (
              <p className="form-done" role="status">Thanks, {firstName}. Your enquiry is on its way and we&apos;ll reply within one working day.</p>
            )}
            {status === "draft" && (
              <p className="form-done" role="status">
                Thanks, {firstName}. This form isn&apos;t connected to an inbox yet, so please send the same details to {site.email}.
              </p>
            )}
            <button className="pill light" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
              {status === "sending" ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
