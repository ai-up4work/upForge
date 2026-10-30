# "Products we've shipped" section update (home page, desktop only)

Only this section changes. Phones and every other page stay as they are.

1. Add `components/FeaturedCards.tsx` (new). If you added `components/FeaturedWork.tsx` earlier, delete it.
2. Replace `components/WorkStrip.tsx`.
3. Replace `components/ProjectGlyph.tsx`. It only adds an optional `asImage` setting used by this section;
   everywhere else it behaves exactly as before.
4. Append `globals-selected-work.css` (included) to the end of `app/globals.css`.
   If you added an earlier "selected work" block, delete that first.
