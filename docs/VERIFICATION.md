# Verification record, 21 October 2026

## Automated

- `npm test`: **14/14** unit tests:
  - shortlist uniqueness, ID-only storage, recovery from malformed, unversioned, outdated and duplicated data
  - menu search (case- and accent-insensitive) with categories, and the gallery filter
  - Kampala calendar dates (including 31 Dec 21:30 UTC = 1 Jan in Kampala) and impossible dates
  - Ugandan and international phones and email formats
  - quote validation: whole positive guest counts, conditional follow-up fields, email-or-phone
  - hidden answers pruned before review, direct-URL step resolution, `DEMO-` references
- `npm run build`: type-check and production build pass.
- `npm run verify` (headless Chrome, one page at a time): **76/76** against the local preview and
  **76/76** against https://kirabo-catering-concept.kranks533.workers.dev. Covers:
  - the hero headline and both calls to action, the header turning solid, one viewport-matched hero preload
  - menus: category and search in the URL, empty state, reset, Back, refresh, unknown category
  - shortlist: toggle never duplicates, a duplicated stored ID shows once, survives refresh;
    drawer focus on open, focus trap, remove keeps focus inside, clear with Undo, Escape returns
    focus to the header button; malformed storage and retired IDs recover
  - all four occasion pages: concept label, planning notes, quote preselects the occasion
  - quote: error summary and focus, past date against Kampala, "somewhere else" follow-up,
    non-whole and zero guest counts, editable menu step, allergy wording, invalid phone,
    email-or-phone rule, preview with edits, the "Demo only — this request will not be sent."
    statement, no "confirm booking", double-click completion yields one `DEMO-` reference, dish
    list, print, restart and continue browsing, no availability, booking, callback or price claims,
    Back cannot resubmit, direct `?step=done` and `?step=review` recovery, restart clears personal
    details but keeps the shortlist
  - gallery: filter, lightbox focus, concept caption, arrow keys, Escape returning focus to the tile
  - contact: the real Facebook link separate from the demo form, no unverified `tel:`, `mailto:` or WhatsApp links
  - direct loads of nested routes and both not-found pages, mobile menu focus, Escape and close on navigation
  - reduced motion leaves everything visible; ScrollTrigger count stable (18 → 18) across navigation and resizing
  - no horizontal overflow and no broken images at 360, 390, 768 and 1440 on nine routes
  - no non-GET or third-party requests, no entered details in URLs, browser storage holds only the
    dish-ID shortlist (plus React Router's scroll positions), no failed requests or console errors

## Hosting

Live status codes after the final deploy: `/`, `/menus`, `/menus?category=drinks`, `/my-menu`,
`/occasions`, `/occasions/introductions`, `/gallery`, `/about`, `/quote?step=review` and
`/contact` return **200**; `/no-such-page` and `/occasions/nowhere` return **404** with the app's
not-found page. `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY` and `nosniff` are present.
The social image URL resolves (200).

Found and fixed while checking live: a drawer focus check sampled once before focus moved on
the next frame; the behaviour was correct, and the check now waits for the state.

## Performance (`scripts/perf.mjs`; not Lighthouse)

One cold load of the home page in headless Chrome against the local preview, no network
throttling. The laptop's CPU was about 50% busy with other apps, so runs varied widely:

| Width | CPU | LCP | CLS | Transferred |
|---|---|---|---|---|
| 390 | 4× slower | 1.8–2.6 s | 0 | ~346 KB |
| 1440 | 1× | 1.6–2.3 s (outliers to 5.8 s while the machine was busy) | 0 | ~515 KB |
| Live, 390 | 4× slower | 3.0–5.5 s | 0 | ~356 KB |
| Live, 1440 | 1× | 2.5–3.7 s (5.1 s once) | 0 | ~430–525 KB |

On desktop the LCP element is the hero photograph (1672 px WebP, ~260 KB). Changes made after
measuring: GSAP is loaded on demand rather than in the first bundle (main JS 115 KB gzip), the two
Latin fonts are preloaded, the desktop hero declares its real rendered width in `sizes` (so a
1440 screen fetches the 1280 file, not the 1672), the hero image is no longer `decoding="async"`, and the lede only moves
during the entrance instead of fading (a fading paragraph became a late LCP candidate on phones).

## Screenshots

`docs/screenshots/` holds full-page captures at 1440 (home, menus, my menu, an occasion, gallery,
quote, contact, about) and 390 (home, menus, quote, gallery), with motion reduced and a three-dish
shortlist seeded. They were reviewed, and these defects were fixed: the headline sat over the food
at 1440 (the photo is now anchored right and fades into a matching ground), the lede was hard to
read at 1024 (deeper shade), and the My menu list was centred against a left-aligned intro.

## Not done

- No Lighthouse or axe run; keyboard and focus checks are scripted, not a full audit.
- No real phones, Safari, Firefox or screen reader.
- Business facts could not be verified (see `CONTENT-NOTES.md`).
