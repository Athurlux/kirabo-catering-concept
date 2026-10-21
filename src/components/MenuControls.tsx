import { Link } from 'react-router'
import { findCategory, type MenuItem } from '../data/menu'
import { shortlist, shortlistItems, useCanUndoClear, useShortlist } from '../lib/shortlist'
import { celebrateAdd } from '../animation/menuMotion'
import { announce } from './Announcer'
import { Icon } from './Icon'

/** A toggle: pressed means the dish is on "My menu". Adding twice can never duplicate it. */
export function AddToMenu({ item }: { item: MenuItem }) {
  const chosen = useShortlist().includes(item.id)
  return (
    <button
      type="button"
      className={`menu-toggle ${chosen ? 'is-chosen' : ''}`}
      aria-pressed={chosen}
      aria-label={`Add ${item.name} to my menu`}
      onClick={event => {
        const added = shortlist.toggle(item.id)
        if (added) { celebrateAdd(event.currentTarget); announce(`${item.name} added to your menu`) }
        else announce(`${item.name} removed from your menu`)
      }}
    >
      <Icon name={chosen ? 'check' : 'plus'} size={18} />
      <span aria-hidden="true">{chosen ? 'On my menu' : 'Add to my menu'}</span>
    </button>
  )
}

/** The shortlist as a list: used by the drawer, the My menu page and the quote's menu step. */
export function MenuList() {
  const items = shortlistItems(useShortlist())
  return (
    <ul className="menu-list">
      {items.map(item => (
        <li key={item.id} className="menu-list__row">
          <div>
            <p className="menu-list__name">{item.name}</p>
            <p className="menu-list__meta">{findCategory(item.category).label}</p>
          </div>
          <button type="button" className="icon-button" aria-label={`Remove ${item.name}`}
            onClick={event => {
              // Keep keyboard focus nearby: the next row, else the previous, else the list's heading.
              const row = event.currentTarget.closest('li')
              const neighbour = (row?.nextElementSibling ?? row?.previousElementSibling)?.querySelector('button')
              const fallback = event.currentTarget.closest('[data-menu-scope]')?.querySelector<HTMLElement>('[data-menu-fallback]')
              shortlist.remove(item.id)
              announce(`${item.name} removed from your menu`)
              requestAnimationFrame(() => (neighbour ?? fallback)?.focus())
            }}>
            <Icon name="close" size={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Clearing is reversible: Undo stays available until the list changes again. */
export function ClearMenu() {
  const canUndo = useCanUndoClear()
  const count = useShortlist().length
  if (canUndo) {
    return (
      <p className="clear-undo" role="status">
        Menu cleared.{' '}
        <button type="button" className="text-button" onClick={() => { shortlist.undoClear(); announce('Your menu was restored') }}>Undo</button>
      </p>
    )
  }
  if (!count) return null
  return <button type="button" className="text-button text-button--quiet" onClick={() => { shortlist.clear(); announce('Menu cleared. Undo is available.') }}>Clear my menu</button>
}

export function EmptyMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">No dishes on your menu yet.</p>
      <p>Browse the sample menus and add the dishes you’d like to talk about. Your choices stay on this device.</p>
      <Link to="/menus" className="button button--primary" onClick={onNavigate}>Explore the menus</Link>
    </div>
  )
}

export const countLabel = (count: number) => `${count} ${count === 1 ? 'dish' : 'dishes'}`
