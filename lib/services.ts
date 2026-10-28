// Service landing pages. Each one targets a specific search phrase used by buyers in Sri Lanka.
// Edit copy here; pages, sitemap, footer links and structured data update automatically.

export type ServicePage = {
  slug: string;
  name: string; // short name for cards and nav
  keyword: string; // primary search phrase this page targets
  title: string; // <title>
  description: string; // meta description (≤ 160 chars)
  h1: string[]; // display lines (last line shows in teal)
  kicker: string;
  intro: string;
  image: string;
  deliverables: string[];
  goodFor: string[];
  stack: string[];
  matchTags: string[]; // project tags that count as related work
  need: string; // option pre-selected on the contact form
  faqs: { q: string; a: string }[];
};

export const services: ServicePage[] = [
  {
    slug: "web-development-sri-lanka",
    need: "Web app",
    name: "Web development",
    keyword: "web development company in Sri Lanka",
    title: "Web Development Company in Sri Lanka | Websites & Web Apps",
    description: "Upforge is a web development company in Colombo, Sri Lanka. We design and build fast, SEO-ready websites, portals and web applications you fully own.",
    h1: ["Web development", "company in", "Sri Lanka"],
    kicker: "Websites · Portals · Web apps",
    intro:
      "We design and build websites and web applications for Sri Lankan and international businesses: company websites that rank and convert, customer portals, booking systems and dashboards. Every site is built with Next.js, loads in about a second on mobile, and ships with full source code and documentation.",
    image: "/images/Web.png",
    deliverables: ["Company and product websites", "Customer portals and dashboards", "Booking and reservation systems", "Content management (CMS) so you can edit pages yourself", "Technical SEO, analytics and Search Console setup", "Hosting, SSL, backups and monthly care"],
    goodFor: ["Businesses replacing an old or slow website", "Startups launching a first product", "Teams that need a portal for customers or staff"],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Vercel", "AWS"],
    matchTags: ["Web app", "Website", "Next.js", "Dashboard"],
    faqs: [
      { q: "How much does a website cost in Sri Lanka?", a: "It depends on the number of pages, custom features (bookings, payments, logins) and content. After a short call we send a fixed quote, so the price does not change during the build." },
      { q: "How long does it take to build a website?", a: "A company website usually takes 3 to 6 weeks. Web applications with logins, payments or dashboards take 6 to 12 weeks depending on scope." },
      { q: "Will my website be optimised for Google?", a: "Yes. Every site ships with fast loading, mobile-first layouts, structured data, a sitemap, clean URLs and Google Search Console set up." },
      { q: "Do I own the code and the domain?", a: "Yes. The code, designs, domain and hosting accounts are yours from day one. There is no lock-in." },
    ],
  },
  {
    slug: "mobile-app-development-sri-lanka",
    need: "Mobile app",
    name: "Mobile apps",
    keyword: "mobile app development company in Sri Lanka",
    title: "Mobile App Development Company in Sri Lanka | iOS & Android",
    description: "iOS and Android app development in Sri Lanka. Upforge builds cross-platform mobile apps with React Native and Flutter and publishes them under your name.",
    h1: ["Mobile app", "development in", "Sri Lanka"],
    kicker: "iOS · Android · Cross-platform",
    intro:
      "We build mobile apps for iOS and Android from a single codebase using React Native or Flutter, so you launch on both stores for less. We handle design, development, the admin panel behind the app, and publishing to the App Store and Google Play under your developer account.",
    image: "/images/AI solution.png",
    deliverables: ["iOS and Android apps from one codebase", "Admin dashboard and APIs behind the app", "Payments, maps, push notifications and logins", "App Store and Google Play publishing", "Analytics and crash reporting", "Updates and support after launch"],
    goodFor: ["Retail, delivery and booking businesses", "Startups validating a product", "Companies giving staff a field app"],
    stack: ["React Native", "Flutter", "Firebase", "Node.js", "Supabase", "Expo"],
    matchTags: ["Mobile app", "Mobile"],
    faqs: [
      { q: "How much does it cost to build an app in Sri Lanka?", a: "Cost depends on screens, integrations (payments, maps, chat) and the admin panel. We scope it in a short workshop and give a fixed quote before any work starts." },
      { q: "Do you build for both iPhone and Android?", a: "Yes. We use React Native or Flutter so one codebase runs on both platforms, which lowers cost and keeps features in sync." },
      { q: "Will the app be published under my company name?", a: "Yes. We publish to your own Apple and Google developer accounts, so the app and its users belong to you." },
      { q: "Can you take over an existing app?", a: "Yes. We review the code first and tell you honestly whether to improve it or rebuild." },
    ],
  },
  {
    slug: "custom-software-development-sri-lanka",
    need: "Business system",
    name: "Custom software",
    keyword: "custom software development company in Sri Lanka",
    title: "Custom Software Development in Sri Lanka | Business Systems",
    description: "Custom software development in Sri Lanka: inventory, POS, CRM, HR and ERP systems built around how your business works. Fixed quotes, full code ownership.",
    h1: ["Custom software", "development in", "Sri Lanka"],
    kicker: "Inventory · POS · CRM · ERP",
    intro:
      "Off-the-shelf tools rarely fit how a business actually runs. We build business management systems around your process: inventory and stock, point of sale, CRM, HR and payroll, and reporting dashboards, with roles and permissions for your team and data that stays yours.",
    image: "/images/BMS.png",
    deliverables: ["Inventory and stock management", "Point of sale (POS) and billing", "CRM and sales pipelines", "HR, attendance and payroll tools", "Reports and dashboards", "Integrations with accounting and payment systems"],
    goodFor: ["Distributors and retailers outgrowing spreadsheets", "Schools, clinics and service businesses", "Companies replacing several disconnected tools"],
    stack: ["Node.js", "Laravel", "Java", "PostgreSQL", "MongoDB", "React", "AWS"],
    matchTags: ["Business software", "Custom software", "Dashboard"],
    faqs: [
      { q: "Is custom software better than buying an off-the-shelf system?", a: "If an existing product fits 90% of your process, buy it. Custom software pays off when your workflow is a competitive advantage or when you are paying for several tools that don't talk to each other." },
      { q: "Can you migrate our data from Excel or an old system?", a: "Yes. Data migration and cleaning are part of the plan, and we run the old and new systems side by side until you are confident." },
      { q: "Does it work offline or on mobile?", a: "Yes, where it matters. Field and shop-floor screens can work on phones and tablets and sync when the connection returns." },
      { q: "Who maintains the system after launch?", a: "We offer monthly care plans, and because you own the code, any developer can maintain it if you prefer." },
    ],
  },
  {
    slug: "ecommerce-website-development-sri-lanka",
    need: "Website",
    name: "E-commerce",
    keyword: "ecommerce website development in Sri Lanka",
    title: "E-commerce Website Development in Sri Lanka | Online Stores",
    description: "E-commerce website development in Sri Lanka with local payment gateways, delivery and stock management. Fast online stores built to sell on mobile.",
    h1: ["E-commerce", "websites in", "Sri Lanka"],
    kicker: "Online stores · Payments · Delivery",
    intro:
      "We build online stores that are fast on mobile and easy to run: product catalogues, card and local payment gateways, delivery options, stock syncing and order management. Whether you sell cosmetics, clothing or custom products, the store is designed to turn visitors into orders.",
    image: "/images/alzia-1.png",
    deliverables: ["Custom online stores and product catalogues", "Local and international payment gateways", "Delivery, pickup and cash-on-delivery options", "Stock and order management", "Quotation and custom-order flows", "SEO, Google Shopping and Meta catalogue feeds"],
    goodFor: ["Retail brands moving online", "Businesses selling custom or made-to-order products", "Stores outgrowing a basic template"],
    stack: ["Next.js", "Shopify", "WooCommerce", "Stripe", "PayHere", "MongoDB"],
    matchTags: ["E-commerce", "Quotations"],
    faqs: [
      { q: "Which payment gateways can you integrate in Sri Lanka?", a: "We integrate Sri Lankan gateways such as PayHere as well as international options like Stripe, plus cash on delivery and bank transfer flows." },
      { q: "Should I use Shopify or a custom store?", a: "Shopify is great to start quickly. A custom store makes sense when you need custom ordering, quotations, special pricing or deep integrations. We'll recommend the right fit." },
      { q: "Can customers order custom products?", a: "Yes. We build quotation and design-request flows so customers can upload artwork or request changes before paying." },
      { q: "Will my store be fast on mobile?", a: "Yes. Most shoppers in Sri Lanka buy on phones, so stores are built mobile-first and tested on mid-range Android devices." },
    ],
  },
  {
    slug: "ai-development-sri-lanka",
    need: "AI & automation",
    name: "AI & automation",
    keyword: "AI development company in Sri Lanka",
    title: "AI Development & Automation Company in Sri Lanka",
    description: "AI development in Sri Lanka: chat assistants, document processing and workflow automation built on modern AI models and connected to your business data.",
    h1: ["AI development", "& automation in", "Sri Lanka"],
    kicker: "Assistants · Documents · Workflows",
    intro:
      "We build practical AI tools that save your team hours each week: customer-support assistants trained on your own documents, invoice and form readers, and automations that move data between your systems. We start with one measurable use case and expand from there.",
    image: "/images/AI solution.png",
    deliverables: ["Chat assistants for websites and WhatsApp", "Document and invoice processing", "Knowledge search over your own files (RAG)", "Workflow automation between your tools", "Data dashboards and reporting", "Private deployment options for sensitive data"],
    goodFor: ["Teams answering the same questions every day", "Finance and admin teams processing documents", "Businesses with data spread across many tools"],
    stack: ["Python", "LangGraph", "PyTorch", "LLM APIs", "Supabase", "Snowflake"],
    matchTags: ["AI", "Automation", "Real-time"],
    faqs: [
      { q: "What can AI realistically automate for a small business?", a: "Answering common customer questions, reading invoices and forms, summarising documents, drafting replies and moving data between systems are the most reliable wins today." },
      { q: "Is our data safe?", a: "We design for privacy first: data stays in your accounts, access is restricted, and private deployment is available for sensitive information." },
      { q: "How do we start?", a: "We pick one task your team repeats every day, build a small pilot in a few weeks, measure the time saved, then decide together what to automate next." },
      { q: "Do you build chatbots for WhatsApp?", a: "Yes. Assistants can run on your website, WhatsApp and other channels, and hand over to a person when needed." },
    ],
  },
  {
    slug: "ui-ux-design-sri-lanka",
    need: "UI/UX design",
    name: "UI/UX design",
    keyword: "UI UX design agency in Sri Lanka",
    title: "UI/UX Design Agency in Sri Lanka | Product & App Design",
    description: "UI/UX design in Sri Lanka for websites, web apps and mobile apps: research, wireframes, clickable prototypes and design systems your team can keep using.",
    h1: ["UI/UX design", "studio in", "Sri Lanka"],
    kicker: "Research · Prototypes · Design systems",
    intro:
      "Good software starts with clear design. We map your users and goals, sketch the flows, and deliver high-fidelity screens and clickable prototypes you can test with real customers before development begins, plus a design system so every future screen stays consistent.",
    image: "/images/alzia-2.png",
    deliverables: ["User research and journey mapping", "Wireframes and user flows", "High-fidelity UI for web and mobile", "Clickable prototypes for testing", "Design systems and component libraries", "Brand refresh for digital products"],
    goodFor: ["Startups preparing to build or raise funding", "Products with low conversion or confusing flows", "Teams that need a consistent design system"],
    stack: ["Figma", "Prototyping", "Design systems", "Usability testing"],
    matchTags: ["Design", "UI/UX"],
    faqs: [
      { q: "Can you design and also build the product?", a: "Yes. Most clients use us for both, which keeps design intent intact during development. You can also take the Figma files to your own developers." },
      { q: "How long does a design project take?", a: "A focused product design sprint takes 2 to 3 weeks. Larger platforms are designed in phases alongside development." },
      { q: "Do I get the source files?", a: "Yes. You receive the full Figma files, components and assets." },
      { q: "Can you redesign an existing app or website?", a: "Yes. We start with a short audit of what's working and what isn't, then redesign the parts that matter most." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

// Studio-wide FAQ (home page) — also emitted as FAQPage structured data.
export const homeFaqs = [
  { q: "What does Upforge do?", a: "Upforge (formerly Up4Work) is a software development company in Colombo, Sri Lanka. We design and build websites, web applications, mobile apps, custom business software and AI tools." },
  { q: "Do you work with clients outside Sri Lanka?", a: "Yes. We work with clients in Sri Lanka and abroad. Colombo time overlaps with Europe's morning and Australia's afternoon, so questions get same-day answers." },
  { q: "How much does a software project cost in Sri Lanka?", a: "Every project is different, so we give a fixed quote after a short discovery call. The quote covers design, development, testing and launch, with no surprise costs." },
  { q: "How do I start a project with Upforge?", a: "Send a short brief through the contact page or email us. We reply within one working day and book a 30-minute call." },
];
