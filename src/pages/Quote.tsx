import { Link, useSearchParams } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro } from '../components/Bits'
import { countLabel, MenuList } from '../components/MenuControls'
import { FormFlow } from '../forms/FormFlow'
import { OCCASION_OPTIONS, quoteFlow, type QuoteDraft } from '../forms/flows'
import { shortlist, shortlistItems, useShortlist } from '../lib/shortlist'

/**
 * The quote request. An occasion page can pass ?occasion= to preselect the event type; that
 * is the only value ever placed in the URL, never personal details. The menu step edits the
 * same shortlist as the menus and drawer; completing the request records the dish names but
 * leaves the shortlist alone, which clears only when the visitor clears it.
 */
export default function Quote() {
  const [params] = useSearchParams()
  const occasion = params.get('occasion')
  const prefill: Partial<QuoteDraft> = { occasion: OCCASION_OPTIONS.some(option => option.value === occasion) ? occasion : null }
  useDocumentTitle('Request a quote')

  return (
    <>
      <PageIntro title="Request a catering quote">
        <p>Four short steps: your event, your guests, your menu and contact details, then a final preview.</p>
        <p className="concept-note"><strong>Demo only — this request will not be sent.</strong> Your answers stay in this browser tab, aren’t saved and disappear on refresh. Only your menu shortlist is kept on this device.</p>
      </PageIntro>
      <div className="container section section--top-tight">
        <FormFlow
          flow={quoteFlow}
          referencePrefix="DEMO"
          prefill={prefill}
          restartLabel="Start a new request"
          stageLead={(_draft, stageId) => (stageId === 'menu' ? <MenuStep /> : null)}
          reviewLead={() => <ReviewMenu />}
          extra={() => ({ menu: shortlistItems(shortlist.snapshot()).map(item => item.name) })}
          doneLinks={[{ label: 'Continue browsing the menus', to: '/menus' }]}
        />
      </div>
    </>
  )
}

/** The shortlist, editable in place. An empty menu is allowed: the caterer can suggest one. */
function MenuStep() {
  const count = useShortlist().length
  return (
    <section className="menu-step" aria-labelledby="menu-step-title" data-menu-scope>
      <div className="menu-step__head">
        <h3 id="menu-step-title" tabIndex={-1} data-menu-fallback>Dishes to discuss <span>{countLabel(count)}</span></h3>
        <Link to="/menus" className="text-button">{count ? 'Add more dishes' : 'Browse the menus'}</Link>
      </div>
      {count
        ? <MenuList />
        : <p className="menu-step__empty">No dishes chosen yet. That’s fine: the menu can be suggested in conversation. Your answers here are kept if you visit the menus and come back.</p>}
      <p className="fine-print">A shortlist to discuss, not an order. Removing a dish here removes it from your menu everywhere.</p>
    </section>
  )
}

function ReviewMenu() {
  const items = shortlistItems(useShortlist())
  return (
    <section className="summary__section" aria-labelledby="review-menu">
      <div className="summary__head">
        <h3 id="review-menu">Dishes to discuss</h3>
        <Link to="?step=menu" className="text-button">Edit<span className="visually-hidden"> dishes</span></Link>
      </div>
      {items.length
        ? <ul className="menu-summary">{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
        : <p className="summary__empty">No dishes chosen. The menu would be suggested in conversation.</p>}
    </section>
  )
}
