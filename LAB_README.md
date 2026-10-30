# Hero lab (private)

Five candidate replacements for the landing-page ring, each on a full demo landing page.

- Index: `/lab` · Options: `/lab/hero/1` to `/lab/hero/5`
- Only visible while signed in at `/admin`. Everyone else gets "page not found".
- Hidden from search: `noindex` meta + `X-Robots-Tag` header, `Disallow: /lab` in robots.txt, not in the sitemap.
- The live hero (`components/Hero.tsx`, `components/Orb.tsx`) and home page are untouched.

## Files

| File | What |
| --- | --- |
| `components/lab/LabObject.tsx` | The five 3D objects (three.js) |
| `components/lab/LabHero.tsx` | Copy of the hero using a lab object |
| `components/lab/LabBar.tsx` | The floating "‹ 01 Glass logo ›" switcher |
| `components/lab/lab.css` | Lab styles (self-contained) |
| `lib/lab.ts` | Names and descriptions of the options |
| `app/(site)/lab/page.tsx` | Private index |
| `app/(site)/lab/hero/[variant]/page.tsx` | Private demo landing page |
| `app/robots.ts`, `next.config.ts` | `/lab` blocked from crawlers |

The logo path used by option 1 and 4 is `LOGO_PATH` at the top of `LabObject.tsx`, traced from your nav logo. Paste the exact path from your `Logo.tsx` there.

## Removing the lab later

Delete `components/lab/`, `lib/lab.ts` and `app/(site)/lab/`. The robots/next.config lines can stay.
