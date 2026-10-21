import { describe, expect, it } from 'vitest'
import { futureDateError, kampalaToday, normalizePhone, emailError } from './validation'
import { addId, parseShortlist, removeId, serializeShortlist } from './shortlist'
import { createReference, firstIncompleteIndex, pruneHidden, reviewSections, validateStage } from '../forms/engine'
import { DONE, REVIEW, resolveStep } from '../forms/useFormFlow'
import { contactFlow, quoteFlow, type QuoteDraft } from '../forms/flows'
import { filterMenu, MENU } from '../data/menu'
import { filterGallery, GALLERY } from '../data/gallery'

// 21:30 UTC on 31 Dec is already 1 Jan in Kampala (UTC+3).
const LATE_NEW_YEARS_EVE = new Date('2026-12-31T21:30:00Z')
const today = kampalaToday()
const sample = (): QuoteDraft => ({ ...quoteFlow.empty(), ...quoteFlow.sample(today) }) as QuoteDraft
const stage = (id: string) => quoteFlow.stages.find(item => item.id === id)!

describe('menu shortlist', () => {
  it('never duplicates an item and ignores unknown IDs', () => {
    const once = addId([], 'chicken-luwombo')
    expect(addId(once, 'chicken-luwombo')).toBe(once)
    expect(addId(once, 'not-a-dish')).toBe(once)
    expect(removeId(addId(once, 'coffee'), 'chicken-luwombo')).toEqual(['coffee'])
  })
  it('recovers from malformed, outdated and duplicated storage', () => {
    expect(parseShortlist(null)).toEqual([])
    expect(parseShortlist('{not json')).toEqual([])
    expect(parseShortlist('["chicken-luwombo"]')).toEqual([]) // no version wrapper
    expect(parseShortlist(JSON.stringify({ version: 99, items: ['coffee'] }))).toEqual([])
    const messy = JSON.stringify({ version: 1, items: ['coffee', 'retired-dish', 'coffee', 42, null, 'kachumbari'] })
    expect(parseShortlist(messy)).toEqual(['coffee', 'kachumbari'])
    expect(parseShortlist(serializeShortlist(['avocado']))).toEqual(['avocado'])
  })
  it('stores only IDs', () => {
    expect(JSON.parse(serializeShortlist(['coffee']))).toEqual({ version: 1, items: ['coffee'] })
  })
})

describe('filters', () => {
  it('menu search is case- and accent-insensitive and combines with the category', () => {
    expect(filterMenu(null, 'LUWOMBO').map(item => item.id)).toEqual(['chicken-luwombo', 'beef-luwombo'])
    expect(filterMenu(null, 'sautee').map(item => item.id)).toContain('greens') // "Sautéed"
    expect(filterMenu('drinks', 'juice').every(item => item.category === 'drinks')).toBe(true)
    expect(filterMenu('grills', 'luwombo')).toEqual([])
    expect(filterMenu('bogus', '')).toHaveLength(MENU.length)
  })
  it('gallery filter falls back to everything for unknown values', () => {
    expect(filterGallery('drinks').map(image => image.name)).toEqual(['drinks'])
    expect(filterGallery('nonsense')).toHaveLength(GALLERY.length)
  })
})

describe('Kampala dates and contact formats', () => {
  it('uses the Kampala calendar day, not the visitor’s', () => {
    expect(kampalaToday(LATE_NEW_YEARS_EVE)).toBe('2027-01-01')
    expect(futureDateError('2026-12-31', LATE_NEW_YEARS_EVE)).toMatch(/today or a later date/)
    expect(futureDateError('2027-01-01', LATE_NEW_YEARS_EVE)).toBeNull()
    expect(futureDateError('2027-02-31', LATE_NEW_YEARS_EVE)).toBe('Enter a valid date.')
  })
  it('accepts Ugandan and international phone numbers, and real email shapes', () => {
    expect(normalizePhone('0781 148 255')).toBe('+256781148255')
    expect(normalizePhone('+256 (701) 234-858')).toBe('+256701234858')
    expect(normalizePhone('+44 7700 900123')).toBe('+447700900123')
    expect(normalizePhone('+256 12')).toBeNull()
    expect(emailError('first.last+events@mail.co.ug', true)).toBeNull()
    expect(emailError('name@domain', true)).toMatch(/format/)
  })
})

describe('quote request', () => {
  it('sample details pass every stage', () => {
    for (const item of quoteFlow.stages) expect(validateStage(item, sample())).toEqual({})
  })
  it('needs a positive whole-number guest estimate within bounds', () => {
    for (const guests of ['0', '-5', '12.5', 'about 100', '5001', '']) {
      expect(validateStage(stage('guests'), { ...sample(), guests })).toHaveProperty('guests')
    }
    expect(validateStage(stage('guests'), { ...sample(), guests: '1' })).toEqual({})
  })
  it('asks for follow-up fields only when they apply', () => {
    const draft = { ...sample(), dateMode: 'exact', date: null, location: 'other', locationOther: '', occasion: 'other', occasionOther: null }
    expect(Object.keys(validateStage(stage('event'), draft)).sort()).toEqual(['date', 'locationOther', 'occasionOther'])
    const open = { ...draft, dateMode: 'undecided', location: 'kampala', occasion: 'wedding' }
    expect(validateStage(stage('event'), open)).toEqual({})
  })
  it('needs an email or a phone number', () => {
    expect(validateStage(stage('menu'), { ...sample(), email: '', phone: '' })).toHaveProperty('contact-details')
    expect(validateStage(stage('menu'), { ...sample(), email: '' })).toEqual({})
  })
  it('drops hidden answers before review', () => {
    const draft = { ...sample(), dateMode: 'undecided' }
    expect(pruneHidden(quoteFlow, draft).date).toBeNull()
    expect(reviewSections(quoteFlow, draft).flatMap(section => section.entries).some(entry => entry.name === 'date')).toBe(false)
  })
})

describe('confirmation state', () => {
  it('a direct link cannot skip unfinished steps, but can ask for the done screen', () => {
    expect(resolveStep(quoteFlow, quoteFlow.empty(), REVIEW)).toBe('event')
    expect(resolveStep(quoteFlow, sample(), REVIEW)).toBe(REVIEW)
    expect(resolveStep(quoteFlow, quoteFlow.empty(), DONE)).toBe(DONE) // the page then shows its recovery message
    expect(firstIncompleteIndex(contactFlow, contactFlow.empty())).toBe(0)
  })
  it('references are DEMO-prefixed and unambiguous', () => {
    expect(createReference('DEMO')).toMatch(/^DEMO-[A-HJ-NP-Z2-9]{6}$/)
  })
})
