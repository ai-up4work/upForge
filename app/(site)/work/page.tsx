import type { Metadata } from "next";
import WorkScene from "@/components/WorkScene";
import { getProjects } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, itemList } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Our Work: Websites, Apps & Software Projects",
  description: "Portfolio of websites, e-commerce stores, mobile apps, business systems and AI tools built by Upforge, a software company in Sri Lanka.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <JsonLd data={[breadcrumbs([{ name: "Work", path: "/work" }]), itemList("Upforge projects", projects.map((p) => ({ name: p.title, path: `/work/${p.slug}` })))]} />
      <h1 className="sr-only">Our work: websites, apps and software built in Sri Lanka</h1>
      <WorkScene projects={projects} />
    </>
  );
}
