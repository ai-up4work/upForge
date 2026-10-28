import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import PostRows from "@/components/PostRows";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import { getPosts } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/seo";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Journal: Software Guides for Sri Lankan Businesses",
  description: "Plain-language guides on website costs, app development, e-commerce and AI for businesses in Sri Lanka, from the Upforge team in Colombo.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="page">
      <JsonLd data={breadcrumbs([{ name: "Journal", path: "/blog" }])} />
      <PageIntro label="Journal" lines={["Notes from", "the studio"]} kicker={`${posts.length} article${posts.length === 1 ? "" : "s"}`} />
      <section className="section"><PostRows posts={posts} /></section>
      <ContactPanel />
      <Footer />
    </div>
  );
}
