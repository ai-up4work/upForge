// Fixed site copy. Projects, journal posts and gallery images come from the database (edit them at /admin).

export const site = {
  name: "Upforge",
  legalName: "Upforge Studio (formerly Up4Work)",
  tagline: "Software, built beautifully.",
  description:
    "Software development company in Colombo, Sri Lanka. Upforge (formerly Up4Work) builds websites, web apps, mobile apps, business software and AI tools.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.up4work.space",
  email: "hello@upforge.lk",
  // Optional, but strongly recommended for local SEO (must match your Google Business Profile exactly).
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  street: process.env.NEXT_PUBLIC_STREET ?? "",
  city: "Colombo, Sri Lanka",
  timezone: "Asia/Colombo",
  social: {
    linkedin: "https://www.linkedin.com/company/onaaaa/",
    instagram: "https://www.instagram.com/up4work.io",
  },
  // Optional: set NEXT_PUBLIC_FORM_ENDPOINT (e.g. a Formspree URL) to make the contact form send.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
};

export const hero = {
  label: "Software company",
  title: "UPFORGE STUDIO",
  sub: "Web · Mobile · AI",
};

export const nav = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Journal", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
];

export const statement =
  "We are a small team of designers and engineers in Colombo. We build software the way great products are made: with taste, with care for every detail, and with code you fully own.";

export type Service = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  stack: string[];
  tone: "light" | "dark" | "blue";
  size: "wide" | "tall" | "small";
};

export const services: Service[] = [
  { id: "web", kicker: "Web apps", title: "Fast by default.\nBeautiful by design.", body: "Customer portals, booking systems and dashboards that load in about a second and feel effortless to use.", stack: ["Next.js", "React", "PostgreSQL"], tone: "dark", size: "wide" },
  { id: "mobile", kicker: "Mobile apps", title: "One codebase.\nTwo stores.", body: "Native-feeling iOS and Android apps, published under your name.", stack: ["React Native", "Flutter"], tone: "light", size: "tall" },
  { id: "ai", kicker: "AI & automation", title: "Hours back,\nevery week.", body: "Assistants and workflows that read documents, answer customers and move data for you.", stack: ["LLM APIs", "RAG", "Automation"], tone: "blue", size: "small" },
  { id: "software", kicker: "Business systems", title: "Shaped around\nyour business.", body: "Inventory, CRM, POS and workflow tools that fit how you already work.", stack: ["Node.js", "MongoDB"], tone: "light", size: "small" },
  { id: "design", kicker: "UI/UX design", title: "Designed before\nit's developed.", body: "Research, prototypes and a design system your team keeps using after launch.", stack: ["Figma", "Design systems"], tone: "light", size: "wide" },
  { id: "cloud", kicker: "Cloud & care", title: "Launched.\nThen looked after.", body: "Hosting, monitoring, backups and monthly improvements.", stack: ["AWS", "Vercel", "Firebase"], tone: "dark", size: "small" },
];

export const steps = [
  { name: "Discover", duration: "About 1 week", body: "One workshop to map your goals, users and must-haves. You leave with a fixed scope, a timeline and a price.", points: ["Goals and success metrics", "Feature map", "Fixed quote"] },
  { name: "Design", duration: "2 to 3 weeks", body: "Clickable prototypes you can put in front of real customers before a single line of code is written.", points: ["User flows", "High-fidelity screens", "Clickable prototype"] },
  { name: "Build", duration: "4 to 12 weeks", body: "Weekly sprints with a live staging link. Every Friday you see working software and tell us what to change.", points: ["Weekly demos", "Live staging link", "Automated tests"] },
  { name: "Launch & care", duration: "Ongoing", body: "We ship, watch the numbers and keep improving. Handover includes documentation and full access to your code.", points: ["Monitoring and backups", "Monthly updates", "100% code ownership"] },
];

export const principles = [
  { title: "You see progress every week.", body: "A live staging link from week one, and a demo every Friday." },
  { title: "You talk to the builders.", body: "No account managers in the middle. Your designer and engineers are on the call." },
  { title: "You own everything.", body: "Code, designs and accounts are yours from day one. No lock-in." },
  { title: "Same-day answers.", body: "Colombo time overlaps with Europe's morning and Australia's afternoon." },
];

// From the original About page
export const capabilities = [
  { name: "Web, mobile & cloud apps", body: "Full-stack web applications, mobile apps and cloud-based solutions.", image: "/images/Web.png" },
  { name: "AI solutions", body: "AI-powered applications and intelligent automation systems.", image: "/images/AI solution.png" },
  { name: "Business management systems", body: "Custom software for inventory, CRM and workflow management.", image: "/images/BMS.png" },
];

export const techGroups = [
  { title: "Frontend", items: [{ name: "Next.js", icon: "/tech/nextjs.svg" }, { name: "React" }, { name: "TypeScript", icon: "/tech/typescript.svg" }, { name: "JavaScript" }] },
  { title: "Backend & data", items: [{ name: "Node.js" }, { name: "Python", icon: "/tech/python.svg" }, { name: "Java" }, { name: "MongoDB" }, { name: "Supabase", icon: "/tech/supabase.svg" }] },
  { title: "AI", items: [{ name: "LangGraph", icon: "/tech/langgraph.svg" }, { name: "PyTorch", icon: "/tech/pytorch.svg" }, { name: "LLM APIs" }] },
  { title: "Cloud & deployment", items: [{ name: "Vercel", icon: "/tech/vercel.svg" }, { name: "AWS", icon: "/tech/aws.svg" }, { name: "Docker", icon: "/tech/docker.svg" }, { name: "Firebase" }, { name: "Snowflake", icon: "/tech/snowflake.svg" }] },
];

export const stack = [
  "Next.js", "React", "React Native", "Flutter", "Node.js", "Python", "MongoDB",
  "Supabase", "AWS", "Vercel", "Docker", "Figma", "LangGraph", "PyTorch", "Snowflake",
];
