import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Simple in-memory throttle: 8 attempts per 10 minutes per IP (per server instance).
const attempts = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (!process.env.PAGE_ACCESS_PASSWORD) {
    return NextResponse.json({ success: false, error: "Admin password isn't set. Add PAGE_ACCESS_PASSWORD to .env.local." }, { status: 500 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && now - a.t < 10 * 60_000 && a.n >= 8) {
    return NextResponse.json({ success: false, error: "Too many attempts. Wait 10 minutes and try again." }, { status: 429 });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(password)) {
    attempts.set(ip, { n: a && now - a.t < 10 * 60_000 ? a.n + 1 : 1, t: a && now - a.t < 10 * 60_000 ? a.t : now });
    return NextResponse.json({ success: false, error: "That password isn't right." }, { status: 401 });
  }
  attempts.delete(ip);
  const res = NextResponse.json({ success: true });
  res.cookies.set(sessionCookie(createSessionToken()));
  return res;
}
