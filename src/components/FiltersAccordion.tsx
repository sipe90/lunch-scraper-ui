import type { FC } from 'react'
import type { ActiveFilters, FilterGroup } from '../filters'
import type { MenuTag } from '../types'

type Props = {
  filters: ActiveFilters
  onToggleTag(tag: MenuTag): void
}

const GROUPS: {
  group: FilterGroup
  title: string
  tags: MenuTag[]
}[] = [
  { group: 'diet', title: 'Diet', tags: ['vegetarian', 'vegan', 'pescatarian', 'halal'] },
  {
    group: 'allergen',
    title: 'Allergens',
    tags: [
      'gluten_free',
      'lactose_free',
      'dairy_free',
      'nut_free',
      'egg_free',
      'soy_free',
      'fish_free',
      'shellfish_free',
    ],
  },
  {
    group: 'dishType',
    title: 'Dish type',
    tags: [
      'soup',
      'salad',
      'burger',
      'pizza',
      'pasta',
      'curry',
      'stew',
      'rice_bowl',
      'taco',
      'wrap',
      'sandwich',
      'kebab',
      'wings',
      'sushi',
    ],
  },
  {
    group: 'cuisine',
    title: 'Cuisine',
    tags: ['nordic', 'italian', 'american', 'mexican', 'indian', 'thai', 'chinese', 'japanese', 'korean'],
  },
  {
    group: 'protein',
    title: 'Main ingredient',
    tags: ['chicken', 'beef', 'pork', 'fish', 'seafood', 'lamb', 'tofu', 'halloumi', 'falafel', 'legumes', 'game'],
  },
]

const label = (tag: MenuTag) => tag.replace('_', ' ')

const FiltersAccordion: FC<Props> = ({ filters, onToggleTag }) => {
  return (
    <div className="border-b px-3 py-2">
      {GROUPS.map(({ group, title, tags }) => (
        <details key={group} className="mb-2">
          <summary className="cursor-pointer text-sm font-semibold py-1">{title}</summary>

          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => {
              const active = filters[group].includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
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
      ))}
    </div>
  )
}

export default FiltersAccordion
