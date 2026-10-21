import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { CONCEPT_CAPTION, PageIntro, QuoteBand } from '../components/Bits'
import { Img } from '../components/Img'
import { Icon } from '../components/Icon'
import { Lightbox } from '../components/Lightbox'
import { filterGallery, GALLERY_FILTERS, isGalleryFilter } from '../data/gallery'

/** Filterable grid of concept images; the filter lives in the URL (?filter=). */
export default function Gallery() {
  const [params] = useSearchParams()
  const raw = params.get('filter')
  const filter = isGalleryFilter(raw) ? raw : null
  const images = filterGallery(filter)
  const [open, setOpen] = useState<number | null>(null)
  useDocumentTitle('Gallery')

  return (
    <>
      <PageIntro title="Gallery">
        <p>Food and table ideas for the proposed site. Open any image for a closer look.</p>
        <p className="concept-note"><strong>Every image here is an AI-generated illustration.</strong> None shows Kirabo’s food, staff, venues or events, or how Kirabo prepares a dish.</p>
      </PageIntro>
      <div className="container section section--top-tight">
        <nav className="filters" aria-label="Gallery filters">
          <Link to="/gallery" className="filter" aria-current={!filter}>All</Link>
          {GALLERY_FILTERS.map(item => (
            <Link key={item.id} to={`/gallery?filter=${item.id}`} className="filter" aria-current={filter === item.id}>{item.label}</Link>
          ))}
        </nav>
        <p className="result-status gallery__status" role="status">
          {images.length} {images.length === 1 ? 'image' : 'images'}{filter ? ` in ${GALLERY_FILTERS.find(item => item.id === filter)!.label.toLowerCase()}` : ''}
          {raw && !filter ? '. That filter doesn’t exist, so every image is shown.' : '.'}
        </p>
        <ul className="gallery-grid">
          {images.map((image, index) => (
            <li key={image.name} className="gallery-grid__item">
              <button type="button" id={`g-${image.name}`} className="gallery-tile" onClick={() => setOpen(index)}>
                <Img name={image.name} alt="" sizes="(min-width: 1100px) 33vw, (min-width: 600px) 50vw, 100vw" />
                <span className="gallery-tile__zoom" aria-hidden="true"><Icon name="expand" size={18} /></span>
                <span className="visually-hidden">Open larger image: </span>
                <span className="gallery-tile__caption">{image.caption}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="fine-print">{CONCEPT_CAPTION}</p>
      </div>
      {open !== null && images[open] && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      <QuoteBand />
    </>
  )
}
