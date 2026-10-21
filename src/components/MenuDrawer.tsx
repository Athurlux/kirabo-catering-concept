import { useCallback, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { drawer, useDrawerOpen, useShortlist } from '../lib/shortlist'
import { useFocusTrap, useScrollLock } from '../lib/useFocusTrap'
import { ClearMenu, countLabel, EmptyMenu, MenuList } from './MenuControls'
import { Icon } from './Icon'

/** Quick view of "My menu", the same list the /my-menu page shows. */
export function MenuDrawer() {
  const open = useDrawerOpen()
  const ids = useShortlist()
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const close = useCallback(() => drawer.close(), [])

  useFocusTrap(panelRef, open, close)
  useScrollLock(open)
  useEffect(() => close(), [pathname, close])

  if (!open) return null

  return (
    <div className="drawer-layer">
      <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
      <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" ref={panelRef} data-menu-scope>
        <div className="drawer__head">
          <h2 id="drawer-title" className="drawer__title" tabIndex={-1} data-menu-fallback>
            My menu <span>{countLabel(ids.length)}</span>
          </h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close my menu" data-autofocus>
            <Icon name="close" />
          </button>
        </div>
        {ids.length === 0 ? (
          <div className="drawer__empty">
            <EmptyMenu onNavigate={close} />
            <ClearMenu />
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <p className="drawer__note">A shortlist to discuss, not an order. There are no prices or quantities here.</p>
              <MenuList />
            </div>
            <div className="drawer__foot">
              <ClearMenu />
              <div className="drawer__actions">
                <Link to="/my-menu" className="button button--outline">View my menu</Link>
                <Link to="/quote" className="button button--primary">Continue to quote</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Header control showing the live count; it opens the drawer. */
export function MenuButton({ className = '' }: { className?: string }) {
  const count = useShortlist().length
  return (
    <button type="button" className={`menu-count-button ${className}`} onClick={drawer.open} aria-haspopup="dialog"
      aria-label={`My menu, ${countLabel(count)}`}>
      <Icon name="plate" size={20} />
      <span className="menu-count-button__label" aria-hidden="true">My menu</span>
      <span className="menu-count" data-menu-count aria-hidden="true">{count}</span>
    </button>
  )
}
