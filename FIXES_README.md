# Two fixes

## 1. Hero covered by a project screenshot
The "Products we've shipped" cards needed styles that had to be pasted into globals.css.
Now the component brings its own styles.

- Add `components/FeaturedCards.css` (new)
- Replace `components/FeaturedCards.tsx` and `components/WorkStrip.tsx`
- If you pasted the "Home: selected work" block into `app/globals.css`, you can delete it (harmless if left).

## 2. Filter the admin Gallery by project
A "Project" dropdown next to All / Gallery / Projects / Journal. Each image also shows its project's name.
An image counts for a project if the project uses it (cover, screens or logo) or it was uploaded in that project's folder.
The public /gallery page's project filter uses the same matching now.

- Replace `components/admin/GalleryManager.tsx`
- Replace `lib/data.ts` (or, if yours differs, copy the `getGalleryWithProjects` function)
- Append `add-to-lib-format.ts` to the end of `lib/format.ts`
- Append `add-to-admin.css` to the end of `app/admin/admin.css`
