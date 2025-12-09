import type { FC } from 'react'
import type { ActiveFilters, FilterGroup } from '../filters'
import type { MenuTag, MenuTagsByType } from '../types'

type Props = {
  allTags: MenuTagsByType
  filters: ActiveFilters
  onToggleTag(group: FilterGroup, tag: MenuTag): void
}

const GROUPS: {
  group: FilterGroup
  title: string
}[] = [
  { group: 'diet', title: 'Diet' },
  { group: 'allergen', title: 'Allergens' },
  { group: 'dishType', title: 'Dish type' },
  { group: 'cuisine', title: 'Cuisine' },
  { group: 'protein', title: 'Main ingredient' },
]

const label = (tag: MenuTag) => tag.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()

const FiltersAccordion: FC<Props> = ({ allTags, filters, onToggleTag }) => {
  return (
    <div className="border-b px-3 py-2">
      {GROUPS.map(({ group, title }) => {
        const tags = allTags[group]
        return (
          <details key={group} className="mb-2">
            <summary className="cursor-pointer text-sm font-semibold py-1">{title}</summary>

            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => {
                const active = filters[group].includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(group, tag)}
                    className={
                      'px-3 py-1 rounded-full text-sm border ' +
                      (active ? 'bg-green/10 text-green border-green' : 'bg-white border-gray-200 text-gray-700')
                    }
                  >
                    {label(tag)}
                  </button>
                )
              })}
            </div>
          </details>
        )
      })}
    </div>
  )
}

export default FiltersAccordion
