import type { MenuTag, MenuTagsByType } from './types'

export type FilterGroup = keyof MenuTagsByType

export type ActiveFilters = Record<FilterGroup, MenuTag[]>

export function itemMatchesFilters(itemTags: MenuTagsByType, filters: ActiveFilters): boolean {
  // If no filters active at all, everything matches
  const anyActive = Object.values(filters).some((tags) => tags.length > 0)
  if (!anyActive) return true

  // AND across groups: each non-empty group must match at least one tag
  // oxlint-disable-next-line no-unsafe-type-assertion
  for (const [type, filterTags] of Object.entries(filters) as [FilterGroup, MenuTag[]][]) {
    if (!filterTags.length) continue

    const tags = itemTags[type] ?? []
    const hasMatch = tags.some((t) => filterTags.includes(t))
    if (!hasMatch) return false
  }

  return true
}
