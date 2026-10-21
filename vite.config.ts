import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { OCCASIONS } from './src/data/occasions'

/**
 * Cloudflare static-asset routing. Instead of a catch-all SPA fallback (which answers 200 for any
 * URL), only the app's real routes are rewritten to the app shell. Anything else falls through
 * to 404.html: a copy of the app that renders the not-found page, served with status 404.
 * Occasion slugs come from the data file, so a new occasion cannot be forgotten here.
 */
const ROUTES = ['/menus', '/my-menu', '/occasions', '/gallery', '/about', '/quote', '/contact', ...OCCASIONS.map(occasion => `/occasions/${occasion.slug}`)]

function pagesRouting(): Plugin {
  return {
    name: 'pages-routing',
    apply: 'build',
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist', import.meta.url))
      const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
      writeFileSync(resolve(dist, '404.html'), html)
      // The target is "/", not "/index.html": Cloudflare normalises /index.html with a redirect to "/",
      // which would send every deep link to the home page.
      writeFileSync(resolve(dist, '_redirects'), ROUTES.map(route => `${route}  /  200`).join('\n') + '\n')
    },
  }
}

/**
 * Preloads the two Latin font files every page uses. Without it they are discovered only after
 * the page chunk renders, and the first paint of the headline waits for them.
 */
function preloadFonts(): Plugin {
  const wanted = [/fraunces-latin-wght-normal-.*\.woff2$/, /manrope-latin-wght-normal-.*\.woff2$/]
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter(file => wanted.some(pattern => pattern.test(file)))
        return files.map(file => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: '/' + file, crossorigin: '' }, injectTo: 'head' as const }))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), pagesRouting(), preloadFonts()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
