import { NextResponse } from "next/server";
import connectDB, { isDbConfigured } from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Admin: list enquiries, newest first. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isDbConfigured()) return NextResponse.json({ success: false, error: "Database isn't configured." }, { status: 503 });
  await connectDB();
  const data = await Lead.find().sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({ success: true, data });
}
