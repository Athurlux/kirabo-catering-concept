"""Build the proposed wordmark and favicon as outlined SVG (no font needed to display them).

Run once with `py -P scripts/make-brand.py` (needs fonttools + brotli). Outputs are committed.
These are proposal assets for the pitch, not Kirabo Catering Services' official identity.

- public/brand/kirabo-wordmark-concept-dark.svg   charcoal and green, for light grounds
- public/brand/kirabo-wordmark-concept-light.svg  cream, for dark grounds and photographs
- public/favicon.svg                              leaf on a plate, on banana-leaf green
- src/components/wordmark.json                    the same paths for the inline header logo
"""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parents[1]
fonts = root / 'node_modules' / '@fontsource-variable'


def outline(font_file, axes, text, size, x, baseline, tracking=0.0):
    font = instantiateVariableFont(TTFont(font_file), axes)
    scale = size / font['head'].unitsPerEm
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    pen = SVGPathPen(glyphs, ntos=lambda n: f'{n:.1f}'.rstrip('0').rstrip('.'))
    for char in text:
        name = cmap[ord(char)]
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        x += glyphs[name].width * scale + tracking
    return pen.getCommands(), x - tracking


serif = fonts / 'fraunces' / 'files' / 'fraunces-latin-full-normal.woff2'
sans = fonts / 'manrope' / 'files' / 'manrope-latin-wght-normal.woff2'

# The mark: a plate seen from above (a ring) holding one banana leaf, drawn on a 56px square.
MARK = ('M28 4a24 24 0 1 0 0 48a24 24 0 1 0 0-48Zm0 4.5a19.5 19.5 0 1 1 0 39a19.5 19.5 0 1 1 0-39Z',
        'M15.5 39.5C14 27 22 15.5 38.5 13c1.6 13.5-7.4 25.6-23 26.5Z',
        'M17.5 37.5 35 16.5')

text_x = 68
name_path, name_end = outline(serif, {'wght': 600, 'opsz': 72, 'SOFT': 50, 'WONK': 0}, 'Kirabo', 44, text_x, 36)
_, natural = outline(sans, {'wght': 600}, 'Catering Services', 12.5, 0, 54)
sub_path, sub_end = outline(sans, {'wght': 600}, 'Catering Services', 12.5, text_x + 1, 54,
                            tracking=max(0.0, (name_end - text_x - 2 - natural) / 16))
width = round(max(name_end, sub_end) + 2)
height = 58
data = {'viewBox': f'0 0 {width} {height}', 'name': name_path, 'sub': sub_path,
        'plate': MARK[0], 'leaf': MARK[1], 'vein': MARK[2]}
(root / 'src' / 'components' / 'wordmark.json').write_text(json.dumps(data) + '\n')
print('wordmark', width, 'x', height, 'name ends', round(name_end), 'sub ends', round(sub_end))

brand = root / 'public' / 'brand'
brand.mkdir(parents=True, exist_ok=True)
for variant, ink, leaf, vein, sub in (('dark', '#24231F', '#294336', '#F7F0E4', '#294336'),
                                      ('light', '#F7F0E4', '#C9DCC2', '#294336', '#E9DCC4')):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{data["viewBox"]}" width="{width * 3}" height="{height * 3}" role="img" '
           f'aria-label="Kirabo Catering Services, proposed concept wordmark (independent proposal)">'
           f'<g transform="translate(0 1)"><path fill="{ink}" fill-rule="evenodd" d="{MARK[0]}"/><path fill="{leaf}" d="{MARK[1]}"/>'
           f'<path fill="none" stroke="{vein}" stroke-width="1.4" stroke-linecap="round" d="{MARK[2]}"/></g>'
           f'<path fill="{ink}" d="{name_path}"/><path fill="{sub}" d="{sub_path}"/></svg>\n')
    (brand / f'kirabo-wordmark-concept-{variant}.svg').write_text(svg)

favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#294336"/>
  <g transform="translate(4 4)">
    <path fill="#F7F0E4" fill-rule="evenodd" d="{MARK[0]}"/>
    <path fill="#E39A7E" d="{MARK[1]}"/>
    <path fill="none" stroke="#294336" stroke-width="1.6" stroke-linecap="round" d="{MARK[2]}"/>
  </g>
</svg>
'''
(root / 'public' / 'favicon.svg').write_text(favicon)
print('brand files written')
