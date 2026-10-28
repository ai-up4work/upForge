import { isAdmin } from "@/lib/auth";
import { isDbConfigured } from "@/lib/mongodb";
import { isCloudinaryConfigured, MEDIA_ROOT } from "@/lib/cloudinary";
import AdminApp from "@/components/admin/AdminApp";
import Login from "@/components/admin/Login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <Login />;
  return <AdminApp status={{ db: isDbConfigured(), cloud: isCloudinaryConfigured(), mediaRoot: MEDIA_ROOT }} />;
}
