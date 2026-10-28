import { Project } from "@/lib/models";
import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";
const h = collectionHandlers(Project, "projects");
export const GET = h.list;
export const POST = h.create;
