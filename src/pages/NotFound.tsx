import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { OCCASIONS } from '../data/occasions'

export default function NotFound({ what = 'page' }: { what?: 'page' | 'occasion' }) {
  useDocumentTitle(what === 'occasion' ? 'Occasion not found' : 'Page not found')
  return (
    <section className="container section not-found" aria-labelledby="nf-title">
      <h1 id="nf-title" className="not-found__title">{what === 'occasion' ? 'We couldn’t find that occasion.' : 'This page isn’t on the menu.'}</h1>
      <p>The link may be mistyped, or the page may have moved. These might help:</p>
      <ul className="not-found__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menus">Sample menus</Link></li>
        {OCCASIONS.map(occasion => <li key={occasion.slug}><Link to={`/occasions/${occasion.slug}`}>{occasion.name}</Link></li>)}
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/quote">Request a quote</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </section>
  )
}
