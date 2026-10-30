// Hero lab: private demo pages for choosing a new landing-page hero object. Not linked anywhere public.
export const labOptions = [
  { n: 1, slug: "glass-logo", name: "Glass logo", line: "Your U-and-arrow mark cast in thick iridescent glass, with an ember glowing in the cup.", fit: 5, speed: 4, effort: "about a day", pick: true },
  { n: 2, slug: "molten-crucible", name: "Molten crucible", line: "Molten orange-to-magenta metal churning inside a glass vessel, ringed in glass.", fit: 4, speed: 4, effort: "about a day", pick: false },
  { n: 3, slug: "code-to-glass", name: "Code to glass", line: "A blueprint wireframe that a scan line forges into solid glass, with interface panels inside.", fit: 4, speed: 4, effort: "1 to 2 days", pick: false },
  { n: 5, slug: "ai-core", name: "AI core", line: "A JARVIS-style orb of glowing dots that ripples like it is thinking and speaking, ringed by a quiet interface HUD.", fit: 5, speed: 4, effort: "about a day", pick: false },
  { n: 4, slug: "shape-shift", name: "Shape shift", line: "Liquid chrome flowing from sphere to phone to browser to your logo.", fit: 5, speed: 2, effort: "2 to 3 days", pick: false },
] as const;
