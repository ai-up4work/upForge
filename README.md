# Upforge Studio website

Next.js 15 (App Router) · TypeScript · Motion · MongoDB (Mongoose) · Cloudinary

A multi-page studio site with a built-in admin. It uses the **same MongoDB collections and Cloudinary folders as the original Up4Work site**, so your existing projects, blog posts and images appear without migration.

## Pages

| Route | What it shows | Data |
| --- | --- | --- |
| `/` | 3D hero scene, intro, featured work, services, process, journal, FAQ | Featured projects + 3 latest posts |
| `/work` | Work scene: animated project cards (scroll / ← → to browse) | `projects` collection |
| `/work/[slug]` | Project scene (framed cover + title panel), then the case study | one project |
| `/services` + `/services/[slug]` | Six keyword landing pages with FAQs | `lib/services.ts` |
| `/about` | Studio story, capabilities, process, principles, stack | `lib/content.ts` |
| `/blog`, `/blog/[slug]` | Journal list and articles | `blogposts` collection |
| `/gallery` | Masonry photo wall with full-screen viewer | Cloudinary |
| `/contact` | Project brief form (saved to MongoDB, shown in admin → Inquiries) | `leads` collection |
| `/admin` | CMS: projects, journal, gallery, inquiries | all of the above |

Also: `/sitemap.xml`, `/robots.txt`, `/api/rss`, custom 404.

## Setup

```bash
cp .env.example .env.local   # fill in your keys
npm install
npm run dev                   # http://localhost:3000
```

Without `MONGODB_URI` the site runs in **demo mode** with sample content, so you can preview the design right away.

## Admin (`/admin`)

- Sign in with `PAGE_ACCESS_PASSWORD`. Sessions are signed (HMAC) and last 8 hours.
- **Projects / Journal**: search, feature with the star, edit in a slide-over editor, delete with confirmation.
- **Editor**: auto slug, cover upload (drag-and-drop or URL), ordered screen images (reorder, set as cover), Markdown editor with toolbar, live split preview, paste/drop images to upload, `.md` import that re-hosts the images it references, SEO fields with a search-result preview. ⌘/Ctrl+S saves.
- **Gallery**: drag-and-drop multi-upload with progress, filter by Gallery/Projects/Journal, copy URL, delete.
- Saving refreshes the public pages immediately (on-demand revalidation).

## Security changes from the original

- All write endpoints (create, update, delete, upload, image delete) now **require an admin session**. Previously anyone could call them.
- The admin cookie is a signed token. The old `authToken=authenticated` cookie could be forged by hand.
- Login is rate-limited, password compare is constant-time.
- No database credentials in source code. Everything comes from environment variables.
- Uploads are restricted to images under 10 MB inside the media root folder.

## SEO

See **SEO.md** for the keyword map, what is built in, and the off-site checklist (Google Business Profile, Clutch, DesignRush, GoodFirms, reviews).

## Deploy

Vercel: import the repo, add the environment variables from `.env.example`, deploy.

## Editing fixed copy

Services, process stages, principles, capabilities and tech stack live in `lib/content.ts`. Brand colours and type are tokens at the top of `app/globals.css`.
