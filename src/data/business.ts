// What this concept states about Kirabo Catering Services, and nothing more. The brief named
// a Facebook page as the official source, plus a phone number, a Kampala/Wakiso service area,
// 24-hour hours and a list of services as leads to check. On 21 October 2026 none of them
// could be confirmed (Facebook does not load from the network this was built on, and no other
// public listing was found), so all of them are omitted. Details: docs/CONTENT-NOTES.md.
//
// To publish a fact once Kirabo confirms it, add it here with its source; the contact page,
// footer and about page read from this file.

export const CHECKED = '21 October 2026'

export const business = {
  name: 'Kirabo Catering Services',
  /** The page the brief names as official. Linked, not quoted: its contents were not readable. */
  facebook: 'https://www.facebook.com/p/Kirabo-Catering-Services-100065414382338/',
  /** Confirmed phone numbers, email addresses and hours. Empty until verified. */
  phones: [] as { display: string; href: string }[],
  email: null as string | null,
  hours: null as string | null,
} as const

/** Details the brief offered that are held back until Kirabo confirms them. */
export const unconfirmed = [
  'phone and WhatsApp numbers',
  'opening hours, including any 24-hour service',
  'the areas Kirabo serves',
  'the exact services, menus and dietary options Kirabo offers',
]
