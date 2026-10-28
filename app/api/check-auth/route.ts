import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await isAdmin();
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}
