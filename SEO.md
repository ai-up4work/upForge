# Upforge SEO plan

How this site is set up to rank in Sri Lanka, and what you need to do outside the code to reach the first page.

## What the research showed (October 2026)

- Searches like **"best software companies in Sri Lanka"** are dominated by directories: Clutch, DesignRush, GoodFirms, ZoomInfo and TechBehemoths. Company websites rarely rank for these phrases directly.
- Those directories rank firms by **reviews, portfolio, services, awards/press and team** (DesignRush states this openly). Clutch's top Sri Lankan listings have roughly 2 to 15 verified reviews each, which is achievable.
- **Service + location** phrases ("web development company in Sri Lanka", "ecommerce website development Sri Lanka", "mobile app development company Sri Lanka") are where a company site *can* rank, with a dedicated, well-structured page per service.

So the strategy has two halves: **rank our own pages for service keywords**, and **get listed and reviewed on the directories that own the "best companies" results**.

## Keyword map (built into the site)

| Page | Primary keyword | Supporting phrases |
| --- | --- | --- |
| `/` | software development company in Sri Lanka | software company Sri Lanka, software company Colombo, Up4Work, Upforge |
| `/services/web-development-sri-lanka` | web development company in Sri Lanka | web design Sri Lanka, website development Colombo, web app development |
| `/services/mobile-app-development-sri-lanka` | mobile app development company in Sri Lanka | app developers Sri Lanka, iOS Android app Sri Lanka, app development cost |
| `/services/custom-software-development-sri-lanka` | custom software development in Sri Lanka | POS system Sri Lanka, inventory system, ERP / CRM Sri Lanka |
| `/services/ecommerce-website-development-sri-lanka` | ecommerce website development in Sri Lanka | online store Sri Lanka, PayHere integration, Shopify developer Sri Lanka |
| `/services/ai-development-sri-lanka` | AI development company in Sri Lanka | AI chatbot Sri Lanka, WhatsApp bot, automation |
| `/services/ui-ux-design-sri-lanka` | UI UX design agency in Sri Lanka | app design, product design Sri Lanka |
| `/blog/*` | question keywords | "how much does a website cost in Sri Lanka", "website vs web app" |

Copy for every service lives in `lib/services.ts`. Change the wording there, not in the page files.

## What is already done in the code

- Unique `<title>`, meta description and canonical URL on every page; `en-LK` language and `en_LK` Open Graph locale.
- Structured data (JSON-LD): Organization + ProfessionalService (with Up4Work as an alternate name), WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, CreativeWork and ItemList.
- One H1 per page containing the target phrase; real text content on the home page under the hero.
- XML sitemap (`/sitemap.xml`) with every service, project and article; `robots.txt`; RSS feed; web manifest.
- Auto-generated social share image and Apple touch icon.
- Fast pages: static generation with hourly/5-minute refresh, optimised images (AVIF/WebP), self-hosted fonts, 3D loaded only on the home page.
- Internal links: footer links to every service page using its keyword as the anchor text; related services and projects cross-link.
- Mobile-first layouts (most visitors in Sri Lanka browse on phones).

## Where the SEO files are

| What | File | Live URL |
| --- | --- | --- |
| Favicon (16/32/48, all browsers) | `app/favicon.ico` | `/favicon.ico` |
| Vector icon (modern browsers) | `app/icon.svg` | `/icon.svg` |
| Apple touch icon (iPhone home screen) | `app/apple-icon.tsx` | `/apple-icon` |
| Android / install icons 192, 512, maskable | `public/icons/` | `/icons/icon-512.png` |
| Web app manifest | `app/manifest.ts` | `/manifest.webmanifest` |
| Logo for Google (Organization schema) | `public/brand/upforge-logo-512.png` | |
| Share image, default | `app/opengraph-image.tsx` | `/opengraph-image` |
| Share image per project (cover + title) | `app/(site)/work/[slug]/opengraph-image.tsx` | automatic |
| Share image per service | `app/(site)/services/[slug]/opengraph-image.tsx` | automatic |
| Share image per article | `app/(site)/blog/[slug]/opengraph-image.tsx` | automatic |
| Keywords, titles, descriptions | `app/layout.tsx`, each page's `metadata`, `lib/services.ts` | |
| Structured data (JSON-LD) | `lib/seo.ts` | |
| Sitemap / robots | `app/sitemap.ts`, `app/robots.ts` | `/sitemap.xml`, `/robots.txt` |
| AI assistant summary | `app/llms.txt/route.ts` | `/llms.txt` |

macOS `.icns` files are for desktop apps, not websites; browsers on Mac use the favicon, SVG icon and Apple touch icon above.

## AI search (ChatGPT, Perplexity, Gemini, Claude, Copilot)

- `robots.txt` explicitly allows the AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended and others).
- `/llms.txt` gives AI assistants a clean summary: who you are, services, every project, every article, contact.
- AI answers about "best software companies in Sri Lanka" lean heavily on directories (Clutch, GoodFirms, DesignRush) and Google reviews. The directory and review steps below matter as much for AI answers as for Google.

## Do these in the first week (essential)

1. **Set the environment variables** in `.env.local` / Vercel:
   - `NEXT_PUBLIC_BASE_URL` = your final domain (e.g. `https://www.up4work.space`)
   - `NEXT_PUBLIC_PHONE` = your business phone in international format (`+94 …`)
   - `NEXT_PUBLIC_STREET` = your street address (must match Google Business Profile exactly)
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = the code from Search Console
2. **Google Search Console**: verify the domain, submit `/sitemap.xml`, and request indexing for `/` and each `/services/...` page.
3. **Google Business Profile** (the biggest local-SEO factor): category *Software company*; add website, phone, hours, service list, photos and the Colombo address. Ask every past client for a Google review.
4. **Bing Webmaster Tools**: import from Search Console (`NEXT_PUBLIC_BING_SITE_VERIFICATION`).
5. **Fill in real content**: replace the demo projects in the admin with real case studies (problem, what you built, result in numbers) and set a short meta description for each.

## Do these in the first month (to appear in "best software companies")

Create complete profiles with portfolio items and ask 3 to 5 past clients for verified reviews on each:

- Clutch: clutch.co (Sri Lanka developers, web developers, app developers)
- DesignRush: designrush.com (software development, Sri Lanka)
- GoodFirms: goodfirms.co (software development, Sri Lanka)
- TechBehemoths: techbehemoths.com
- Sri Lanka Export Development Board directory (srilankabusiness.com), and SLASSCOM if you qualify

Use the **same name, address, phone and website** everywhere ("Upforge Studio (formerly Up4Work)"). Consistent business details across directories is a direct local ranking signal.

## Ongoing (monthly)

- Publish **2 articles a month** answering buyer questions. Suggested first topics:
  - How much does a website cost in Sri Lanka in 2027?
  - How much does it cost to build a mobile app in Sri Lanka?
  - Shopify vs a custom online store for Sri Lankan businesses
  - Adding PayHere and card payments to your website
  - Choosing a POS / inventory system for a Sri Lankan retail shop
  - Using an AI WhatsApp assistant for customer support
- Add every new project as a case study with real numbers.
- Earn links: write for local tech blogs, speak at meetups, list launches on Product Hunt, and ask clients to credit "Website by Upforge" in their footer.
- Check Search Console monthly: find queries with many impressions but few clicks, and improve that page's title and description.

## Honest expectations

No one can guarantee a #1 ranking, and anyone who promises it is not being straight with you. With the on-site work done here, plus a Google Business Profile, directory listings with reviews and steady articles, small studios typically see service pages reach page one for long-tail local keywords within **3 to 6 months**. Competitive head terms like "best software company in Sri Lanka" take longer and are mostly won through directory reviews.

## Brand note

The domain is `up4work.space`, which already carries the Up4Work name. Keep it (search engines already know it) and say "formerly Up4Work" in visible copy, as this site does. If you later move to a new domain, set up permanent (301) redirects from every old URL and update Search Console with the change of address.
