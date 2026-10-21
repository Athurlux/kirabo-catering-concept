import { eitherContact, type FlowSpec } from './engine'
import { addDays, futureDateError } from '../lib/validation'

// Both journeys are demonstrations: drafts live in React memory, nothing is stored or sent.
// Neither form works out a price, and nothing a visitor ticks here establishes how food is
// prepared: dietary and allergy needs are notes for a direct conversation with the caterer.

const MAX_DAYS_AHEAD = 365 * 2
export const MAX_GUESTS = 5000

export type QuoteDraft = {
  occasion: string | null
  occasionOther: string | null
  dateMode: string | null
  date: string | null
  timing: string | null
  location: string | null
  locationOther: string | null
  venueStatus: string | null
  venue: string | null
  guests: string | null
  serviceStyle: string | null
  budget: string | null
  budgetNote: string | null
  dietary: string | null
  name: string | null
  email: string | null
  phone: string | null
}

export const OCCASION_OPTIONS = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'introduction', label: 'Introduction' },
  { value: 'corporate', label: 'Corporate gathering' },
  { value: 'private', label: 'Private celebration' },
  { value: 'other', label: 'Something else' },
]

export const quoteFlow: FlowSpec<QuoteDraft> = {
  key: 'quote',
  empty: () => ({
    occasion: null, occasionOther: null, dateMode: null, date: null, timing: null, location: null, locationOther: null,
    venueStatus: null, venue: null, guests: null, serviceStyle: null, budget: null, budgetNote: null, dietary: null,
    name: null, email: null, phone: null,
  }),
  stages: [
    {
      id: 'event',
      title: 'Your event',
      intro: 'What you are planning, when and where. Undecided is a perfectly good answer for now.',
      fields: [
        { name: 'occasion', label: 'Type of event', kind: 'radio', options: OCCASION_OPTIONS, requiredMessage: 'Choose the type of event.' },
        { name: 'occasionOther', label: 'What is the event?', kind: 'text', when: draft => draft.occasion === 'other', placeholder: 'For example, a graduation party', minLength: 3, maxLength: 80 },
        {
          name: 'dateMode', label: 'Event date', kind: 'radio', requiredMessage: 'Choose how settled the date is.',
          options: [
            { value: 'exact', label: 'We have a date' },
            { value: 'flexible', label: 'Roughly, not fixed' },
            { value: 'undecided', label: 'Not decided yet' },
          ],
        },
        {
          name: 'date', label: 'Date', kind: 'date', when: draft => draft.dateMode === 'exact', hint: 'Checked against today’s date in Kampala.',
          dateBounds: today => ({ min: today, max: addDays(today, MAX_DAYS_AHEAD) }),
          validate: (value, _draft, now) => futureDateError(value ?? '', now, { maxDays: MAX_DAYS_AHEAD, label: 'a date' }),
        },
        { name: 'timing', label: 'Approximate timing', kind: 'text', when: draft => draft.dateMode === 'flexible', placeholder: 'For example, late March 2027', minLength: 3, maxLength: 60 },
        {
          name: 'location', label: 'Where is the event?', kind: 'radio', requiredMessage: 'Choose where the event will be.',
          options: [
            { value: 'kampala', label: 'Kampala' },
            { value: 'wakiso', label: 'Wakiso' },
            { value: 'other', label: 'Somewhere else' },
          ],
        },
        { name: 'locationOther', label: 'Town or district', kind: 'text', when: draft => draft.location === 'other', placeholder: 'For example, Mukono or Jinja', minLength: 2, maxLength: 80 },
        {
          name: 'venueStatus', label: 'Venue', kind: 'radio', requiredMessage: 'Choose where you are with the venue.',
          options: [
            { value: 'booked', label: 'Venue booked' },
            { value: 'home', label: 'At a home or family property' },
            { value: 'choosing', label: 'Still choosing' },
            { value: 'none', label: 'Not started yet' },
          ],
        },
        { name: 'venue', label: 'Venue name', kind: 'text', optional: true, when: draft => draft.venueStatus === 'booked', maxLength: 120 },
      ],
    },
    {
      id: 'guests',
      title: 'Guests and service',
      intro: 'A rough guest count and the kind of service you have in mind.',
      fields: [
        {
          name: 'guests', label: 'Estimated number of guests', kind: 'number', numberRange: { min: 1, max: MAX_GUESTS }, maxLength: 5,
          hint: 'A whole number; an estimate is fine. It helps plan the conversation, and is not used to work out a price.',
        },
        {
          name: 'serviceStyle', label: 'Preferred service style', kind: 'radio', requiredMessage: 'Choose a service style, or “Not sure yet”.',
          options: [
            { value: 'buffet', label: 'Buffet', description: 'Guests serve themselves from a buffet line' },
            { value: 'plated', label: 'Plated', description: 'Meals served to guests at their seats' },
            { value: 'sharing', label: 'Family-style sharing', description: 'Dishes placed on each table to share' },
            { value: 'grill', label: 'Grill or food stations', description: 'Food cooked or served at stations' },
            { value: 'unsure', label: 'Not sure yet' },
          ],
        },
        {
          name: 'budget', label: 'Budget', kind: 'select', optional: true,
          hint: 'Only if you would like to raise it. This site does not price anything.',
          options: [
            { value: 'discuss', label: 'I’d like to discuss budget' },
            { value: 'range', label: 'I have a figure in mind' },
            { value: 'later', label: 'Not ready to say' },
          ],
        },
        { name: 'budgetNote', label: 'Your figure, in your own words', kind: 'text', optional: true, when: draft => draft.budget === 'range', placeholder: 'For example, around UGX 5 million', maxLength: 80 },
      ],
    },
    {
      id: 'menu',
      title: 'Menu and contact',
      intro: 'Check the dishes you want to talk about, add any dietary notes, and say how you could be reached.',
      fields: [
        {
          name: 'dietary', label: 'Dietary or allergy notes', kind: 'textarea', optional: true, rows: 4, maxLength: 500,
          hint: 'For example, vegetarian guests or a nut allergy. Allergies must be discussed and confirmed directly with the caterer: noting them here does not mean food will be prepared safely.',
        },
        { name: 'name', label: 'Your name', kind: 'text', autoComplete: 'name', minLength: 2, maxLength: 80 },
        { name: 'email', label: 'Email', kind: 'email', optional: true, autoComplete: 'email', maxLength: 120, hint: 'For example, name@example.com.' },
        { name: 'phone', label: 'Phone', kind: 'tel', optional: true, autoComplete: 'tel', maxLength: 24, hint: 'Ugandan or international, for example 0772 123 456 or +44 7700 900123.' },
      ],
      validate: eitherContact('contact-details', 'email', 'phone'),
    },
  ],
  groups: [{ id: 'contact-details', legend: 'How you could be reached', hint: 'Give an email address, a phone number or both.', fields: ['email', 'phone'] }],
  sample: today => ({
    occasion: 'introduction',
    dateMode: 'exact',
    date: addDays(today, 120),
    location: 'wakiso',
    venueStatus: 'home',
    guests: '250',
    serviceStyle: 'buffet',
    budget: 'discuss',
    dietary: 'Sample note: some vegetarian guests. One guest has a nut allergy, to discuss directly.',
    name: 'Sample Guest',
    email: 'sample.guest@example.com',
    phone: '+256 700 000 000',
  }),
  reviewLabel: 'Preview request',
  review: { title: 'Preview your request', intro: 'Check each answer. Use Edit to change a section; your other answers stay as they are.' },
  final: { label: 'Complete demo request', note: 'Demo only — this request will not be sent.' },
  done: {
    title: 'Your demo request is complete',
    body: 'Nothing was sent to Kirabo Catering Services or to anyone else. No booking was made, no date or availability was confirmed, and no price was worked out. Nobody will contact you because of this demo. To reach Kirabo, use the options on the Contact page.',
  },
}

export type ContactDraft = {
  name: string | null
  email: string | null
  phone: string | null
  topic: string | null
  message: string | null
}

export const contactFlow: FlowSpec<ContactDraft> = {
  key: 'contact',
  empty: () => ({ name: null, email: null, phone: null, topic: null, message: null }),
  stages: [
    {
      id: 'message',
      title: 'Your message',
      fields: [
        { name: 'name', label: 'Your name', kind: 'text', autoComplete: 'name', minLength: 2, maxLength: 80 },
        { name: 'email', label: 'Email', kind: 'email', optional: true, autoComplete: 'email', maxLength: 120, hint: 'For example, name@example.com.' },
        { name: 'phone', label: 'Phone', kind: 'tel', optional: true, autoComplete: 'tel', maxLength: 24, hint: 'Ugandan or international format.' },
        {
          name: 'topic', label: 'Topic', kind: 'select', requiredMessage: 'Choose a topic.',
          options: [
            { value: 'menus', label: 'A question about menus' },
            { value: 'event', label: 'Catering for an event' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { name: 'message', label: 'Message', kind: 'textarea', rows: 6, minLength: 10, maxLength: 1000 },
      ],
      validate: eitherContact('contact-reach', 'email', 'phone'),
    },
  ],
  groups: [{ id: 'contact-reach', legend: 'How you could be reached', hint: 'Give an email address, a phone number or both.', fields: ['email', 'phone'] }],
  sample: () => ({
    name: 'Sample Guest',
    email: 'sample.guest@example.com',
    topic: 'menus',
    message: 'Sample message: could a buffet include both luwombo and a grill?',
  }),
  reviewLabel: 'Preview message',
  review: { title: 'Preview your message', intro: 'Check the details before completing the demo.' },
  final: { label: 'Complete demo message', note: 'Demo only — this message will not be sent.' },
  done: {
    title: 'Your demo message is complete',
    body: 'No message was sent to Kirabo Catering Services or to anyone else, and nobody will reply because of this demo. To reach Kirabo, use the link to its Facebook page on this page.',
  },
}
