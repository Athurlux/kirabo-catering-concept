import type { ImageName } from '../components/Img'

// An illustrative sample menu written for this proposal. It is not Kirabo's menu: dishes,
// descriptions and groupings are suggestions to discuss, there are no prices, and nothing here
// says how any dish is prepared for allergies or dietary rules.

export type CategoryId = 'traditional' | 'grills' | 'vegetarian' | 'drinks'

export interface Category {
  id: CategoryId
  label: string
  /** One sentence under the category heading. */
  intro: string
  /** A spread photograph for the whole category; it is never presented as a specific dish. */
  image: ImageName
  imageAlt: string
}

export interface MenuItem {
  id: string
  name: string
  category: CategoryId
  description: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'traditional', label: 'Traditional favourites', image: 'buffet',
    intro: 'The dishes many Ugandan celebrations are built around, served generously from the buffet.',
    imageAlt: 'A buffet of steamed matooke, rice, beans, greens, groundnut sauce and beef stew on banana leaves',
  },
  {
    id: 'grills', label: 'Grills', image: 'grill',
    intro: 'Skewers and roasts finished over charcoal, with fresh salads to cut through.',
    imageAlt: 'A platter of chicken and beef skewers with grilled vegetables, maize, lime and a tomato-onion salad',
  },
  {
    id: 'vegetarian', label: 'Vegetarian ideas', image: 'vegetarian',
    intro: 'Plant-based dishes that hold their own on a shared table. Ideas to discuss, not a dietary guarantee.',
    imageAlt: 'A divided platter of matooke, beans, greens, pumpkin and avocado around a bowl of groundnut sauce',
  },
  {
    id: 'drinks', label: 'Drinks', image: 'drinks',
    intro: 'Fresh juices and soft drinks poured from the table, with hot drinks for later in the day.',
    imageAlt: 'A drinks table with passion fruit juice in a glass dispenser, pineapple juice, mint water and cut fruit',
  },
]

export const MENU: MenuItem[] = [
  // Traditional favourites
  { id: 'chicken-luwombo', category: 'traditional', name: 'Chicken luwombo', description: 'Chicken stewed gently in a groundnut or tomato sauce, wrapped and steamed in banana leaves.' },
  { id: 'beef-luwombo', category: 'traditional', name: 'Beef luwombo', description: 'Tender beef in a rich sauce, steamed in its own banana-leaf parcel.' },
  { id: 'steamed-matooke', category: 'traditional', name: 'Steamed matooke', description: 'Green bananas steamed in leaves until soft, served whole or mashed.' },
  { id: 'groundnut-sauce', category: 'traditional', name: 'Groundnut sauce', description: 'A smooth, slow-cooked peanut sauce for matooke, rice and greens.' },
  { id: 'beef-stew', category: 'traditional', name: 'Beef stew', description: 'Beef braised with tomatoes, onions and carrots.' },
  { id: 'pilau', category: 'traditional', name: 'Pilau rice', description: 'Rice cooked with whole spices and stock.' },
  { id: 'plain-rice', category: 'traditional', name: 'Steamed rice', description: 'Plain white rice to sit alongside the sauces.' },
  { id: 'greens', category: 'traditional', name: 'Sautéed greens', description: 'Leafy greens cooked down with onion and tomato.' },
  // Grills
  { id: 'chicken-skewers', category: 'grills', name: 'Chicken skewers', description: 'Marinated chicken pieces grilled on skewers over charcoal.' },
  { id: 'beef-skewers', category: 'grills', name: 'Beef skewers', description: 'Beef and vegetable skewers, charred at the edges.' },
  { id: 'roast-chicken', category: 'grills', name: 'Grilled chicken pieces', description: 'Bone-in chicken, marinated and grilled until golden.' },
  { id: 'grilled-tilapia', category: 'grills', name: 'Grilled whole tilapia', description: 'Whole fish, scored and grilled, served with lime.' },
  { id: 'roast-maize', category: 'grills', name: 'Roasted maize', description: 'Cobs roasted over the coals.' },
  { id: 'grilled-vegetables', category: 'grills', name: 'Grilled vegetables', description: 'Courgette, peppers and onions from the grill.' },
  { id: 'kachumbari', category: 'grills', name: 'Kachumbari', description: 'A fresh salad of tomato, onion and chilli with lime.' },
  { id: 'roast-potatoes', category: 'grills', name: 'Roast potatoes', description: 'Potatoes roasted with herbs until crisp outside.' },
  // Vegetarian ideas
  { id: 'katogo', category: 'vegetarian', name: 'Matooke and bean katogo', description: 'Matooke simmered together with beans in one pot.' },
  { id: 'bean-stew', category: 'vegetarian', name: 'Bean stew', description: 'Red beans cooked slowly in a tomato and onion sauce.' },
  { id: 'pumpkin', category: 'vegetarian', name: 'Steamed pumpkin', description: 'Sweet pumpkin pieces, steamed and lightly seasoned.' },
  { id: 'avocado', category: 'vegetarian', name: 'Sliced avocado', description: 'Ripe avocado served fresh at the table.' },
  { id: 'vegetable-pilau', category: 'vegetarian', name: 'Vegetable pilau', description: 'Spiced rice with peas, carrots and peppers.' },
  { id: 'cabbage', category: 'vegetarian', name: 'Cabbage and carrot', description: 'Shredded cabbage and carrot, lightly sautéed.' },
  // Drinks
  { id: 'passion-juice', category: 'drinks', name: 'Passion fruit juice', description: 'Fresh passion fruit, served chilled from a dispenser.' },
  { id: 'pineapple-juice', category: 'drinks', name: 'Pineapple juice', description: 'Pressed pineapple, served cold.' },
  { id: 'mango-juice', category: 'drinks', name: 'Mango juice', description: 'Thick, fresh mango juice.' },
  { id: 'mint-water', category: 'drinks', name: 'Lime and mint water', description: 'Water with lime and fresh mint, for long afternoons.' },
  { id: 'african-tea', category: 'drinks', name: 'African tea', description: 'Tea brewed with milk and spices.' },
  { id: 'coffee', category: 'drinks', name: 'Coffee', description: 'Hot coffee for after the meal.' },
]

export const isCategory = (value: string | null): value is CategoryId => CATEGORIES.some(category => category.id === value)
export const findItem = (id: string) => MENU.find(item => item.id === id)
export const findCategory = (id: CategoryId) => CATEGORIES.find(category => category.id === id)!

export const MAX_QUERY = 60

/** Case- and accent-insensitive match on the dish name and description. */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function filterMenu(category: string | null, query: string | null) {
  const words = fold((query ?? '').slice(0, MAX_QUERY)).split(/\s+/).filter(Boolean)
  return MENU.filter(item =>
    (!isCategory(category) || item.category === category) &&
    words.every(word => fold(`${item.name} ${item.description}`).includes(word)))
}
