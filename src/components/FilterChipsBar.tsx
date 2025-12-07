import type { FC } from 'react'
import type { ActiveFilters } from '../filters'
import { getAllActiveTags } from '../filters'
import type { MenuTag } from '../types'

type Props = {
  filters: ActiveFilters
  onToggleTag(tag: MenuTag): void
  onClear(): void
  expanded: boolean
  onToggleExpanded(): void
}

const QUICK_FILTER_TAGS: MenuTag[] = ['vegan', 'vegetarian', 'gluten_free', 'dairy_free']

const humanLabel = (tag: MenuTag) => tag.replace('_', ' ')

const FilterChipsBar: FC<Props> = ({ filters, onToggleTag, onClear, expanded, onToggleExpanded }) => {
  const activeTags = getAllActiveTags(filters)

  return (
    <div className="sticky top-0 z-10 bg-white border-b px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 shrink-0">Filters:</span>
        <div className="flex-1 overflow-x-auto py-2">
          <div className="flex gap-2 w-max">
            {activeTags.map((tag) => (
              <button
                key={tag}
                className="shrink-0 rounded-full bg-green/10 text-green px-3 py-1 text-sm flex items-center gap-1"
                onClick={() => onToggleTag(tag)}
              >
                {humanLabel(tag)} ✕
              </button>
            ))}

            {QUICK_FILTER_TAGS.filter((t) => !activeTags.includes(t)).map((tag) => (
              <button
                key={tag}
                className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm"
                onClick={() => onToggleTag(tag)}
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
        {activeTags.length > 0 && (
          <button className="shrink-0 text-sm text-gray-500 pl-1" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterChipsBar
