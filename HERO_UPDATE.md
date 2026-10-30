# Hero update: AI core

The landing-page ring is replaced by the "AI core" orb. The hero lab demo pages are removed.

## If you are merging into your own copy

1. Add `components/AiCore.tsx` (new).
2. In `components/Hero.tsx`: replace `import Orb from "./Orb";` with `import AiCore from "./AiCore";`,
   put `<AiCore />` as the first child of `<section className="hero">`, and delete the `<Orb />` line.
3. In `app/globals.css`, add under `.hero-stage { z-index: 1; }`:
   ```css
   .ai-core { position: absolute; inset: 0; z-index: 0; }
   .ai-core canvas { display: block; width: 100% !important; height: 100% !important; }
   ```
   (The old `.orb` rules can be deleted.)
4. Delete `components/Orb.tsx`, and the lab files if you copied them earlier:
   `components/lab/`, `lib/lab.ts`, `app/(site)/lab/`.
5. Replace `components/Intro.tsx` (fixes the opening animation showing as a block on the page).
