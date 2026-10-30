# Fixes: emblems, home cards, hanging clicks, errors

## Do these first (they fix the errors in your terminal)
1. **Delete `public/icon.svg`.** The icon now lives at `app/icon.svg`; two files for one address made Next.js fail (the icon.svg 500).
2. **Add `lib/cloudinary-id.ts`** (new) and replace `lib/data.ts`. This fixes "'cloudinaryId' is not exported from './format'".
   If you pasted `cloudinaryId` into `lib/format.ts` earlier you can leave it or remove it.

## Clicking a project sometimes hangs
- Replace `components/Scene.tsx`. Pages now start loading straight away, a moving shimmer shows while a slow page loads,
  and after 9 seconds it falls back to a normal page load, so you never sit on a blank screen.
  (Very slow first clicks in `npm run dev` are the dev server compiling the page; the live site is much faster.)
- Append `add-to-globals.css` to the end of `app/globals.css`.

## Choose each project's card emblem in the admin
- Replace `components/ProjectGlyph.tsx` (14 emblems; team avatars are no longer used as logos).
- Replace `components/admin/Editor.tsx` (new "Card emblem" picker; "Automatic" is the default).
- In `lib/types.ts` add to `ProjectDTO`: `mark?: string;`
- In `lib/models.ts` add `mark?: string;` to `IProject` and `mark: { type: String, default: "" },` to `ProjectSchema`.
- Replace `components/ProjectScene.tsx` (the case-study badge uses the emblem, not the team avatar).
- Append `add-to-admin.css` to the end of `app/admin/admin.css` (emblem picker + gallery project filter styles).

## Home "Products we've shipped": closed until hover
- Replace `components/FeaturedCards.tsx` (and keep `components/FeaturedCards.css`).

## Admin gallery project filter (from before)
- Replace `components/admin/GalleryManager.tsx`.
