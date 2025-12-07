import * as R from 'remeda'
import type { MenuTag } from './types'

export type FilterGroup = 'diet' | 'allergen' | 'dishType' | 'cuisine' | 'protein'

export type ActiveFilters = {
  [K in FilterGroup]: MenuTag[]
}

export const TAG_GROUP: Record<MenuTag, FilterGroup> = {
  vegetarian: 'diet',
  vegan: 'diet',
  pescatarian: 'diet',
  halal: 'diet',

  gluten_free: 'allergen',
  lactose_free: 'allergen',
  dairy_free: 'allergen',
  nut_free: 'allergen',
  egg_free: 'allergen',
  soy_free: 'allergen',
  fish_free: 'allergen',
  shellfish_free: 'allergen',

  soup: 'dishType',
  salad: 'dishType',
  burger: 'dishType',
  pizza: 'dishType',
  pasta: 'dishType',
  curry: 'dishType',
  stew: 'dishType',
  rice_bowl: 'dishType',
  taco: 'dishType',
  wrap: 'dishType',
  sandwich: 'dishType',
  kebab: 'dishType',
  wings: 'dishType',
  sushi: 'dishType',

  italian: 'cuisine',
  french: 'cuisine',
  nordic: 'cuisine',
  american: 'cuisine',
  mexican: 'cuisine',
  indian: 'cuisine',
  nepalese: 'cuisine',
  thai: 'cuisine',
  chinese: 'cuisine',
  japanese: 'cuisine',
  korean: 'cuisine',

  beef: 'protein',
  pork: 'protein',
  chicken: 'protein',
  fish: 'protein',
  seafood: 'protein',
  lamb: 'protein',
  tofu: 'protein',
  halloumi: 'protein',
  falafel: 'protein',
  legumes: 'protein',
  game: 'protein',
}

export const getAllActiveTags = (filters: ActiveFilters): MenuTag[] =>
  R.keys(filters).flatMap((group) => filters[group])

export function itemMatchesFilters(itemTags: MenuTag[], filters: ActiveFilters): boolean {
  const groups: FilterGroup[] = ['diet', 'allergen', 'dishType', 'cuisine', 'protein']

  // If no filters active at all, everything matches
  const anyActive = groups.some((g) => filters[g].length > 0)
  if (!anyActive) return true

  // AND across groups: each non-empty group must match at least one tag
  for (const group of groups) {
    const requiredTags = filters[group]
    if (!requiredTags.length) continue

    const hasMatch = itemTags.some((t) => requiredTags.includes(t))
    if (!hasMatch) return false
  }

  return true
}
