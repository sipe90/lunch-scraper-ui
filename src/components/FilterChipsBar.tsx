import type { FC } from 'react'
import * as R from 'remeda'
import type { ActiveFilters, FilterGroup } from '../filters'
import type { MenuTag, MenuTagsByType } from '../types'

type TagTuple = { [K in FilterGroup]: [K, ActiveFilters[K][number]] }[FilterGroup]

type Props = {
  allTags: MenuTagsByType
  filters: ActiveFilters
  onToggleTag(type: FilterGroup, tag: MenuTag): void
  onClear(): void
  expanded: boolean
  onToggleExpanded(): void
}

const QUICK_FILTER_TAGS: TagTuple[] = [
  ['diet', 'vegan'],
  ['diet', 'vegetarian'],
  ['allergen', 'glutenFree'],
  ['allergen', 'dairyFree'],
]

const humanLabel = (tag: MenuTag) => tag.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()

const FilterChipsBar: FC<Props> = ({ allTags, filters, onToggleTag, onClear, expanded, onToggleExpanded }) => {
  const activeTagTuples: TagTuple[] = R.pipe(
    filters,
    R.entries(),
    // oxlint-disable-next-line no-unsafe-type-assertion
    R.flatMap(([type, tags]) => tags.map((tag) => [type, tag] as TagTuple)),
  )

  const quickFilterTagTuples = QUICK_FILTER_TAGS.filter(([type, tag]) => {
    const tagsForGroup: MenuTag[] = allTags[type]
    const available = tagsForGroup.includes(tag)
    const alreadyActive = activeTagTuples.some(([, active]) => active === tag)
    return available && !alreadyActive
  })

  return (
    <div className="sticky top-0 z-10 bg-white border-b px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 shrink-0">Filters:</span>
        <div className="flex-1 overflow-x-auto py-2">
          <div className="flex gap-2 w-max">
            {activeTagTuples.map(([type, tag]) => (
              <button
                key={`${type}-${tag}`}
                className="shrink-0 rounded-full bg-green/10 text-green px-3 py-1 text-sm flex items-center gap-1"
                onClick={() => onToggleTag(type, tag)}
              >
                {humanLabel(tag)} ✕
              </button>
            ))}

            {quickFilterTagTuples.map(([type, tag]) => (
              <button
                key={`${type}-${tag}`}
                className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm"
                onClick={() => onToggleTag(type, tag)}
              >
                {humanLabel(tag)}
              </button>
            ))}
          </div>
        </div>
        <button className="shrink-0 text-sm text-gray-700 flex items-center gap-1 pl-2" onClick={onToggleExpanded}>
          {expanded ? 'Hide' : 'More'}
          <span className={`inline-block text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {activeTagTuples.length > 0 && (
          <button className="shrink-0 text-sm text-gray-500 pl-1" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterChipsBar
