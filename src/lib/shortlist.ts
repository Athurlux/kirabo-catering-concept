import { useSyncExternalStore } from 'react'
import { findItem, MENU, type MenuItem } from '../data/menu'

// "My menu": the one piece of state this site keeps between visits. It stores sample-menu
// item IDs and nothing else — never names, contact details, dietary notes or guest counts.
// It is a discussion shortlist, not an order: there are no quantities or prices.

export const STORAGE_KEY = 'kirabo-concept-menu'
const VERSION = 1

/**
 * Reads stored data defensively. Malformed JSON, another version, non-string entries,
 * IDs no longer on the menu and duplicates are dropped rather than breaking the page.
 */
export function parseShortlist(raw: string | null): string[] {
  if (!raw) return []
  try {
    const value = JSON.parse(raw) as { version?: unknown; items?: unknown }
    if (!value || value.version !== VERSION || !Array.isArray(value.items)) return []
    const ids: string[] = []
    for (const id of value.items) if (typeof id === 'string' && findItem(id) && !ids.includes(id)) ids.push(id)
    return ids
  } catch {
    return []
  }
}

export const serializeShortlist = (ids: string[]) => JSON.stringify({ version: VERSION, items: ids })

/** Adding an item that is already listed changes nothing; unknown IDs are ignored. */
export const addId = (ids: string[], id: string) => (findItem(id) && !ids.includes(id) ? [...ids, id] : ids)
export const removeId = (ids: string[], id: string) => ids.filter(existing => existing !== id)

// ---- Store -----------------------------------------------------------------------

const EMPTY: string[] = []
let current: string[] = EMPTY
let loaded = false
// The list as it was before the last "clear", kept in memory only so the clear can be
// undone from whichever control is on screen afterwards. Any later change drops it.
let cleared: string[] | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach(listener => listener())

function read() {
  if (!loaded) {
    loaded = true
    try { current = parseShortlist(localStorage.getItem(STORAGE_KEY)) } catch { current = EMPTY }
  }
  return current
}

function commit(next: string[], keepUndo = false) {
  if (!keepUndo) cleared = null
  current = next
  try {
    if (next.length) localStorage.setItem(STORAGE_KEY, serializeShortlist(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch { /* storage unavailable: keep the list for this visit */ }
  notify()
}

export const shortlist = {
  snapshot: () => read(),
  has: (id: string) => read().includes(id),
  /** Returns whether the item was newly added (false if it was already there or unknown). */
  add(id: string) {
    const before = read()
    const after = addId(before, id)
    if (after !== before) commit(after)
    return after !== before
  },
  remove: (id: string) => commit(removeId(read(), id)),
  toggle(id: string) {
    if (read().includes(id)) { shortlist.remove(id); return false }
    return shortlist.add(id)
  },
  /** Empties the list, remembering it (in memory) so the clear can be undone. */
  clear() {
    const previous = read()
    if (!previous.length) return
    commit(EMPTY, true)
    cleared = previous
    notify()
  },
  undoClear() {
    if (cleared) commit(cleared)
  },
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Keep other tabs in step: they write the same key.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    current = parseShortlist(event.newValue)
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}

export const useShortlist = () => useSyncExternalStore(subscribe, read, () => EMPTY)
export const useCanUndoClear = () => useSyncExternalStore(subscribe, () => cleared !== null, () => false)

/** Shortlisted items in the order they were added, skipping anything no longer on the menu. */
export const shortlistItems = (ids: string[]): MenuItem[] => ids.flatMap(id => MENU.filter(item => item.id === id))

// ---- Drawer ----------------------------------------------------------------------
// The drawer opens from the header and from the menu page, so its open state is a tiny shared
// store too. Focus return is handled by the drawer's focus trap.

let drawerOpen = false
const drawerListeners = new Set<() => void>()
const subscribeDrawer = (listener: () => void) => { drawerListeners.add(listener); return () => { drawerListeners.delete(listener) } }
const setDrawer = (open: boolean) => {
  if (drawerOpen === open) return
  drawerOpen = open
  drawerListeners.forEach(listener => listener())
}

export const drawer = { open: () => setDrawer(true), close: () => setDrawer(false) }

export const useDrawerOpen = () => useSyncExternalStore(subscribeDrawer, () => drawerOpen, () => false)
