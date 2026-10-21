# Assets

All twelve photographs came from `Kirabo_Catering_Agent_Pack.zip` and are **AI-generated
illustrations**. They are not Kirabo's dishes, staff, premises or events, and the site says so on
every image or group of images. The originals are kept unchanged in `assets-src/original/`
(with the pack's `manifest.json`); `scripts/prepare-images.py` refuses to run if any hash differs.

Derivatives are WebP at quality 78 in `public/images/<name>-<width>.webp`, never upscaled.
Every `<img>` declares intrinsic width and height from `src/data/image-manifest.json`, uses
`srcset`/`sizes`, and lazy-loads unless it is the hero (or the first image on an occasion page).
Only the hero matching the viewport is preloaded, and only on the home page.

| Original | Name on site | Widths | Used for |
|---|---|---|---|
| 01-hero-desktop.png (1672×941) | `hero-desktop` | 960, 1280, 1672 | Home hero ≥768px; social cover; gallery ("a shared table") |
| 02-hero-mobile.png (1024×1536) | `hero-mobile` | 480, 768, 1024 | Home hero <768px (via `<picture>`) |
| 03-luwombo.png | `luwombo` | 640, 1024, 1536 | Home signature dish; gallery |
| 04-traditional-buffet.png | `buffet` | 640, 1024, 1536 | Traditional favourites menu header; gallery |
| 05-grilled-platter.png | `grill` | 640, 1024, 1536 | Grills menu header; gallery; home mosaic |
| 06-vegetarian-meal.png | `vegetarian` | 640, 1024, 1536 | Vegetarian ideas menu header; gallery; home mosaic |
| 07-wedding-buffet.png | `wedding` | 640, 1024, 1536 | Weddings occasion; gallery |
| 08-introduction-catering.png | `introduction` | 640, 1024, 1536 | Introductions occasion; gallery; home mosaic |
| 09-corporate-lunch.png | `corporate` | 640, 1024, 1536 | Corporate gatherings occasion; gallery |
| 10-private-celebration.png | `private` | 640, 1024, 1536 | Private celebrations occasion; gallery |
| 11-fresh-drinks.png (1122×1402) | `drinks` | 480, 800, 1122 | Drinks menu header; gallery; home mosaic |
| 12-banana-leaf-background.png | — | — | **Not used** (see below) |

## Honest mapping

- Menu photographs are **category spreads**, captioned "A spread for this menu, not a photograph
  of each dish". No dish card has its own photo, so there is no false one-to-one mapping.
- The luwombo and matooke presentation is illustrative. Copy says the image "does not show how
  Kirabo prepares or presents the dish".
- The vegetarian platter is labelled "Vegetarian ideas … not a dietary guarantee". No image is
  used to imply ingredients, allergen safety, halal, vegan or any certification.
- No crops are presented as additional photographs; images are used whole (object-fit with focal points).

## Image 12, the banana leaf

The asset guide calls it an opaque background ("NOT a transparent cutout"). The file is actually
RGBA: about 67% of its pixels are fully transparent, and the colour under them is a black-to-green
glow. Used opaque, it shows that glow on black; used with its alpha, it would be the overlay the
brief forbids. Neither suited the warm cream palette, so it is omitted rather than misused.

## Generated in code (not AI imagery)

- `public/brand/kirabo-wordmark-concept-{dark,light}.svg`, `src/components/wordmark.json`: a proposed
  wordmark ("Kirabo" in Fraunces 600, "Catering Services" in Manrope 600, outlined to paths) with a
  plate-and-banana-leaf mark. **A proposal, not Kirabo's identity.** Built by `scripts/make-brand.py`.
- `public/favicon.svg`, `public/apple-touch-icon.png`: the same mark on banana-leaf green.
- `public/social/kirabo-concept-1200x630.jpg`: the desktop hero with the headline rendered live in
  the site's fonts and a concept disclaimer, by `scripts/social.mjs`.
- Fonts are self-hosted from `@fontsource-variable/fraunces` and `@fontsource-variable/manrope`
  (SIL Open Font License).
