import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro } from '../components/Bits'
import { FormFlow } from '../forms/FormFlow'
import { contactFlow } from '../forms/flows'
import { business, CHECKED } from '../data/business'

export default function Contact() {
  useDocumentTitle('Contact')

  return (
    <>
      <PageIntro title="Contact">
        <p>Planning an event? The <Link to="/quote">quote request</Link> asks the useful questions up front. For anything else, a short message is enough.</p>
      </PageIntro>

      <div className="container section section--top-tight contact">
        <section className="real-contact" aria-labelledby="real-contact-title">
          <h2 id="real-contact-title" className="real-contact__title">Reach Kirabo directly</h2>
          <p className="real-contact__note">This link goes to Kirabo Catering Services’ own Facebook page, separately from this demo.</p>
          <a className="button button--light" href={business.facebook} target="_blank" rel="noopener noreferrer">
            Kirabo Catering Services on Facebook<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <p className="fine-print">Phone and WhatsApp numbers, opening hours and service areas are not listed because they could not be confirmed when this concept was checked ({CHECKED}). There is no map or address for the same reason.</p>
        </section>

        <section className="contact__form" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="contact__form-title">Send a message <span className="concept-label">Demo</span></h2>
          <p className="concept-note"><strong>Demo only — this message will not be sent.</strong> This form never connects to email, WhatsApp or any other service.</p>
          <FormFlow flow={contactFlow} referencePrefix="DEMO" restartLabel="Write another message" />
        </section>
      </div>
    </>
  )
}
