import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ServiceCards from "@/components/ServiceCards";
import Faq from "@/components/Faq";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { homeFaqs, services } from "@/lib/services";
import { breadcrumbs, faqPage, itemList } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Software Development Services in Sri Lanka",
  description: "Web development, mobile apps, custom business software, e-commerce, AI automation and UI/UX design from Upforge, a software company in Colombo, Sri Lanka.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="page">
      <JsonLd data={[breadcrumbs([{ name: "Services", path: "/services" }]), itemList("Software development services in Sri Lanka", services.map((s) => ({ name: s.name, path: `/services/${s.slug}` }))), faqPage(homeFaqs)]} />
      <PageIntro label="Services" lines={["Software", "development", "services"]} kicker="Colombo · Sri Lanka" />
      <section className="section">
        <Reveal><p className="statement">One senior team for the whole product: design, web, mobile, business systems and AI, built in Sri Lanka for clients at home and abroad.</p></Reveal>
      </section>
      <section className="section"><ServiceCards items={services} /><p className="swipe-hint" aria-hidden="true">Swipe <i /></p></section>
      <section className="section">
        <div className="section-head"><p className="tracked">Questions</p><h2 className="serif-md">Frequently asked</h2></div>
        <Faq items={homeFaqs} />
      </section>
      <ContactPanel />
      <Footer />
    </div>
  );
}
