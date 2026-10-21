// Render the 1200×630 link-preview cover: the desktop hero with the live headline set in the
// site's own fonts, so the text is crisp rather than baked into a generated image.
// Run after `npm run images`: node scripts/social.mjs
import { readFileSync, mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const root = new URL('..', import.meta.url)
const file = path => new URL(path, root)
const toPath = url => url.pathname.replace(/^\/([A-Z]:)/, '$1')
const base64 = path => readFileSync(file(path)).toString('base64')

const serif = base64('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2')
const sans = base64('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')
const hero = base64('public/images/hero-desktop-1280.webp')
const mark = readFileSync(file('public/brand/kirabo-wordmark-concept-light.svg'), 'utf8').replace(/width="\d+" height="\d+"/, 'height="46"')

const html = `<!doctype html><html><head><style>
@font-face { font-family: F; src: url(data:font/woff2;base64,${serif}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: M; src: url(data:font/woff2;base64,${sans}) format('woff2'); font-weight: 200 800; }
* { margin: 0 } body { width: 1200px; height: 630px; overflow: hidden; background: #2a211a; }
.bg { position: absolute; inset: 0; background: url(data:image/webp;base64,${hero}) 70% 50% / cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(26,20,15,.88) 0%, rgba(26,20,15,.66) 36%, rgba(26,20,15,.1) 62%, rgba(26,20,15,0) 75%); }
.text { position: absolute; left: 64px; top: 64px; bottom: 56px; display: flex; flex-direction: column; justify-content: space-between; color: #F7F0E4; }
h1 { font: 520 58px/1.05 F; letter-spacing: -0.02em; }
p { font: 600 17px/1.4 M; color: #E9DCC4; max-width: 36ch; }
svg { align-self: flex-start; width: auto; }
</style></head><body><div class="bg"></div><div class="shade"></div><div class="text">
${mark}<h1>Good food.<br>Generous hospitality.<br>Memorable occasions.</h1>
<p>Independent website concept. AI-generated illustrative image; not Kirabo’s official website.</p>
</div></body></html>`

mkdirSync(file('public/social/'), { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: toPath(file('public/social/kirabo-concept-1200x630.jpg')), type: 'jpeg', quality: 84 })
await browser.close()
console.log('social cover written')
