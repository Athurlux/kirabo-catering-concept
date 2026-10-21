# Content notes

Checked on **21 October 2026** while building the concept.

## Verification attempts

| Source | Result |
|---|---|
| https://www.facebook.com/p/Kirabo-Catering-Services-100065414382338/ (named by the brief as the official source) | **Not readable.** Facebook refused connections from the network this was built on (direct fetch: connection refused; curl: no connection). A public reader proxy returned only Facebook's login screen. The browser extension that could have used a logged-in session was not connected. |
| Internet Archive (Wayback CDX) for the page URL and `profile.php?id=100065414382338` | No captures. |
| Web searches: "Kirabo Catering Services" Uganda; Kirabo Catering Kampala 0781148255; "Kirabo Catering" with Wakiso / Kampala / Instagram / TikTok | No listing for the business. Results were unrelated (other caterers, a politician named Kirabo, "Kirabo Deluxe Interior & Events" on Nyom Planet, which is a different business name and was not treated as Kirabo). |

## What the site states

- The business name, **Kirabo Catering Services**, as given in the brief and the Facebook URL.
- A link to the Facebook page named in the brief, labelled as Kirabo's own page and kept apart
  from the demo forms. Its contents could not be read.

## Omitted until confirmed (leads from the brief, unverified)

- Phone number **+256 781 148255** (and any WhatsApp number). No `tel:` or `wa.me` link exists anywhere.
- "Kampala / Wakiso" service area. Kampala and Wakiso appear only as **options in the quote form**
  ("Where is the event?"), not as a claim about where Kirabo works.
- Claimed **24-hour** hours.
- The list of services, menus, dietary options, address, map pin, founding date, team, owner photo.

## Written for the concept (labelled as such on the site)

- **Sample menus** (`src/data/menu.ts`): 28 common Ugandan and party dishes in four groups. Labelled
  "Sample", "illustrative … not Kirabo's verified menu", with no prices or stock. Descriptions are
  general and say nothing about allergens or certification.
- **Occasion pages** (`src/data/occasions.ts`): labelled "Concept" and "Proposed categories, pending
  confirmation". Planning notes are general advice, labelled "not a record of past work". No client
  stories, testimonials, numbers or capacity claims.
- **Proposed process** on the home page: labelled as proposed, to be confirmed with Kirabo.
- **Dietary/allergy copy**: preferences are discussion notes only; the form says allergies must be
  confirmed directly and that noting them "does not mean food will be prepared safely".

## Deliberately absent

Testimonials, client names, experience figures, capacity limits, awards, certifications, prices,
price estimates from guest counts, staff portraits, availability or booking claims, callback
promises, structured data presenting this site as the business, and embedded social feeds or maps.
No message was sent to Kirabo; the brief did not authorise outreach.

## To update when Kirabo confirms details

Add facts with their source to `src/data/business.ts` (`phones`, `email`, `hours`), remove the
matching line from `unconfirmed`, and the contact page, footer and about page will pick them up.
Replace the sample menu in `src/data/menu.ts` with Kirabo's own (keeping IDs stable, or accept that
old shortlist IDs are dropped automatically).
