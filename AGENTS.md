# Repository Guidelines

## Project Structure & Module Organization

This repository is a static LeadLink website made of standalone HTML files at the project root. `index.html` is the division directory and links to individual pages such as `content.html`, `tech.html`, `growth.html`, `design.html`, `commerce.html`, and `press.html`. Extended variants, for example `growth-extended.html` and `commerce-extended.html`, contain fuller landing-page layouts. There are currently no separate `src/`, `tests/`, or asset directories; CSS and page-specific scripts are embedded in each HTML file.

## Build, Test, and Development Commands

No package manager, build step, or test runner is configured. Open pages directly in a browser for local review:

```powershell
Start-Process .\index.html
```

For quick local serving, use any static server from the repository root:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/index.html`. Use this when checking relative links or browser behavior.

## Coding Style & Naming Conventions

Keep pages as valid HTML5 with semantic sections and descriptive class names. Existing files use embedded `<style>` blocks, CSS custom properties such as `--accent`, and compact utility-style class names like `.wrap`, `.eyebrow`, `.btn`, and `.nav-links`. Preserve each division page's accent color variables and shared typography stack. Name new pages with lowercase, hyphen-separated filenames, for example `new-service.html` or `new-service-extended.html`.

## Testing Guidelines

Before handing off changes, manually verify the affected page in desktop and mobile viewport sizes. Check navigation links, fixed headers, responsive grids, hover states, and any in-page anchors. If adding JavaScript, confirm the browser console has no errors. Since there is no automated coverage requirement, include manual test notes in the pull request.

## Commit & Pull Request Guidelines

This folder does not include Git history, so no local commit convention can be inferred. Use short, imperative commit messages such as `Update growth page copy` or `Add studios landing page`. Pull requests should include a concise summary, list of changed pages, manual test notes, and screenshots for visual changes. Link any relevant issue, brief, or design reference.

## Security & Configuration Tips

Avoid committing secrets, tracking tokens, or private client data into HTML. External dependencies are currently limited to Google Fonts; document any new CDN, analytics, form, or third-party script added to a page.
