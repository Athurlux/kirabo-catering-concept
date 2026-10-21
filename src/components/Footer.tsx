import { Link } from 'react-router'
import { business } from '../data/business'
import { Wordmark } from './Brand'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Wordmark className="wordmark--light" />
            <p>A proposed website for Kirabo Catering Services: browse sample menus, build a shortlist of dishes and request a catering quote.</p>
          </div>

          <div className="site-footer__col">
            <h2>Explore</h2>
            <ul>
              <li><Link to="/menus">Menus</Link></li>
              <li><Link to="/occasions">Occasions</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/my-menu">My menu</Link></li>
              <li><Link to="/quote">Request a quote</Link></li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h2>Kirabo Catering Services</h2>
            <ul>
              <li><a href={business.facebook} rel="noopener noreferrer" target="_blank">Facebook page<span className="visually-hidden"> (opens in a new tab)</span></a></li>
              <li><Link to="/contact">Contact options</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
            <p className="site-footer__note">The Facebook link reaches the real business, not this demo. Phone numbers and hours will be added once confirmed.</p>
          </div>
        </div>

        <div className="site-footer__disclosure" id="disclosure">
          <p><strong>Independent website concept.</strong> This is a proposal by Arthur Kitandwe, not Kirabo Catering Services’ official website, and it is not authorised by or affiliated with them. The wordmark is a proposal, not their identity.</p>
          <p>Every photograph is an AI-generated illustration, not Kirabo’s food, staff, premises or events. The menus are illustrative suggestions, not a verified Kirabo menu, and carry no prices. The quote and contact forms are demonstrations: nothing you enter is sent, and only your menu shortlist is kept on this device.</p>
          <p className="site-footer__credit">Concept design and build: Arthur Kitandwe, 2026.</p>
        </div>
      </div>
    </footer>
  )
}
