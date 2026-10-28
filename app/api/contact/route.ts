import { NextResponse } from "next/server";
import connectDB, { isDbConfigured } from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { site } from "@/lib/content";

export const dynamic = "force-dynamic";

const hits = new Map<string, { n: number; t: number }>();
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Public: receive a project enquiry. Saves to MongoDB and/or forwards to NEXT_PUBLIC_FORM_ENDPOINT. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const h = hits.get(ip);
  if (h && now - h.t < 10 * 60_000 && h.n >= 5) {
    return NextResponse.json({ success: false, error: `Too many messages. Email ${site.email} instead.` }, { status: 429 });
  }
  hits.set(ip, h && now - h.t < 10 * 60_000 ? { n: h.n + 1, t: h.t } : { n: 1, t: now });

  const body = await req.json().catch(() => ({}));
  if (str(body.website, 200)) return NextResponse.json({ success: true }); // honeypot: silently accept bots

  const lead = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    company: str(body.company, 160),
    needs: Array.isArray(body.needs) ? body.needs.map((n: unknown) => str(n, 60)).filter(Boolean).slice(0, 8) : [],
    budget: str(body.budget, 60),
    timeline: str(body.timeline, 60),
    message: str(body.message, 5000),
    source: str(body.source, 200),
  };
  if (!lead.name) return NextResponse.json({ success: false, error: "Add your name so we know who to reply to." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return NextResponse.json({ success: false, error: "That email address looks incomplete." }, { status: 400 });

  let saved = false;
  let forwarded = false;
  if (isDbConfigured()) {
    try {
      await connectDB();
      await Lead.create(lead);
      saved = true;
    } catch (e) {
      console.error("lead save failed", e);
    }
  }
  if (site.formEndpoint) {
    try {
      const r = await fetch(site.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...lead, needs: lead.needs.join(", ") }) });
      forwarded = r.ok;
    } catch (e) {
      console.error("lead forward failed", e);
    }
  }
  if (!saved && !forwarded) {
    return NextResponse.json({ success: false, error: `We couldn't send that right now. Please email ${site.email}.` }, { status: 503 });
  }
  return NextResponse.json({ success: true });
}
