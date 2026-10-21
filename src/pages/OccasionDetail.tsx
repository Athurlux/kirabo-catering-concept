import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Figure, PageIntro, QuoteBand } from '../components/Bits'
import { findOccasion, nextOccasion } from '../data/occasions'
import NotFound from './NotFound'

export default function OccasionDetail() {
  const { slug } = useParams()
  const occasion = findOccasion(slug)
  if (!occasion) return <NotFound what="occasion" />
  return <Occasion key={occasion.slug} slug={occasion.slug} />
}

function Occasion({ slug }: { slug: string }) {
  const occasion = findOccasion(slug)!
  const next = nextOccasion(slug)
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle(`${occasion.name} catering`, `${occasion.name}: planning notes and a demo quote request in an independent website concept for Kirabo Catering Services. Images are AI-generated illustrations.`)
  const quote = `/quote?occasion=${occasion.quoteValue}`

  return (
    <div ref={root}>
      <PageIntro title={<>{occasion.name}<span className="concept-label concept-label--large">Concept</span></>}
        crumbs={[{ to: '/', label: 'Home' }, { to: '/occasions', label: 'Occasions' }]}>
        <p>{occasion.intro}</p>
        <div className="button-row">
          <Link to={quote} className="button button--primary">Request a quote for {occasion.name.toLowerCase()}</Link>
          <Link to="/menus" className="button button--outline">Explore the menus</Link>
        </div>
      </PageIntro>

      <div className="container occasion">
        <Figure name={occasion.image} alt={occasion.imageAlt} sizes="(min-width: 1240px) 1240px, 100vw" priority className="occasion__hero" />

        <div className="occasion__body">
          <section aria-labelledby="planning-title">
            <h2 className="occasion__heading" id="planning-title">Planning notes</h2>
            <p className="occasion__note">General advice for catering this kind of event, not a record of past work.</p>
            <ol className="planning">
              {occasion.planning.map(item => (
                <li key={item.title} className="planning__item" data-anim="rise">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <aside className="occasion__aside" aria-labelledby="styles-title">
            <h2 className="occasion__heading" id="styles-title">Service styles to consider</h2>
            <ul className="plain-list">{occasion.styles.map(style => <li key={style}>{style}</li>)}</ul>
            <p className="fine-print">Suggestions only. What Kirabo offers for each event would be confirmed directly.</p>
            <Link to={quote} className="button button--primary">Start a quote request</Link>
            <p className="fine-print">The request starts with “{occasion.name}” already chosen. It is a demo, and nothing is sent.</p>
          </aside>
        </div>
      </div>

      <nav className="container next-occasion" aria-label="Next occasion">
        <Link to={`/occasions/${next.slug}`} className="next-occasion__link">
          <span className="next-occasion__label">Next occasion</span>
          <span className="next-occasion__title">{next.name}</span>
        </Link>
      </nav>

      <QuoteBand title="Ready to plan the food?" to={quote} label={`Request a quote for ${occasion.name.toLowerCase()}`} />
    </div>
  )
}
