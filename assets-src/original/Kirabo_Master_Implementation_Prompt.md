# Kirabo Catering Services — master implementation prompt

Build a complete, highly polished independent catering website pitch for Arthur Kitandwe. Read this brief and ASSET-GUIDE.md in full, inspect all supplied assets, then implement through verification. Do not stop at a plan or a landing page. Make routine design decisions autonomously. Use suitable available skills for UI design, frontend implementation, GSAP/ScrollTrigger, accessibility, image optimisation and deployment. Read the skills you apply and follow applicable workspace instructions.

## Identity and honesty
This is an independent concept, not Kirabo's official website. All 12 photographs are AI-generated illustrations, not evidence of Kirabo dishes, premises, employees or events. Label the imagery/menu collections as illustrative concepts and disclose the independent proposal in the footer. Never fabricate testimonials, clients, experience figures, capacity limits, awards, certifications, prices, staff portraits or availability. Do not claim allergy-free, halal, vegan or other certified preparation. Dietary preferences are discussion requests, not guarantees.

Verify business facts from official sources before publishing: start with https://www.facebook.com/p/Kirabo-Catering-Services-100065414382338/ and official profiles linked there. The supplied phone +256 781 148255, Kampala/Wakiso service area, claimed 24-hour hours and services are leads to check, not automatically verified facts. Record source URLs/access dates and unresolved information in docs/CONTENT-NOTES.md. Omit uncertain details. Do not use scraped third-party photos without permission. Do not invent an address or map pin. The concept menus below are illustrative suggestions rather than a verified Kirabo menu.

## Visual direction
Warm, generous and distinctly Ugandan. Palette: cream #F7F0E4, banana-leaf green #294336, charcoal #24231F, roasted terracotta #A64E32. Expressive editorial serif headings paired with a clean readable sans-serif such as Manrope. Fluid typography, deliberate whitespace and richly appetising imagery. Avoid generic SaaS cards, neon accents, excessive pill buttons or a restaurant delivery-app clone. Create a restrained proposed Kirabo Catering wordmark and simple leaf/plate favicon in SVG, with light/dark variants; do not imply these are an official identity.

Use live hero headline 'Good food. Generous hospitality. Memorable occasions.' with Explore the menus and Request a catering quote. Wide food scene on desktop; portrait image on mobile. Dark negative space behind headline; contrast checked. A useful CTA must appear early and recur naturally. Food is the main visual focus, not decorative animation.

## Stack and architecture
React + TypeScript + Vite with proper routes, typed menu/occasion data and modular components unless an existing appropriate stack is already present. No database, payments, login or external form service for this concept. All interactive journeys must function locally. Keep external business contact actions separate from demo forms. No forms may silently send email, WhatsApp or network requests.

## Required pages
- Home: art-directed hero, signature food feature, menu preview, occasion sections, proposed service process, food gallery preview and final quotation CTA.
- Menus: illustrated example selections grouped into Traditional favourites, Grills, Vegetarian ideas and Drinks. Use the supplied dish/spread photos honestly, with no false one-to-one photo mapping. Search, category filters, empty state, reset and URL-based filter state. Cards show dish name, short description and Add to my menu toggle. No fake prices or stock. Explain that choices form a discussion shortlist, not a priced order.
- Menu selection page and shared drawer: persistent shortlist of unique item IDs, remove/clear actions, item count and Continue to quote. No cart totals or purchase checkout. Adding an existing item must not duplicate it. Recover safely from malformed storage and outdated IDs. Only shortlist IDs, never personal or dietary details, may be persisted. Provide an accessible drawer with focus trap, Escape and restored focus. Clearing should have an undo or confirmation.
- Occasions: Weddings, Introductions, Corporate gatherings and Private celebrations, labelled as proposed concept categories pending verification. Dedicated /occasions/:slug pages use the relevant asset, helpful planning copy and a quote CTA that preselects the occasion. No fabricated actual client stories.
- Gallery: filterable food and catering concepts with accessible lightbox, keyboard controls, Escape and focus restoration; useful captions and clear illustrative labels.
- About: verified facts where available; otherwise focus on the proposed site experience without inventing a company biography or owner photograph.
- Request a quote: the full multi-step journey specified below.
- Contact: verified channels if available, contact form with validation/review/demo confirmation, and clear independent-concept disclosure.
- Not found: useful recovery links.

## Quotation journey
Four steps: (1) event type, date or undecided, Kampala/Wakiso/other location and venue status; (2) positive whole-number guest estimate, preferred service style and optional budget discussion; (3) editable menu shortlist, optional dietary/allergy discussion notes and name/email/phone; (4) review with edit links and explicit demo acknowledgement.

Use sensible bounded input lengths. Validate fields at step advance and final confirmation, with inline errors and focused error summary. Date restrictions use Africa/Kampala calendar date, not UTC slicing. Allow flexible dates. Support sensible Ugandan and international phone formats without an over-restrictive regex. Provide Use sample details. Preserve values when going Back in memory; do not put personal information in URL, localStorage, analytics or logs. Do not invent pricing from guest counts. State that allergy requirements need direct confirmation with the caterer; do not imply a form selection establishes safe preparation.

Before the final action clearly display 'Demo only — this request will not be sent.' Use 'Preview request' or 'Complete demo request', never 'Confirm booking'. Confirmation must say nothing was sent, no booking or availability was confirmed, and show a DEMO reference, print summary and continue browsing. Prevent duplicate confirmation. Clear personal form state on restart; the menu shortlist should clear only on explicit user action. Direct confirmation visits without state show a useful restart path. No made-up callback promise.

## Assets and motion
Preserve all supplied PNGs in assets-src/original, produce responsive WebP derivatives, declare dimensions and sizes, lazy-load below-fold imagery, preload only the active hero. Inspect every food image; generated matooke presentation is illustrative and must not be described as verified Kirabo preparation. Generate original vector wordmark/favicon and a social cover using the hero plus live-rendered text; no need for more AI photos or fake staff.

Use GSAP and ScrollTrigger for a short headline entrance, gentle hero image settling, modest section reveals and one satisfying menu interaction. The banana-leaf image has a background, not transparency. Use it as a section background or omit; do not treat it as an alpha cutout. Decorative layers cannot block clicks and are aria-hidden. No scroll hijacking, custom cursor, perpetual floating, heavy canvas, full-page loading animation or mobile pinned sequences. Use gsap.context and clean up on route changes. Reduced motion displays all content immediately. Mobile gets lighter motion; animate transforms and opacity only. Check repeated route navigation/resizing for accumulating triggers.

## Accessibility and performance
Semantic landmarks, skip link, descriptive headings, labelled inputs, visible keyboard focus, comfortable touch targets and tested contrast. Mobile navigation closes on route change/Escape and handles focus. Route changes open at the top, with sensible history restoration. No hidden content if animations fail. Self-host fonts when practical; use fallbacks. Avoid heavy embedded social feeds and maps. No horizontal overflow at 360px.

## Verification
Keep tests focused: shortlist uniqueness/storage recovery, filters, validation, Kampala date handling and confirmation state. Build/typecheck must pass. Browser-test 360, 390, 768 and 1440px. Exercise browsing → shortlist → quote → errors → back/edit → review → demo confirmation → print/restart. Check contact flow, filters, lightbox, mobile menu, keyboard and reduced motion. Verify no personal details persist and no external submission occurs. Deep-link refresh must work. Capture and inspect desktop/mobile screenshots, fix visible defects, and report only checks actually completed. Do not claim real-device testing or perfect accessibility/performance scores without measurement.

## Repository and publication
Prepare a separate GitHub repository kirabo-catering-concept and fresh Cloudflare deployment when authenticated tools and user authorisation permit. Do not modify the official business presence or another project. Finish all local build and verification work even if external access is blocked; then report the exact publishing blocker. Never invent a live link. Keep secrets out of Git. Configure SPA routing, favicon and social metadata with concept wording. Document manual vs automatic deployment accurately and provide update commands. No outreach to Kirabo is authorised by this implementation brief.

## Deliverables
Complete working multi-page site; source; README with install/build/test/deploy commands; docs/ASSETS.md with mappings and reuse/crop notes; docs/CONTENT-NOTES.md with verified facts/omissions; desktop/mobile captures; concise implementation report describing the actual functionality, tests, live/repo links if completed and limitations. The result should sell a coherent catering enquiry journey, not just attractive food images.
