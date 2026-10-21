import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro, QuoteBand } from '../components/Bits'
import { business, CHECKED, unconfirmed } from '../data/business'

// No company biography, founding date, team or owner photograph is shown: none could be
// verified, and the brief rules out inventing them. The page explains the proposal instead.

const FEATURES = [
  { title: 'Menus people can browse', body: 'Sample menus grouped the way guests think about food, with search and filters that survive Back and refresh.' },
  { title: 'A shortlist instead of a cart', body: '“Add to my menu” collects dishes to talk about. No prices, no quantities and no checkout, because catering is agreed in conversation.' },
  { title: 'A quote request that asks the right questions', body: 'Event type, date or “undecided”, location, venue, guest estimate, service style and dietary notes, in four short steps.' },
  { title: 'Pages for each kind of occasion', body: 'Weddings, introductions, corporate gatherings and private celebrations, each leading straight into a quote request.' },
]

export default function About() {
  useDocumentTitle('About')
  return (
    <>
      <PageIntro title="About Kirabo Catering Services">
        <p>Kirabo Catering Services caters for events and has a public Facebook page. This concept shows how a dedicated website could present its food and make it easier to ask for a quote.</p>
      </PageIntro>

      <section className="section section--top-tight" aria-labelledby="known-title">
        <div className="container about-grid">
          <h2 className="about-grid__title" id="known-title">What this concept says about Kirabo</h2>
          <div className="about-grid__body">
            <p>Very little, on purpose. When this concept was prepared ({CHECKED}), Kirabo’s Facebook page could not be read from the network it was built on, and no other public listing was found. Rather than guess, this site leaves out details that could not be confirmed:</p>
            <ul className="plain-list">{unconfirmed.map(item => <li key={item}>{item}</li>)}</ul>
            <p>There is no company history, team biography, owner photograph, review, client name, price or certification on this site. Those would come from Kirabo.</p>
            <p><a href={business.facebook} rel="noopener noreferrer" target="_blank">Kirabo Catering Services on Facebook<span className="visually-hidden"> (opens in a new tab)</span></a></p>
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="features-title">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title" id="features-title">What the proposed website does</h2>
            <p>Built around one job: turning a visitor’s appetite into a well-formed catering enquiry.</p>
          </div>
          <ul className="feature-list">
            {FEATURES.map(feature => (
              <li key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="concept" id="concept" tabIndex={-1}>
        <div className="container about-grid">
          <h2 className="about-grid__title">About this concept</h2>
          <div className="about-grid__body">
            <p>This is an independent website proposal by Arthur Kitandwe. It is not Kirabo Catering Services’ official website and is not authorised by or affiliated with them. The wordmark and leaf-and-plate symbol are proposals, not their identity.</p>
            <p>All twelve photographs supplied for the proposal are AI-generated illustrations; eleven are used here. They do not show Kirabo’s dishes, staff, premises or events. The menus are illustrative suggestions, not a verified menu.</p>
            <p>The quote and contact forms are demonstrations. Nothing you type is sent anywhere or saved. The only thing kept on your device is your menu shortlist, as a list of dish codes, so it is still there when you return.</p>
            <div className="button-row">
              <Link to="/menus" className="button button--green">Explore the menus</Link>
              <Link to="/quote" className="button button--outline">Try the quote request</Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  )
}
