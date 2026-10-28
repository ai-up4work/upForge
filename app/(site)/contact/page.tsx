import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact: Start a Software Project in Sri Lanka",
  description: "Tell Upforge about your website, app, business software or AI project. Get a fixed quote; we reply within one working day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ need?: string | string[] }> }) {
  const sp = await searchParams;
  const needs = Array.isArray(sp.need) ? sp.need : sp.need ? sp.need.split(",") : [];
  return (
    <div className="page">
      <JsonLd data={breadcrumbs([{ name: "Contact", path: "/contact" }])} />
      <PageIntro label="Start a project" lines={["Let's build", "something", "remarkable"]} kicker="Reply within one working day" />
      <section className="section"><ContactForm initialNeeds={needs} /></section>
      <Footer />
    </div>
  );
}
