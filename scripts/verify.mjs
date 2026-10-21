// Compact browser journey check. Run against a preview build:
//   npm run build && npm run preview -- --port 4181   (another terminal)
//   npm run verify     or   VERIFY_URL=https://kirabo-catering-concept.kranks533.workers.dev npm run verify
// One headless Chrome, one page at a time. Checks wait for state rather than sampling once.
import { chromium } from 'playwright'

const BASE = (process.env.VERIFY_URL ?? 'http://127.0.0.1:4181').replace(/\/$/, '')
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const KEY = 'kirabo-concept-menu'
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`) }

const browser = await chromium.launch({ executablePath: CHROME })
const context = await browser.newContext({ viewport: { width: 1280, height: 860 } })
const page = await context.newPage()
const requests = []
const failures = []
const errors = []
page.on('request', request => requests.push({ method: request.method(), url: request.url() }))
page.on('response', response => { if (response.status() >= 400 && !/no-such-page|occasions\/nowhere/.test(response.url())) failures.push(`${response.status()} ${response.url()}`) })
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error' && !/404/.test(message.text())) errors.push(message.text()) })

const go = async path => { await page.goto(BASE + path, { waitUntil: 'networkidle' }) }
const sees = async (text, timeout = 8000) => page.getByText(text).first().waitFor({ timeout }).then(() => true, () => false)
const waitFor = (fn, arg) => page.waitForFunction(fn, arg, { timeout: 5000 }).then(() => true, () => false)
const button = name => page.getByRole('button', { name, exact: true })
const dishes = n => waitFor(n => document.querySelectorAll('.menus .bill__item').length === n, n)
const stored = () => page.evaluate(key => localStorage.getItem(key), KEY)
const focused = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent?.trim())
const runSample = async finalLabel => {
  for (let step = 0; step < 6 && !(await button(finalLabel).count()); step++) {
    if (await button('Use sample details').count()) await button('Use sample details').click()
    await page.locator('.flow__actions button[type="submit"]').click()
    await page.waitForTimeout(150)
  }
  return (await button(finalLabel).count()) > 0
}
// Positive claims only: the honest copy ("No booking was made", "no date or availability was confirmed") must not match.
const CLAIMS = /availab(le|ility) (is )?confirmed|date is (reserved|held|booked)|booking (is )?confirmed|we will (call|contact)|we'll (call|be in touch)|callback|request (has been|was) sent|UGX\s?\d/i

try {
  // 1. Home: live headline, transparent header that turns solid, early CTAs
  await go('/')
  check('live hero headline', await page.getByRole('heading', { level: 1, name: 'Good food. Generous hospitality. Memorable occasions.' }).isVisible())
  check('both hero calls to action', await page.locator('.hero').getByRole('link', { name: 'Explore the menus' }).isVisible() && await page.locator('.hero').getByRole('link', { name: 'Request a catering quote' }).isVisible())
  check('only one hero image is preloaded for this viewport', await page.evaluate(() => [...document.querySelectorAll('link[rel=preload][as=image]')].filter(link => matchMedia(link.media).matches).length === 1))
  await page.mouse.wheel(0, 900)
  check('header turns solid on scroll', await waitFor(() => !document.querySelector('.site-header.is-transparent')))
  await page.locator('.hero').getByRole('link', { name: 'Explore the menus' }).click()
  check('Explore the menus opens all dishes', await page.waitForURL(/\/menus$/).then(() => true, () => false) && await dishes(28))

  // 2. Menu search and filters live in the URL; Back and refresh keep them; empty state resets
  await page.locator('.filters').getByRole('link', { name: 'Drinks' }).click()
  await page.waitForURL(/category=drinks/)
  check('category filter narrows the menu', await dishes(6) && await sees('Showing 6 dishes in Drinks.'))
  await page.locator('#menu-search').fill('juice')
  check('search combines with the category, in the URL', await dishes(3) && page.url().includes('q=juice'))
  await page.locator('.filters').getByRole('link', { name: 'Grills' }).click()
  await page.waitForURL(/category=grills/)
  check('no match shows an empty state', await sees('No dishes match “juice”.'))
  await page.goBack()
  check('Back restores the previous filter and search', await page.waitForURL(/category=drinks.*q=juice|q=juice.*category=drinks/).then(() => true, () => false) && await dishes(3))
  await page.reload({ waitUntil: 'networkidle' })
  check('refresh keeps filter and search', await dishes(3) && await page.locator('#menu-search').inputValue() === 'juice')
  await page.getByRole('link', { name: 'Reset filters' }).click()
  check('reset shows every dish', await dishes(28) && await page.locator('#menu-search').inputValue() === '')
  await go('/menus?category=bogus')
  check('an unknown category shows everything', await dishes(28))

  // 3. Shortlist: unique IDs, toggle, persistence, drawer focus, remove, clear and undo
  await page.evaluate(key => localStorage.removeItem(key), KEY)
  await go('/menus')
  const luwombo = page.getByRole('button', { name: 'Add Chicken luwombo to my menu' })
  await luwombo.click()
  check('adding marks the dish chosen and updates the count', await luwombo.getAttribute('aria-pressed') === 'true' && await page.locator('.site-header [data-menu-count]').innerText() === '1')
  await page.evaluate(() => { localStorage.setItem('kirabo-concept-menu', JSON.stringify({ version: 1, items: ['chicken-luwombo', 'chicken-luwombo'] })) })
  await page.reload({ waitUntil: 'networkidle' })
  check('a duplicated stored ID is shown once', await page.locator('.site-header [data-menu-count]').innerText() === '1')
  await page.getByRole('button', { name: 'Add Passion fruit juice to my menu' }).click()
  await page.getByRole('button', { name: 'Add Beef skewers to my menu' }).click()
  check('storage holds only unique dish IDs', JSON.stringify(JSON.parse(await stored()).items) === JSON.stringify(['chicken-luwombo', 'passion-juice', 'beef-skewers']))
  await luwombo.click()
  check('pressing again removes it (a toggle, never a duplicate)', await luwombo.getAttribute('aria-pressed') === 'false' && !(await stored()).includes('chicken-luwombo'))
  await luwombo.click()
  await page.reload({ waitUntil: 'networkidle' })
  check('the shortlist survives a refresh', await page.locator('.site-header [data-menu-count]').innerText() === '3' && await sees('3 dishes on your menu'))
  await page.locator('.site-header .menu-count-button').click()
  check('drawer opens with focus on its close button', await page.getByRole('dialog', { name: /My menu/ }).isVisible() && await focused() === 'Close my menu')
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
  check('focus stays inside the drawer', await page.evaluate(() => document.querySelector('.drawer')?.contains(document.activeElement)))
  await page.getByRole('button', { name: 'Remove Passion fruit juice' }).click()
  // Focus moves on the next frame, so wait for it rather than sampling once.
  check('remove in the drawer updates the list and keeps focus inside', await sees('2 dishes') && await waitFor(() => document.activeElement?.getAttribute('aria-label') === 'Remove Beef skewers'))
  await page.getByRole('button', { name: 'Clear my menu' }).click()
  check('clear empties the menu and offers Undo', await sees('Menu cleared.') && await sees('No dishes on your menu yet.') && (await stored()) === null)
  await button('Undo').click()
  check('Undo restores the menu', await sees('2 dishes') && JSON.parse(await stored()).items.length === 2)
  await page.keyboard.press('Escape')
  check('Escape closes the drawer and returns focus to the header button', await page.locator('.drawer').count() === 0 && /^My menu/.test(await focused()))
  await page.evaluate(key => localStorage.setItem(key, '{broken json'), KEY)
  await go('/my-menu')
  check('malformed storage recovers to an empty menu', await sees('No dishes on your menu yet.'))
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({ version: 1, items: ['retired-dish', 'coffee'] })), KEY)
  await go('/my-menu')
  check('outdated IDs are dropped, known ones kept', await sees('1 dish chosen') && await sees('Coffee'))
  await page.getByRole('link', { name: 'Add more dishes' }).click()
  await page.getByRole('button', { name: 'Add Steamed matooke to my menu' }).click()

  // 4. Occasions: concept labels, planning notes, quote preselects the occasion
  for (const [slug, label] of [['weddings', 'Wedding'], ['introductions', 'Introduction'], ['corporate', 'Corporate gathering'], ['private-celebrations', 'Private celebration']]) {
    await go(`/occasions/${slug}`)
    const labelled = await page.locator('h1 .concept-label').isVisible() && await sees('not a record of past work')
    await page.locator('.occasion__aside').getByRole('link', { name: 'Start a quote request' }).click()
    await page.waitForURL(/\/quote\?occasion=/)
    check(`${slug}: labelled concept, quote preselects ${label}`, labelled && await page.getByRole('radio', { name: label, exact: true }).isChecked())
  }

  // 5. Quote: validation, Kampala dates, guests, menu step, review edits, demo completion
  await go('/quote')
  await button('Next').click()
  check('empty step shows an error summary and focuses the first field', await page.locator('.error-summary').isVisible() && await waitFor(() => document.activeElement?.closest('#occasion') !== null))
  await page.getByRole('radio', { name: 'Introduction', exact: true }).check()
  await page.getByRole('radio', { name: 'We have a date' }).check()
  await page.locator('#date').fill('2020-01-01')
  await page.getByRole('radio', { name: 'Somewhere else' }).check()
  await page.getByRole('radio', { name: 'Still choosing' }).check()
  await button('Next').click()
  check('a past date is rejected against Kampala today', (await page.locator('#date-error').innerText()).includes('Kampala time'))
  check('“somewhere else” asks for the town', (await page.locator('#locationOther-error').count()) === 1)
  await page.getByRole('radio', { name: 'Roughly, not fixed' }).check()
  await page.locator('#timing').fill('Early 2027')
  await page.locator('#locationOther').fill('Mukono')
  await button('Next').click()
  await page.locator('#guests').fill('12.5')
  await page.getByRole('radio', { name: /^Buffet/ }).check()
  await button('Next').click()
  check('guest estimate must be a whole number', (await page.locator('#guests-error').innerText()).includes('whole number'))
  await page.locator('#guests').fill('0')
  await button('Next').click()
  check('guest estimate must be positive', (await page.locator('#guests-error').innerText()).includes('at least 1'))
  await page.locator('#guests').fill('180')
  await button('Next').click()
  check('menu step shows the shortlist, editable', await sees('Dishes to discuss') && await page.locator('.menu-step .menu-list__row').count() === 2)
  check('allergy notes are framed as needing direct confirmation', await sees('does not mean food will be prepared safely'))
  await page.locator('.menu-step').getByRole('button', { name: 'Remove Coffee' }).click()
  await page.locator('#name').fill('Test Person')
  await page.locator('#phone').fill('12345')
  await button('Preview request').click()
  check('an invalid phone is rejected', (await page.locator('#phone-error').innerText()).includes('international number'))
  await page.locator('#phone').fill('')
  await button('Preview request').click()
  check('needs an email or a phone number', (await page.locator('#contact-details-error').count()) === 1)
  await page.locator('#phone').fill('+44 7700 900123')
  await button('Preview request').click()
  check('preview shows answers and the edited menu', await sees('Preview your request') && await sees('Early 2027') && await sees('Mukono') && await sees('+447700900123') && !(await page.locator('.menu-summary').getByText('Coffee').count()))
  await page.getByRole('button', { name: /Edit Your event/ }).click()
  await page.getByRole('radio', { name: 'Not decided yet' }).check()
  await button('Next').click(); await button('Next').click(); await button('Preview request').click()
  check('editing from preview keeps other answers and drops the hidden one', await sees('Test Person') && !(await page.getByText('Early 2027').count()))
  check('states “Demo only — this request will not be sent.” before completion', await sees('Demo only — this request will not be sent.') && !(await page.getByText(/confirm booking/i).count()))
  await button('Complete demo request').dblclick()
  check('confirmation: one DEMO reference, nothing sent', await sees(/DEMO-[A-HJ-NP-Z2-9]{6}/) && await page.getByText(/DEMO-[A-HJ-NP-Z2-9]{6}/).count() === 1 && await sees('Nothing was sent to Kirabo Catering Services'))
  check('confirmation lists the dishes, offers print, restart and browsing', await sees('Steamed matooke') && await page.getByRole('button', { name: 'Print summary' }).isVisible() && await button('Start a new request').isVisible() && await page.getByRole('link', { name: 'Continue browsing the menus' }).isVisible())
  check('confirmation claims no availability, booking, callback or price', !CLAIMS.test(await page.locator('main').innerText()))
  await page.goBack({ waitUntil: 'networkidle' })
  check('Back cannot resubmit: the draft is gone', !(await button('Complete demo request').count()) && await sees('Your event'))
  await go('/quote?step=done')
  check('a direct confirmation URL shows a restart path', await sees('There’s no summary to show.') && await button('Start again').isVisible())
  await go('/quote?step=review')
  check('a direct review URL starts at step one', await sees('Type of event') && page.url().includes('step=event'))
  check('restart clears personal details but keeps the shortlist', !(await page.locator('#name').count()) && (await stored())?.includes('steamed-matooke'))
  check('sample details complete the whole flow', await runSample('Complete demo request'))

  // 6. Gallery: filter in the URL, lightbox keyboard, Escape and focus restoration
  await go('/gallery?filter=spreads')
  check('gallery filter narrows the images', await waitFor(() => document.querySelectorAll('.gallery-tile').length === 5))
  await go('/gallery')
  const tile = page.locator('#g-grill')
  await tile.focus()
  await page.keyboard.press('Enter')
  check('lightbox opens with focus on close and a concept label', await page.getByRole('dialog', { name: 'Image viewer' }).isVisible() && await focused() === 'Close image viewer' && await page.locator('.lightbox').getByText('AI-generated').isVisible())
  const first = await page.locator('.lightbox__count').innerText()
  await page.keyboard.press('ArrowRight')
  check('arrow keys page through images', await waitFor(before => document.querySelector('.lightbox__count')?.textContent !== before, first))
  await page.keyboard.press('Escape')
  check('Escape closes the lightbox and returns focus to the image', await page.locator('.lightbox').count() === 0 && await page.evaluate(() => document.activeElement?.id === 'g-grill'))

  // 7. Contact: the real channel apart from the demo form
  await go('/contact')
  check('the real Facebook link is a separate action', (await page.locator('.real-contact a[href*="facebook.com"]').count()) === 1)
  check('no unverified phone, email or WhatsApp link anywhere', (await page.locator('a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"]').count()) === 0)
  check('contact message completes as a demo', await runSample('Complete demo message') && await sees('Demo only — this message will not be sent.') && (await button('Complete demo message').click(), await sees('No message was sent')))

  // 8. Direct loads and not found
  for (const [path, text] of [['/about', 'What this concept says about Kirabo'], ['/occasions', 'Proposed categories, pending confirmation.'], ['/occasions/weddings', 'Planning notes'], ['/my-menu', 'My menu'], ['/occasions/nowhere', 'We couldn’t find that occasion.'], ['/no-such-page', 'This page isn’t on the menu.']]) {
    await go(path); check(`direct load ${path}`, await sees(text))
  }
  await page.locator('.not-found__links').getByRole('link', { name: 'Sample menus' }).click()
  check('not-found links work', await page.waitForURL(/\/menus$/).then(() => true, () => false))

  // 9. Mobile menu: focus, Escape, closes on navigation
  await page.setViewportSize({ width: 390, height: 800 })
  await go('/about')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  check('mobile menu focuses its first link', await page.evaluate(() => document.activeElement?.textContent === 'Home'))
  await page.keyboard.press('Escape')
  check('Escape closes the menu and restores focus', await focused() === 'Open navigation' && await page.locator('#mobile-menu').isHidden())
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Gallery' }).click()
  await page.waitForURL(/gallery/)
  check('menu closes on navigation and the page starts at the top', await waitFor(() => document.getElementById('mobile-menu')?.hidden === true && window.scrollY === 0))

  // 10. Reduced motion: complete static composition
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 860 } })
  await reduced.goto(BASE + '/', { waitUntil: 'networkidle' })
  check('reduced motion: headline and content fully visible', await reduced.evaluate(() => !document.documentElement.classList.contains('hero-pending')
    && [...document.querySelectorAll('[data-hero="line"], [data-anim="rise"], [data-anim="scene"]')].every(el => getComputedStyle(el).transform === 'none' && getComputedStyle(el).opacity === '1')))
  await reduced.close()

  // 11. No trigger build-up across navigation and resizing
  await page.setViewportSize({ width: 1280, height: 860 })
  await go('/')
  const initial = await page.evaluate(() => window.__scrollTriggerCount?.())
  for (let i = 0; i < 3; i++) {
    await page.locator('.site-nav').getByRole('link', { name: 'Occasions' }).click()
    await page.waitForURL(/occasions/)
    await page.getByRole('link', { name: 'Kirabo Catering Services concept, home' }).click()
    await page.waitForURL(url => new URL(url).pathname === '/')
  }
  for (const width of [800, 1280, 900, 1300, 1280]) { await page.setViewportSize({ width, height: 860 }); await page.waitForTimeout(200) }
  await page.waitForTimeout(400)
  const after = await page.evaluate(() => window.__scrollTriggerCount?.())
  check('ScrollTrigger count stable after navigation and resizing', typeof initial === 'number' && initial > 0 && after === initial, `${initial} → ${after}`)

  // 12. Overflow and image sweep at the brief's widths
  const overflow = []
  const broken = []
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 860 })
    for (const path of ['/', '/menus', '/my-menu', '/occasions', '/occasions/introductions', '/gallery', '/about', '/quote', '/contact']) {
      await go(path)
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = 'eager'
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
      })
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      if (extra > 0) overflow.push(`${path}@${width}:${extra}`)
      const bad = await page.evaluate(() => [...document.images].filter(img => getComputedStyle(img).display !== 'none' && !img.naturalWidth).map(img => img.currentSrc || img.src))
      if (bad.length) broken.push(`${path}@${width}: ${bad.join(', ')}`)
    }
  }
  check('no horizontal overflow at 360–1440', overflow.length === 0, overflow.join(', '))
  check('no broken images', broken.length === 0, broken.join(' | '))

  // 13. Nothing leaves the browser; only the shortlist is stored
  const origin = new URL(BASE).origin
  const nonGet = requests.filter(request => request.method !== 'GET')
  const thirdParty = requests.filter(request => !request.url.startsWith(origin) && !request.url.startsWith('data:'))
  const personal = requests.filter(request => /test%20person|test person|sample guest|example\.com|7700|0700|mukono|nut allergy/i.test(decodeURIComponent(request.url)))
  check('no non-GET requests', nonGet.length === 0, nonGet.map(request => request.url).join(', '))
  check('no third-party requests', thirdParty.length === 0, [...new Set(thirdParty.map(request => new URL(request.url).host))].join(', '))
  check('no entered details in any request URL', personal.length === 0)
  const storage = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), all: JSON.stringify({ ...localStorage, ...sessionStorage }) }))
  // React Router keeps scroll positions (paths and numbers) in sessionStorage; the menu holds IDs only.
  check('browser storage holds only the dish-ID shortlist', storage.local.every(key => key === KEY) && storage.session.every(key => key === 'react-router-scroll-positions')
    && !/test person|sample|example\.com|7700|mukono|allergy|vegetarian guests/i.test(storage.all), [...storage.local, ...storage.session].join(', '))
  check('no failed requests (images, chunks)', failures.length === 0, failures.slice(0, 3).join(' | '))
  check('no console or page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
} catch (error) {
  check('journey ran to completion', false, error.message.split('\n')[0])
} finally {
  await browser.close()
}

const failed = results.filter(result => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
