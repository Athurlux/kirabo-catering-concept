import type { ImageName } from '../components/Img'

// Proposed occasion categories for the concept, pending Kirabo's confirmation of what it
// caters. The planning notes are general advice for anyone catering an event of this kind,
// not a description of Kirabo's past work: there are no client stories here.

export interface Occasion {
  slug: string
  /** The quote form's occasion value this page preselects. */
  quoteValue: string
  name: string
  line: string
  image: ImageName
  imageAlt: string
  intro: string
  planning: { title: string; body: string }[]
  /** Service styles that tend to suit the occasion; shown as suggestions. */
  styles: string[]
}

export const OCCASIONS: Occasion[] = [
  {
    slug: 'weddings', quoteValue: 'wedding', name: 'Weddings',
    line: 'A full buffet for the reception, with drinks flowing from the moment guests arrive.',
    image: 'wedding', imageAlt: 'A long wedding buffet of silver chafing dishes under a white marquee, with white flowers and a garden beyond',
    intro: 'A wedding meal is often the longest the guests will spend together. The menu, the timing and the way food reaches every table all shape how the reception feels.',
    planning: [
      { title: 'Start from the guest list', body: 'An estimate is enough to begin. It sets how many serving points, how much equipment and how many staff a reception needs.' },
      { title: 'Plan around the programme', body: 'Speeches, photographs and entertainment move the meal. Share the running order so food is ready when guests are, not before.' },
      { title: 'Mix familiar and festive', body: 'Many couples pair traditional favourites with a grill or a special dish, so every generation finds something they love.' },
      { title: 'Raise dietary needs early', body: 'Allergies and dietary requirements need a direct conversation with the caterer, well before the day.' },
    ],
    styles: ['Buffet', 'Plated service for the top table', 'Drinks station'],
  },
  {
    slug: 'introductions', quoteValue: 'introduction', name: 'Introductions',
    line: 'Generous traditional dishes for both families and every guest they bring.',
    image: 'introduction', imageAlt: 'A traditional spread outdoors: matooke on banana leaves in woven baskets, luwombo parcels and clay pots of stew',
    intro: 'An introduction ceremony brings two families together, often with a large and loosely counted guest list. Food is part of the welcome, and traditional dishes are usually at its heart.',
    planning: [
      { title: 'Expect a range, not a number', body: 'Guest numbers for introductions can be hard to fix. Share a realistic range and discuss how to plan for the top of it.' },
      { title: 'Agree who serves when', body: 'Ceremonies have their own order. Agree when the meal begins, and whether elders or the visiting family are served first.' },
      { title: 'Think about the site', body: 'Many introductions happen at a family home or outdoor venue. Access, shade, water and space for cooking or warming all matter.' },
      { title: 'Choose dishes with meaning', body: 'Luwombo, matooke and groundnut sauce are familiar choices. Talk through which dishes matter most to both families.' },
    ],
    styles: ['Buffet', 'Family-style sharing', 'Drinks station'],
  },
  {
    slug: 'corporate', quoteValue: 'corporate', name: 'Corporate gatherings',
    line: 'Working lunches, launches and conference days, served on time and to plan.',
    image: 'corporate', imageAlt: 'Plated lunches of rice, grilled chicken and vegetables beside a buffet line in a bright city-view room',
    intro: 'For workshops, launches and staff days, food has to fit the agenda. Timing, portion control and a clear headcount usually matter more than anything else.',
    planning: [
      { title: 'Share the agenda', body: 'Tea breaks, lunch and any evening reception each need their own timing, and sometimes their own menu.' },
      { title: 'Confirm numbers in stages', body: 'Agree an estimate first, and when the final headcount is needed, so the order matches attendance.' },
      { title: 'Keep it easy to eat', body: 'Plated lunches or a quick-moving buffet keep a working day on schedule.' },
      { title: 'Ask about paperwork', body: 'If your organisation needs quotations, invoices or supplier documents, raise it at the start.' },
    ],
    styles: ['Plated service', 'Buffet', 'Tea and coffee breaks'],
  },
  {
    slug: 'private-celebrations', quoteValue: 'private', name: 'Private celebrations',
    line: 'Birthdays, anniversaries, graduations and gatherings at home.',
    image: 'private', imageAlt: 'A garden table of grilled chicken, a fruit platter with pineapple, salads, spiced rice and small cakes',
    intro: 'Smaller gatherings can be the most personal. A favourite dish, a family recipe or a grill in the garden can make the day.',
    planning: [
      { title: 'Tell the story of the day', body: 'Who is it for, and what do they love to eat? A short description goes a long way.' },
      { title: 'Match the setting', body: 'A garden lunch, an evening at home and a hired venue each suit a different style of service.' },
      { title: 'Plan the drinks', body: 'Fresh juices, tea and coffee can be part of the same conversation as the food.' },
      { title: 'Leave room for a flexible date', body: 'If the date is not fixed yet, you can still start planning the menu.' },
    ],
    styles: ['Family-style sharing', 'Grill', 'Buffet'],
  },
]

export const findOccasion = (slug: string | undefined) => OCCASIONS.find(occasion => occasion.slug === slug)
export const nextOccasion = (slug: string) => OCCASIONS[(OCCASIONS.findIndex(occasion => occasion.slug === slug) + 1) % OCCASIONS.length]
