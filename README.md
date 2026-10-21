# Kirabo Catering Services — independent website concept

A proposal by Arthur Kitandwe for how a website could present Kirabo Catering Services and turn
a visitor's appetite into a well-formed catering enquiry. **It is not Kirabo's official website**
and is not authorised by or affiliated with them.

- Every photograph is an AI-generated illustration (see `docs/ASSETS.md`).
- The menus are illustrative suggestions with no prices, not a verified Kirabo menu.
- No business fact is stated unless verified; on 21 October 2026 none could be (see `docs/CONTENT-NOTES.md`).
- The quote and contact forms are demonstrations: nothing is sent, nothing personal is stored.
  The only thing kept on the device is the dish shortlist, as a list of dish IDs.

## What it does

| Route | Purpose |
|---|---|
| `/` | Hero, signature dish, menu preview with live "Add to my menu", occasions, proposed process, gallery preview, quote prompt |
| `/menus` | Four sample menus; search and category filter in the URL (`?category=&q=`), empty state, reset |
| `/my-menu` | The shortlist: remove, clear with Undo, continue to quote. Also available as a drawer from the header |
| `/occasions`, `/occasions/:slug` | Proposed occasion pages with planning notes; the quote CTA preselects the occasion |
| `/gallery` | Filterable concept images (`?filter=`), accessible lightbox (arrows, swipe, Escape, focus return) |
| `/quote` | Four steps: event → guests and service → menu and contact → preview, then a demo confirmation with a `DEMO-` reference |
| `/contact` | Link to Kirabo's Facebook page, kept apart from a demo message form |
| `/about` | What the concept does and does not say about Kirabo, and the concept disclosure (`#concept`) |

## Stack

React 19, TypeScript, Vite 7, React Router 7 (lazy routes), GSAP + ScrollTrigger (`@gsap/react`),
plain CSS with tokens, self-hosted Fraunces and Manrope. No backend, database, payments or form service.

Key places:

- `src/data/` — `business.ts` (verified facts only: currently just the name and Facebook link), `menu.ts`, `occasions.ts`, `gallery.ts`, generated `image-manifest.json`
- `src/lib/shortlist.ts` — the shortlist store (IDs only, versioned, defensive parsing, Undo for clear) and drawer state
- `src/forms/` — the declarative form engine (`engine.ts`), flow hook, renderer and `flows.ts` (the quote and contact specs)
- `src/animation/` — `useSiteMotion` (hero entrance, reveals; reduced-motion aware, cleaned up per route) and `menuMotion` (the add-to-menu moment)

## Commands

```bash
npm install
npm run dev            # local development
npm test               # unit tests (vitest)
npm run build          # type-check and production build (writes dist/_redirects and dist/404.html)
npm run preview -- --port 4181
npm run verify         # browser journey checks against the preview (needs Chrome installed)
```

On Git Bash for Windows, prefix script runs that take URL paths with `MSYS_NO_PATHCONV=1`.

Asset scripts (outputs are committed, so the build never needs Python):

```bash
npm run images         # Python + Pillow: WebP derivatives from assets-src/original (checks pack hashes)
npm run brand          # Python + fonttools/brotli: outlined wordmark and favicon
npm run social         # renders public/social/kirabo-concept-1200x630.jpg with live text
node scripts/touch-icon.mjs
node scripts/shoot.mjs docs/screenshots 1440 / /menus   # screenshots (SHOOT_URL, SEED)
node scripts/perf.mjs 390 4                             # rough LCP/CLS/bytes (PERF_URL)
```

## Deployment

Live at **https://kirabo-catering-concept.kranks533.workers.dev**, served as static assets on
Cloudflare Workers (`wrangler.jsonc`, no Worker script). Deploys are manual: pushing to GitHub
does **not** deploy. To publish an update:

```bash
npm test && npm run build
npm run deploy                                  # builds, then `wrangler deploy` uploads dist/
VERIFY_URL=https://kirabo-catering-concept.kranks533.workers.dev npm run verify
```

`npm run deploy` needs `npx wrangler login` once on the machine. The build writes `dist/_redirects`,
which rewrites only the app's known routes to `/`, and `dist/404.html`, which `wrangler.jsonc`
serves with a real 404 status for anything else (`not_found_handling: "404-page"`).
`public/_headers` sets `noindex` and basic security headers. `.env` holds only the public site URL
used in social metadata. Rollback: `npx wrangler rollback` to the previous version.
