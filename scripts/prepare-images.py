"""Derive the website's images from the untouched asset pack in assets-src/original.

Run with `npm run images` (Python 3 + Pillow). Outputs are committed, so the build never
depends on Python. Nothing is upscaled beyond its source width; WebP quality is 78.

Writes public/images/<name>-<width>.webp and src/data/image-manifest.json, which the <Img>
component reads for srcset widths, intrinsic size and focal point. The social cover is made
separately by scripts/social.mjs, because it needs live-rendered text.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
pack = root / 'assets-src' / 'original'
images = root / 'public' / 'images'
images.mkdir(parents=True, exist_ok=True)

# The pack's manifest records each original's hash; refuse to derive from altered files.
for entry in json.loads((pack / 'manifest.json').read_text()):
    digest = hashlib.sha256((pack / entry['file']).read_bytes()).hexdigest()
    if digest != entry['sha256']:
        raise SystemExit(f"{entry['file']} does not match the pack manifest")

manifest = {}


def derive(source, name, widths, box=None, quality=78, focal='50% 50%'):
    with Image.open(pack / 'images' / source) as original:
        image = original.convert('RGBA' if original.mode == 'RGBA' else 'RGB')
        if box:
            image = image.crop(box)
        made = []
        for width in sorted(set(min(w, image.width) for w in widths)):
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                images / f'{name}-{width}.webp', 'WEBP', quality=quality, method=6)
            made.append(width)
        manifest[name] = {'source': source, 'crop': list(box) if box else None, 'width': image.width,
                          'height': image.height, 'widths': made, 'focal': focal}
        print(f'{name}: {image.width}x{image.height} -> {made}')


# Heroes: the wide feast keeps its dark left side for the headline; the portrait feast has
# dark green space above the food, where the headline sits on phones.
derive('01-hero-desktop.png', 'hero-desktop', [960, 1280, 1672], focal='70% 50%')
derive('02-hero-mobile.png', 'hero-mobile', [480, 768, 1024], focal='50% 60%')

# Dish and spread photographs, used whole.
derive('03-luwombo.png', 'luwombo', [640, 1024, 1536], focal='40% 55%')
derive('04-traditional-buffet.png', 'buffet', [640, 1024, 1536], focal='50% 55%')
derive('05-grilled-platter.png', 'grill', [640, 1024, 1536], focal='35% 50%')
derive('06-vegetarian-meal.png', 'vegetarian', [640, 1024, 1536], focal='50% 50%')
derive('11-fresh-drinks.png', 'drinks', [480, 800, 1122], focal='40% 55%')

# Occasion scenes, used whole.
derive('07-wedding-buffet.png', 'wedding', [640, 1024, 1536], focal='35% 60%')
derive('08-introduction-catering.png', 'introduction', [640, 1024, 1536], focal='40% 65%')
derive('09-corporate-lunch.png', 'corporate', [640, 1024, 1536], focal='60% 60%')
derive('10-private-celebration.png', 'private', [640, 1024, 1536], focal='50% 55%')

# 12-banana-leaf-background.png is deliberately not derived; see docs/ASSETS.md.

(root / 'src' / 'data' / 'image-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('manifest written')
