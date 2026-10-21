import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { CONCEPT_CAPTION, PageIntro, QuoteBand } from '../components/Bits'
import { Img } from '../components/Img'
import { Icon } from '../components/Icon'
import { AddToMenu, countLabel } from '../components/MenuControls'
import { CATEGORIES, filterMenu, isCategory, MAX_QUERY } from '../data/menu'
import { drawer, useShortlist } from '../lib/shortlist'

/**
 * The sample menus. Category and search live in the URL (?category=&q=), so Back, refresh and
 * shared links keep them. Typing replaces the history entry rather than adding one per key.
 */
export default function Menus() {
  const root = useRef<HTMLDivElement>(null)
  const [params, setParams] = useSearchParams()
  const rawCategory = params.get('category')
  const category = isCategory(rawCategory) ? rawCategory : null
  const query = (params.get('q') ?? '').slice(0, MAX_QUERY)
  const results = filterMenu(category, query)
  const groups = CATEGORIES.filter(item => !category || item.id === category)
    .map(item => ({ category: item, items: results.filter(result => result.category === item.id) }))
    .filter(group => group.items.length)
  const chosen = useShortlist().length
  useSiteMotion(root)
  useDocumentTitle('Menus')

  const hrefFor = (next: string | null) => {
    const search = new URLSearchParams()
    if (next) search.set('category', next)
    if (query) search.set('q', query)
    const text = search.toString()
    return text ? `/menus?${text}` : '/menus'
  }
  const setQuery = (value: string) => setParams(current => {
    const next = new URLSearchParams(current)
    if (value) next.set('q', value.slice(0, MAX_QUERY))
    else next.delete('q')
    return next
  }, { replace: true })
  const filtered = Boolean(category || query)

  return (
    <div ref={root}>
      <PageIntro title="Sample menus">
        <p>Four illustrative menus to start the conversation. Add the dishes you like to your menu, then continue to a quote request.</p>
        <p className="concept-note"><strong>A shortlist to discuss, not an order.</strong> These are example dishes written for this concept, not Kirabo’s verified menu. There are no prices or stock levels, and dietary needs are always confirmed directly with the caterer.</p>
      </PageIntro>

      <div className="container menu-tools">
        <div className="menu-tools__search">
          <label htmlFor="menu-search" className="field__label">Search the menus</label>
          <div className="search">
            <Icon name="search" size={18} className="search__icon" />
            <input id="menu-search" type="search" className="input search__input" value={query} maxLength={MAX_QUERY}
              placeholder="For example, luwombo or juice" autoComplete="off" onChange={event => setQuery(event.target.value)} />
          </div>
        </div>
        <nav className="filters" aria-label="Menu categories">
          <Link to={hrefFor(null)} className="filter" aria-current={!category}>All menus</Link>
          {CATEGORIES.map(item => (
            <Link key={item.id} to={hrefFor(item.id)} className="filter" aria-current={category === item.id}>{item.label}</Link>
          ))}
        </nav>
        <div className="menu-tools__status">
          <p className="result-status" role="status">
            {results.length ? `Showing ${countLabel(results.length)}` : 'No dishes match'}
            {category ? ` in ${CATEGORIES.find(item => item.id === category)!.label}` : ''}
            {query ? ` for “${query}”` : ''}.
          </p>
          {filtered && <Link to="/menus" className="text-button">Reset filters</Link>}
          {rawCategory && !category && <p className="result-status">That category isn’t on the menu, so every menu is shown.</p>}
        </div>
      </div>

      <div className="container menus">
        {groups.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__title">No dishes match “{query}”.</p>
            <p>Try a shorter word, such as “chicken” or “juice”, or look through every menu.</p>
            <Link to="/menus" className="button button--primary">Show all dishes</Link>
          </div>
        )}
        {groups.map(({ category: item, items }) => (
          <section key={item.id} className="menu-section" aria-labelledby={`menu-${item.id}`}>
            <figure className="menu-section__figure">
              <div className="menu-section__frame" data-anim="scene">
                <Img name={item.image} alt={item.imageAlt} sizes="(min-width: 900px) 34vw, 100vw" />
              </div>
              <figcaption className="figure__caption">A spread for this menu, not a photograph of each dish. {CONCEPT_CAPTION}</figcaption>
            </figure>
            <div className="menu-section__body">
              <h2 className="menu-section__title" id={`menu-${item.id}`}>{item.label}<span className="concept-label">Sample</span></h2>
              <p className="menu-section__intro">{item.intro}</p>
              <ul className="bill">
                {items.map(dish => (
                  <li key={dish.id} className="bill__item">
                    <div className="bill__text">
                      <h3 className="bill__name">{dish.name}</h3>
                      <p className="bill__desc">{dish.description}</p>
                    </div>
                    <AddToMenu item={dish} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* A persistent prompt once something is chosen, so the next step is never hidden. */}
      {chosen > 0 && (
        <div className="menu-dock" role="region" aria-label="My menu">
          <p><strong>{countLabel(chosen)}</strong> on your menu</p>
          <button type="button" className="button button--outline button--small" onClick={drawer.open}>View my menu</button>
          <Link to="/quote" className="button button--primary button--small">Continue to quote</Link>
        </div>
      )}

      <QuoteBand title="Found a few favourites?" />
    </div>
  )
}
