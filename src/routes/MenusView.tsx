import { useLoaderData } from '@tanstack/react-router'
import { type FC, useEffect, useState } from 'react'
import FilterChipsBar from '../components/FilterChipsBar'
import FiltersAccordion from '../components/FiltersAccordion'
import MenuNavigation from '../components/MenuNavigation'
import Panel from '../components/Panel'
import RestaurantDayMenu from '../components/RestaurantDayMenu'
import { type ActiveFilters } from '../filters'
import { getDayOfWeek } from '../time-util'
import type { MenuTag, MenuTagsByType, Weekday } from '../types'

const emptyFilters: ActiveFilters = {
  diet: [],
  allergen: [],
  dishType: [],
  cuisine: [],
  protein: [],
}

const MenusView: FC = () => {
  const menus = useLoaderData({ from: '/menus/$areaId' })
  const [selectedDay, setSelectedDay] = useState<Weekday>()
  const [filters, setFilters] = useState<ActiveFilters>(emptyFilters)
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  useEffect(() => {
    if (!selectedDay) {
      const currentWeekday = getDayOfWeek()
      setSelectedDay(currentWeekday === 'saturday' || currentWeekday === 'sunday' ? 'monday' : currentWeekday)
    }
  }, [selectedDay])

  const toggleTag = (type: keyof MenuTagsByType, tag: MenuTag) => {
    setFilters((prev) => {
      const list = prev[type]
      const exists = list.includes(tag)
      const updated = exists ? list.filter((t) => t !== tag) : [...list, tag]
      return { ...prev, [type]: updated }
    })
  }

  const clearFilters = () => setFilters(emptyFilters)

  if (!menus.restaurants.length) {
    return (
      <Panel className="flex gap-4 flex-col md:flex-row md:flex-wrap min-h-[800px]">
        <h2 className="mt-2 text-2xl justify-self-center text-green font-semibold">
          No restaurants available for this location!
        </h2>
      </Panel>
    )
  }

  return (
    <>
      <nav>
        <MenuNavigation selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      </nav>

      <FilterChipsBar
        allTags={menus.tags}
        filters={filters}
        expanded={filtersExpanded}
        onToggleExpanded={() => setFiltersExpanded((v) => !v)}
        onToggleTag={toggleTag}
        onClear={clearFilters}
      />

      <div
        className={
          'bg-gray-50 overflow-hidden transition-[max-height] duration-300 ease-out ' +
          (filtersExpanded ? 'max-h-[500px]' : 'max-h-0')
        }
      >
        <FiltersAccordion allTags={menus.tags} filters={filters} onToggleTag={toggleTag} />
      </div>

      <Panel roundedTop={false} className="flex gap-4 flex-col md:flex-row md:flex-wrap min-h-[800px]">
        {selectedDay &&
          menus.restaurants.map((restaurant) => (
            <RestaurantDayMenu
              key={restaurant.name}
              restaurant={restaurant}
              selectedDay={selectedDay}
              filters={filters}
            />
          ))}
      </Panel>
    </>
  )
}

export default MenusView
