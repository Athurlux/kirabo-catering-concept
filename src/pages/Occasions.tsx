import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { CONCEPT_CAPTION, PageIntro, QuoteBand } from '../components/Bits'
import { Img } from '../components/Img'
import { OCCASIONS } from '../data/occasions'

export default function Occasions() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle('Occasions')
  return (
    <div ref={root}>
      <PageIntro title="Occasions">
        <p>Four kinds of event, each with planning notes and a quote request that starts with the right event type.</p>
        <p className="concept-note"><strong>Proposed categories, pending confirmation.</strong> These pages suggest how Kirabo’s catering could be presented. They do not describe past clients or events, and the images are AI-generated illustrations.</p>
      </PageIntro>
      <div className="container occasion-list">
        {OCCASIONS.map(occasion => (
          <article key={occasion.slug} className="occasion-row">
            <Link to={`/occasions/${occasion.slug}`} className="occasion-row__media" tabIndex={-1} aria-hidden="true">
              <div className="occasion-row__frame" data-anim="scene">
                <Img name={occasion.image} alt="" sizes="(min-width: 900px) 55vw, 100vw" />
              </div>
            </Link>
            <div className="occasion-row__text">
              <h2 className="occasion-row__title"><Link to={`/occasions/${occasion.slug}`}>{occasion.name}</Link><span className="concept-label">Concept</span></h2>
              <p className="occasion-row__line">{occasion.line}</p>
              <p className="fine-print">{CONCEPT_CAPTION}</p>
              <div className="button-row">
                <Link to={`/occasions/${occasion.slug}`} className="button button--outline">Planning notes<span className="visually-hidden"> for {occasion.name.toLowerCase()}</span></Link>
                <Link to={`/quote?occasion=${occasion.quoteValue}`} className="button button--primary">Request a quote<span className="visually-hidden"> for {occasion.name.toLowerCase()}</span></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <QuoteBand />
    </div>
  )
}
