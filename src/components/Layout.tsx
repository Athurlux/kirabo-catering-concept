import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { Announcer } from './Announcer'
import { MenuDrawer } from './MenuDrawer'
import { useRouteFocus } from '../lib/useRouteFocus'

// Pages whose filters or steps change only the search string keep one scroll entry per path,
// so filtering or moving between steps never jumps the page back to a stale position.
const SEARCH_ONLY = new Set(['/menus', '/gallery', '/quote', '/contact'])

export function Layout() {
  useRouteFocus()
  const { pathname } = useLocation()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header overlay={pathname === '/'} />
      {/* Keyed by path so each page gets a short, calm fade in (none with reduced motion). */}
      <main id="main" tabIndex={-1} key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <MenuDrawer />
      <Announcer />
      {/* First-loaded pages share the key "default", so they are keyed by path too. */}
      <ScrollRestoration getKey={loc => (loc.key === 'default' || SEARCH_ONLY.has(loc.pathname) ? loc.pathname : loc.key)} />
    </>
  )
}
