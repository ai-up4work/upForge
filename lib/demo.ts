// Demo content used ONLY when MONGODB_URI is not set (e.g. first local run).
// With the database connected, the site always shows your real content.
import type { PostDTO, ProjectDTO, GalleryImageDTO } from "./types";

const md = (title: string) => `## Overview

${title} is an example case study shown because no database is connected yet. Connect MongoDB in \`.env.local\` and your real projects from the admin panel will appear here.

## What we built

- A fast, SEO-friendly storefront built with **Next.js**
- Secure checkout and order management
- An admin dashboard for products, stock and orders

> Every build ships with documentation and full access to the source code.

## Results

| Metric | Before | After |
| --- | --- | --- |
| Page load | 4.8s | 1.1s |
| Mobile conversion | 0.9% | 2.3% |
`;

export const demoProjects: ProjectDTO[] = [
  {
    slug: "alzia",
    title: "Alzia",
    description: "A premium storefront for natural cosmetics, built for speed, search and a calm shopping experience.",
    image: "/images/alzia-1.png",
    images: ["/images/alzia-1.png", "/images/alzia-2.png"],
    publishedAt: "2026-03-12T00:00:00.000Z",
    featured: true,
    order: 0,
    link: "https://alzia.vercel.app",
    tags: ["E-commerce", "Web app", "Next.js"],
    services: ["ecommerce-website-development-sri-lanka", "web-development-sri-lanka", "ui-ux-design-sri-lanka"],
    content: md("Alzia"),
    metadata: { readTime: "4 min read", views: 0 },
  },
  {
    slug: "custom-print-store",
    title: "Custom Print Store",
    description: "A quotation-first storefront for custom wristbands and merchandise, with free design support built into ordering.",
    image: "/images/mach.png",
    images: ["/images/mach.png", "/images/mach-2.png"],
    publishedAt: "2026-01-20T00:00:00.000Z",
    featured: true,
    order: 1,
    tags: ["E-commerce", "Quotations"],
    services: ["ecommerce-website-development-sri-lanka", "web-development-sri-lanka"],
    content: md("This storefront"),
  },
  {
    slug: "prayer-times-display",
    title: "Prayer Times Display",
    description: "A live digital-signage screen for a mosque, showing the clock, daily prayer times and iqamah in Tamil.",
    image: "/images/mosque.png",
    images: ["/images/mosque.png"],
    publishedAt: "2026-01-24T00:00:00.000Z",
    featured: true,
    order: 2,
    tags: ["Digital signage", "Real-time"],
    services: ["custom-software-development-sri-lanka", "web-development-sri-lanka"],
    content: md("This display"),
  },
  {
    slug: "business-management-system",
    title: "Business Management System",
    description: "Inventory, CRM and workflow tools in one dashboard for a growing distributor.",
    image: "/images/BMS.png",
    images: ["/images/BMS.png"],
    publishedAt: "2025-11-02T00:00:00.000Z",
    featured: false,
    order: 3,
    tags: ["Business software", "Dashboard"],
    services: ["custom-software-development-sri-lanka", "ai-development-sri-lanka", "ui-ux-design-sri-lanka"],
    content: md("This business management system"),
  },
];

export const demoPosts: PostDTO[] = [
  {
    slug: "web-app-cost-sri-lanka",
    title: "How much does a web app cost to build in Sri Lanka?",
    description: "What drives the price of a custom web app, and how to plan a budget that holds.",
    image: "/images/Web.png",
    publishedAt: "2026-10-14T00:00:00.000Z",
    featured: true,
    order: 0,
    tags: ["Guides"],
    author: "Upforge",
    content: md("This article"),
    metadata: { tag: "Guides" },
  },
  {
    slug: "website-vs-web-app",
    title: "Website, web app or mobile app: which one does your business need?",
    description: "A plain-language guide to choosing the right first build.",
    publishedAt: "2026-09-29T00:00:00.000Z",
    featured: false,
    order: 1,
    tags: ["Guides"],
    author: "Upforge",
    content: md("This article"),
    metadata: { tag: "Guides" },
  },
  {
    slug: "ai-saves-hours",
    title: "Five places AI saves a small team real hours each week",
    description: "Practical automations that pay for themselves in the first month.",
    image: "/images/AI solution.png",
    publishedAt: "2026-09-08T00:00:00.000Z",
    featured: false,
    order: 2,
    tags: ["AI"],
    author: "Upforge",
    content: md("This article"),
    metadata: { tag: "AI" },
  },
];

const g = (src: string, w: number, h: number, i: number): GalleryImageDTO => ({
  id: `demo-${i}`, url: src, thumbnail: src, medium: src, large: src, width: w, height: h,
});

export const demoGallery: GalleryImageDTO[] = [
  g("/images/gallery/horizontal-1.jpg", 1600, 1067, 1),
  g("/images/gallery/vertical-4.jpg", 1067, 1600, 2),
  g("/images/gallery/horizontal-3.jpg", 1600, 1067, 3),
  g("/images/gallery/vertical-1.jpg", 1067, 1600, 4),
  g("/images/gallery/vertical-2.jpg", 1067, 1600, 5),
  g("/images/gallery/horizontal-2.jpg", 1600, 1067, 6),
  g("/images/gallery/horizontal-4.jpg", 1600, 1067, 7),
  g("/images/gallery/vertical-3.jpg", 1067, 1600, 8),
];
