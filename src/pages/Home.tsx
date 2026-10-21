import { useRef } from 'react'
import { Link } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { Img, srcSet } from '../components/Img'
import { CONCEPT_CAPTION, Figure, QuoteBand } from '../components/Bits'
import { AddToMenu } from '../components/MenuControls'
import { CATEGORIES, MENU } from '../data/menu'
import { OCCASIONS } from '../data/occasions'
import { GALLERY } from '../data/gallery'
import manifest from '../data/image-manifest.json'

// A proposed way of working, shown as such: Kirabo's actual process is still to be confirmed.
const PROCESS = [
  { title: 'Choose dishes you like', text: 'Browse the sample menus and add anything that appeals to your menu. No prices, no commitment.' },
  { title: 'Share the event', text: 'The type of event, a rough date, the place and an estimated guest count. Undecided is fine.' },
  { title: 'Talk it through', text: 'Menu, quantities, service style and any dietary needs are discussed directly with the caterer.' },
  { title: 'Receive a quotation', text: 'A tailored quotation follows that conversation. Nothing is priced automatically.' },
]

const PREVIEW = ['chicken-luwombo', 'steamed-matooke', 'groundnut-sauce', 'beef-skewers', 'grilled-tilapia', 'katogo', 'passion-juice', 'african-tea']

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  useDocumentTitle(null)
  const preview = PREVIEW.flatMap(id => MENU.filter(item => item.id === id))
  const galleryPreview = GALLERY.filter(image => ['grill', 'introduction', 'drinks', 'vegetarian'].includes(image.name))

  return (
    <div ref={root}>
      {/* ---- Hero: art-directed food photographs, live headline over the dark side ---- */}
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero__media">
          <source media="(max-width: 767px)" srcSet={srcSet('hero-mobile')} sizes="100vw" width={manifest['hero-mobile'].width} height={manifest['hero-mobile'].height} />
          <img
            data-hero="photo"
            src="/images/hero-desktop-1280.webp" srcSet={srcSet('hero-desktop')} sizes="100vw"
            width={manifest['hero-desktop'].width} height={manifest['hero-desktop'].height}
            alt="A wooden table of luwombo in banana leaves, steamed matooke, rice, grilled chicken, greens and groundnut sauce"
            fetchPriority="high"
          />
        </picture>
        <div className="hero__shade" aria-hidden="true" />
        <div className="container hero__content">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__line"><span data-hero="line">Good food.</span></span>
            <span className="hero__line"><span data-hero="line">Generous hospitality.</span></span>
            <span className="hero__line"><span data-hero="line">Memorable occasions.</span></span>
          </h1>
          <p className="hero__lede" data-hero="lede">Catering for weddings, introductions, corporate gatherings and private celebrations. Choose the dishes you love, then ask for a quote.</p>
          <div className="hero__actions" data-hero="actions">
            <Link to="/menus" className="button button--light">Explore the menus</Link>
            <Link to="/quote" className="button button--primary">Request a catering quote</Link>
          </div>
        </div>
        <p className="hero__caption">{CONCEPT_CAPTION}</p>
      </section>

      {/* ---- Signature dish ---- */}
      <section className="section signature" aria-labelledby="signature-title">
        <div className="container signature__grid">
          <Figure name="luwombo" className="signature__figure" sizes="(min-width: 900px) 58vw, 100vw"
            alt="Chicken luwombo opened in its banana-leaf parcel on a wooden platter, with steamed matooke behind" />
          <div className="signature__text" data-anim="rise">
            <p className="signature__kicker">A dish to build a menu around</p>
            <h2 className="signature__title" id="signature-title">Luwombo, steamed in banana leaves</h2>
            <p>Chicken or beef, cooked slowly in its sauce and wrapped in banana leaves, then opened at the table. It is one of the dishes a celebration menu can be built around.</p>
            <p className="fine-print">An example from the sample menu, shown in an AI-generated image. It does not show how Kirabo prepares or presents the dish.</p>
            <div className="button-row">
              <Link to="/menus?category=traditional" className="button button--green">See traditional favourites</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Menu preview: the printed-menu treatment, with live "Add to my menu" toggles ---- */}
      <section className="section section--paper menu-preview" aria-labelledby="menu-preview-title">
        <div className="container">
          <div className="section-head section-head--row">
            <div data-anim="rise">
              <h2 className="section-title" id="menu-preview-title">From the sample menus</h2>
              <p>Add the dishes you like to your menu. It becomes the starting point of a quote request: a shortlist to discuss, not an order.</p>
            </div>
            <Link to="/menus" className="text-link" data-anim="rise">All {MENU.length} dishes in {CATEGORIES.length} menus</Link>
          </div>
          <ul className="bill bill--two">
            {preview.map(item => (
              <li key={item.id} className="bill__item" data-anim="rise">
                <div className="bill__text">
                  <h3 className="bill__name">{item.name}</h3>
                  <p className="bill__desc">{item.description}</p>
                </div>
                <AddToMenu item={item} />
              </li>
            ))}
          </ul>
          <p className="concept-note">An illustrative menu written for this concept, not Kirabo’s verified menu. There are no prices, and dietary needs are always confirmed directly.</p>
        </div>
      </section>

      {/* ---- Occasions ---- */}
      <section className="section occasions-home" aria-labelledby="occasions-title">
        <div className="container">
          <div className="section-head" data-anim="rise">
            <h2 className="section-title" id="occasions-title">For the occasions that matter</h2>
            <p>Four proposed occasion pages, each with planning notes and a quote request that starts with the right event type.</p>
          </div>
          <ul className="occasion-grid">
            {OCCASIONS.map(occasion => (
              <li key={occasion.slug}>
                <Link to={`/occasions/${occasion.slug}`} className="occasion-tile">
                  <div className="occasion-tile__media" data-anim="scene">
                    <Img name={occasion.image} alt="" sizes="(min-width: 900px) 45vw, 100vw" />
                  </div>
                  <h3 className="occasion-tile__name">{occasion.name}</h3>
                  <p className="occasion-tile__line">{occasion.line}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="fine-print">Images are AI-generated illustrations, not Kirabo’s events.</p>
        </div>
      </section>

      {/* ---- Proposed process ---- */}
      <section className="section section--green process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head section-head--light" data-anim="rise">
            <h2 className="section-title" id="process-title">From first idea to a quotation</h2>
            <p>A proposed way for the website to work alongside Kirabo’s team. The steps would be confirmed with Kirabo.</p>
          </div>
          <ol className="process__list">
            {PROCESS.map((step, index) => (
              <li key={step.title} className="process__step" data-anim="rise">
                <span className="process__num" aria-hidden="true">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link to="/quote" className="button button--light" data-anim="rise">Request a catering quote</Link>
        </div>
      </section>

      {/* ---- Gallery preview ---- */}
      <section className="section gallery-preview" aria-labelledby="gallery-preview-title">
        <div className="container">
          <div className="section-head section-head--row">
            <div data-anim="rise">
              <h2 className="section-title" id="gallery-preview-title">A feast for the eyes first</h2>
              <p>Food and table ideas for the gallery. Every image is an AI-generated illustration.</p>
            </div>
            <Link to="/gallery" className="text-link" data-anim="rise">Open the gallery</Link>
          </div>
          <div className="mosaic">
            {galleryPreview.map(image => (
              <Link key={image.name} to={`/gallery#g-${image.name}`} className="mosaic__item" aria-label={`${image.caption}, view in the gallery`}>
                <div className="mosaic__frame" data-anim="scene">
                  <Img name={image.name} alt="" sizes="(min-width: 900px) 30vw, 50vw" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand />
    </div>
  )
}
