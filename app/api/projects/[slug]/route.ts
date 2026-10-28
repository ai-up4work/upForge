import { Project } from "@/lib/models";
import { itemHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";
const h = itemHandlers(Project, "projects");
export const GET = h.get;
export const PUT = h.put;
export const PATCH = h.patch;
export const DELETE = h.del;
