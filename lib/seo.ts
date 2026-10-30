import { site } from "./content";
import type { PostDTO, ProjectDTO } from "./types";
import type { ServicePage } from "./services";

/** JSON-LD builders. Rendered with <JsonLd data={…} /> on each page. */
const abs = (path = "/") => new URL(path, site.url).toString();
const ORG_ID = abs("/#organization");

export const organization = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "Upforge Studio",
  alternateName: ["Upforge", "Up4Work"],
  description: site.description,
  url: abs("/"),
  logo: { "@type": "ImageObject", url: abs("/brand/upforge-logo-512.png"), width: 512, height: 512 },
  image: abs("/brand/upforge-lockup.png"),
  email: site.email,
  ...(site.phone ? { telephone: site.phone } : {}),
  address: {
    "@type": "PostalAddress",
    ...(site.street ? { streetAddress: site.street } : {}),
    addressLocality: "Colombo",
    addressRegion: "Western Province",
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 6.9271, longitude: 79.8612 },
  areaServed: [{ "@type": "Country", name: "Sri Lanka" }, "Worldwide"],
  knowsAbout: ["Web development", "Mobile app development", "Custom software development", "E-commerce development", "Artificial intelligence", "UI/UX design", "Next.js", "React", "React Native"],
  sameAs: [site.social.linkedin, site.social.instagram],
  priceRange: "$$",
});

export const website = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: abs("/"),
  name: "Upforge Studio",
  alternateName: "Up4Work",
  inLanguage: "en-LK",
  publisher: { "@id": ORG_ID },
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

export const faqPage = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const serviceSchema = (s: ServicePage) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.title.split("|")[0].trim(),
  serviceType: s.name,
  description: s.description,
  url: abs(`/services/${s.slug}`),
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "Sri Lanka" },
});

export const articleSchema = (p: PostDTO) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: p.title,
  description: p.seo?.metaDescription || p.description,
  image: p.image ? [abs(p.image)] : undefined,
  datePublished: p.publishedAt,
  dateModified: p.updatedAt || p.publishedAt,
  author: { "@type": "Organization", name: p.author || "Upforge Studio", url: abs("/about") },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: abs(`/blog/${p.slug}`),
  inLanguage: "en-LK",
});

export const projectSchema = (p: ProjectDTO) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: p.title,
  description: p.seo?.metaDescription || p.description,
  image: p.image ? abs(p.image) : undefined,
  dateCreated: p.publishedAt,
  keywords: p.tags?.join(", "),
  creator: { "@id": ORG_ID },
  url: abs(`/work/${p.slug}`),
  ...(p.link ? { sameAs: p.link } : {}),
});

export const itemList = (name: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});
