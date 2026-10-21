import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Img, type ImageName } from './Img'

export const CONCEPT_CAPTION = 'Illustrative AI-generated image, not Kirabo’s food or event.'

/**
 * Every photograph is AI-generated, so every figure carries a visible caption saying so.
 * `reveal` opts the frame into the scroll reveal (see useSiteMotion).
 */
export function Figure({ name, alt, sizes, caption = CONCEPT_CAPTION, priority, reveal = true, className = '' }: {
  name: ImageName; alt: string; sizes: string; caption?: string; priority?: boolean; reveal?: boolean; className?: string
}) {
  return (
    <figure className={`figure ${className}`}>
      <div className="figure__frame" data-anim={reveal ? 'scene' : undefined}>
        <Img name={name} alt={alt} sizes={sizes} priority={priority} />
      </div>
      <figcaption className="figure__caption">{caption}</figcaption>
    </figure>
  )
}

export function PageIntro({ title, children, crumbs }: { title: ReactNode; children?: ReactNode; crumbs?: { to: string; label: string }[] }) {
  return (
    <header className="page-intro">
      <div className="container">
        {crumbs && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {crumbs.map(crumb => <li key={crumb.to}><Link to={crumb.to}>{crumb.label}</Link></li>)}
            </ol>
          </nav>
        )}
        <h1 className="page-intro__title">{title}</h1>
        {children && <div className="page-intro__lede">{children}</div>}
      </div>
    </header>
  )
}

/** Closing invitation used at the foot of most pages. */
export function QuoteBand({ title = 'Planning an event? Start with the food.', to = '/quote', label = 'Request a catering quote', children }: {
  title?: string; to?: string; label?: string; children?: ReactNode
}) {
  return (
    <section className="quote-band" aria-labelledby="quote-band-title">
      <div className="container quote-band__inner">
        <h2 id="quote-band-title" className="quote-band__title" data-anim="rise">{title}</h2>
        <div className="quote-band__body" data-anim="rise">
          {children ?? <p>Four short steps: your event, your guests, the dishes you like and how to reach you. In this concept it is a demo, and nothing is sent.</p>}
          <div className="button-row">
            <Link to={to} className="button button--light">{label}</Link>
            <Link to="/menus" className="button button--on-dark">Explore the menus</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
