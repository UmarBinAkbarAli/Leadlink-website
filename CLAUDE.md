# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Astro dev server (hot reload)
npm run build     # build to dist/
npm run preview   # serve dist/ locally
npm run check     # run astro check (TypeScript + template type checking)
```

There is no test runner. Manual browser verification (desktop + mobile) is the expected QA step.

## Architecture

The site is a hybrid of Astro and standalone HTML:

**Astro layer (`src/`)** — one page only:
- `src/pages/index.astro` — reads `src/content/homepage-source.html` as a raw string, extracts `<head>` and `<body>` content, strips redundant meta tags, and renders them through `src/layouts/BaseLayout.astro`. This pattern lets the homepage be authored as a plain HTML file while getting Astro's build pipeline.
- `src/scripts/homepage.ts` — all GSAP animations: hero entrance, hero parallax, nav dropdown behavior, fragmentation scroll (a `ScrollTrigger`-pinned section with a multi-step timeline), and `revealOnView` scroll-triggered fade-ins. Animations are skipped when `prefers-reduced-motion: reduce` is set. The module guards against double-initialization via `homepageMotionInitialized`.

**Standalone HTML pages (`public/`)** — division landing pages (`press.html`, `commerce.html`, `design.html`, `growth.html`, `tech.html`, `content.html`) plus extended variants and `leadlink-press.html`. These are copied verbatim to `dist/` by Astro and are not part of the Astro component tree. CSS and JS in these files are embedded directly in the file.

**Static assets** live in `public/assets/` and are referenced from both the Astro page and the standalone HTML files.

## Key conventions

- The homepage HTML source (`src/content/homepage-source.html`) uses embedded `<style>` blocks, CSS custom properties (`--accent`, etc.), and compact class names (`.wrap`, `.eyebrow`, `.btn`, `.nav-links`). Follow these patterns when editing it.
- Standalone HTML files follow the same embedded-style convention. New division pages should be named `<division>.html` / `<division>-extended.html` and placed in `public/`.
- TypeScript is strict (`astro/tsconfigs/strict`). Run `npm run check` before shipping changes to `src/scripts/`.
- GSAP's `matchMedia` is used for the fragmentation section to scope the pinned scroll animation to `(min-width: 960px) and (prefers-reduced-motion: no-preference)`. Follow this pattern for any new scroll-driven animations.
