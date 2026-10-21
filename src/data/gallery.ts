import type { ImageName } from '../components/Img'

// Every photograph in the gallery is an AI-generated illustration made for this proposal.
// Captions describe what is shown; they never say it is Kirabo's food, venue or event.

export type GalleryFilter = 'dishes' | 'spreads' | 'drinks'

export const GALLERY_FILTERS: { id: GalleryFilter; label: string }[] = [
  { id: 'dishes', label: 'Dishes' },
  { id: 'spreads', label: 'Buffets and spreads' },
  { id: 'drinks', label: 'Drinks' },
]

export interface GalleryImage {
  name: ImageName
  filter: GalleryFilter
  caption: string
  alt: string
}

export const GALLERY: GalleryImage[] = [
  { name: 'luwombo', filter: 'dishes', caption: 'Luwombo in its banana-leaf parcel, with matooke', alt: 'Close view of chicken luwombo opened in its banana leaves on a wooden platter, matooke behind' },
  { name: 'wedding', filter: 'spreads', caption: 'A wedding buffet line under a garden marquee', alt: 'A long buffet of silver chafing dishes on white linen, with white flowers and a garden beyond' },
  { name: 'grill', filter: 'dishes', caption: 'Skewers, grilled vegetables and kachumbari', alt: 'Chicken and beef skewers with grilled courgette, peppers, maize, lime and a tomato-onion salad' },
  { name: 'introduction', filter: 'spreads', caption: 'A traditional spread for an introduction', alt: 'Matooke on banana leaves in woven baskets beside luwombo parcels and clay pots, outdoors' },
  { name: 'drinks', filter: 'drinks', caption: 'Passion fruit, pineapple and lime-mint drinks', alt: 'A glass dispenser of passion fruit juice, a jug of pineapple juice, mint water and cut fruit' },
  { name: 'vegetarian', filter: 'dishes', caption: 'A vegetarian sharing platter', alt: 'A divided platter of matooke, beans, greens, pumpkin and avocado around groundnut sauce' },
  { name: 'corporate', filter: 'spreads', caption: 'Plated lunches for a working day', alt: 'Plates of rice, grilled chicken and vegetables lined up beside a buffet in a bright room' },
  { name: 'buffet', filter: 'spreads', caption: 'Traditional favourites on the buffet', alt: 'Bowls of matooke, rice, beans, greens, groundnut sauce and beef stew on banana leaves' },
  { name: 'private', filter: 'spreads', caption: 'A garden table for a private celebration', alt: 'Grilled chicken, a fruit platter crowned with pineapple, salads, rice and small cakes outdoors' },
  { name: 'hero-desktop', filter: 'dishes', caption: 'A shared table of luwombo, grilled chicken and sides', alt: 'A wooden table set with luwombo, matooke, rice, grilled chicken, greens and groundnut sauce' },
]

export const isGalleryFilter = (value: string | null): value is GalleryFilter => GALLERY_FILTERS.some(filter => filter.id === value)
export const filterGallery = (filter: string | null) => (isGalleryFilter(filter) ? GALLERY.filter(image => image.filter === filter) : GALLERY)
