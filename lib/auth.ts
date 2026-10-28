import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Admin sessions are signed tokens (HMAC-SHA256), so the cookie cannot be forged by hand.
 * Secret: SESSION_SECRET (recommended), falls back to PAGE_ACCESS_PASSWORD.
 */
export const SESSION_COOKIE = "uf_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET || process.env.PAGE_ACCESS_PASSWORD;
  if (!s) throw new Error("Set SESSION_SECRET and PAGE_ACCESS_PASSWORD in .env.local");
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, exp, sig] = parts;
  if (role !== "admin" || Number(exp) < Date.now() / 1000) return false;
  try {
    const expected = Buffer.from(sign(`${role}.${exp}`));
    const given = Buffer.from(sig);
    return expected.length === given.length && crypto.timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

export function checkPassword(input: string) {
  const correct = process.env.PAGE_ACCESS_PASSWORD;
  if (!correct || typeof input !== "string") return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(correct).digest();
  return crypto.timingSafeEqual(a, b);
}

export const sessionCookie = (token: string) => ({
  name: SESSION_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE,
});

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Use at the top of every write route: `const denied = await requireAdmin(); if (denied) return denied;` */
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ success: false, error: "Not signed in. Log in at /admin." }, { status: 401 });
}
