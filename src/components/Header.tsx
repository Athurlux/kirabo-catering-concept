import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useFocusTrap, useScrollLock } from '../lib/useFocusTrap'
import { Icon } from './Icon'
import { Wordmark } from './Brand'
import { MenuButton } from './MenuDrawer'

export const NAV = [
  { to: '/menus', label: 'Menus' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/**
 * Over the home hero the bar is transparent with light text, and turns solid once the
 * page scrolls or the menu opens. Every other page gets the solid bar from the start.
 */
export function Header({ overlay }: { overlay: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useFocusTrap(barRef, menuOpen, closeMenu)
  useScrollLock(menuOpen)
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const transparent = overlay && !scrolled && !menuOpen

  return (
    <header className={`site-header ${transparent ? 'is-transparent' : ''} ${overlay ? 'is-overlay' : ''} ${menuOpen ? 'is-menu' : ''}`}>
      <div ref={barRef}>
        <div className="container site-header__inner">
          <Link to="/" className="site-header__logo" aria-label="Kirabo Catering Services concept, home">
            <Wordmark />
          </Link>

          <nav className="site-nav" aria-label="Main">
            <ul>
              {NAV.map(link => <li key={link.to}><NavLink to={link.to}>{link.label}</NavLink></li>)}
            </ul>
          </nav>

          <div className="site-header__actions">
            {!menuOpen && <MenuButton />}
            <Link to="/quote" className="button button--header">Request a quote</Link>
            <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(open => !open)}>
              <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__primary">
              <li><NavLink to="/" end data-autofocus="">Home</NavLink></li>
              {NAV.map(link => <li key={link.to}><NavLink to={link.to}>{link.label}</NavLink></li>)}
            </ul>
            <div className="mobile-menu__actions">
              <Link to="/quote" className="button button--primary">Request a catering quote</Link>
              <Link to="/my-menu" className="button button--outline">View my menu</Link>
            </div>
            <p className="mobile-menu__note"><Link to="/about#concept">About this concept</Link></p>
          </nav>
        </div>
      </div>
    </header>
  )
}
