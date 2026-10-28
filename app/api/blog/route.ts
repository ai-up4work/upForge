import { BlogPost } from "@/lib/models";
import { collectionHandlers } from "@/lib/crud";

export const dynamic = "force-dynamic";
const h = collectionHandlers(BlogPost, "blog");
export const GET = h.list;
export const POST = h.create;
