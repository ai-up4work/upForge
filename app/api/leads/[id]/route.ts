import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Lead } from "@/lib/models";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };
const valid = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!valid(id)) return NextResponse.json({ success: false, error: "Unknown enquiry" }, { status: 400 });
  const { status } = await req.json().catch(() => ({}));
  if (!["new", "contacted", "won", "closed"].includes(status)) return NextResponse.json({ success: false, error: "Unknown status" }, { status: 400 });
  await connectDB();
  const doc = await Lead.findByIdAndUpdate(id, { status }, { new: true }).lean();
  return doc ? NextResponse.json({ success: true, data: doc }) : NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!valid(id)) return NextResponse.json({ success: false, error: "Unknown enquiry" }, { status: 400 });
  await connectDB();
  const doc = await Lead.findByIdAndDelete(id);
  return doc ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
}
