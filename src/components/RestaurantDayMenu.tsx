import type { FC } from 'react'
import { type ActiveFilters, itemMatchesFilters } from '../filters'
import type { Restaurant, Weekday } from '../types'
import Menu from './Menu'

type RestaurantDayMenuProps = {
  restaurant: Restaurant
  selectedDay: Weekday
  filters: ActiveFilters
}

const RestaurantDayMenu: FC<RestaurantDayMenuProps> = ({ restaurant, selectedDay, filters }) => {
  const dayMenu = restaurant.dailyMenus?.[selectedDay]

  if (!dayMenu) {
    return null
  }

  const visibleItems = dayMenu.items.filter((item) => itemMatchesFilters(item.tags, filters))
  if (!visibleItems.length) {
    return null
  }

  return (
    <article key={restaurant.name} className="flex-1 md:min-w-[400px]">
      <h2 className="text-xl md:text-3xl text-green underline">
        <a href={restaurant.url} target="_blank" rel="noreferrer">
          {restaurant.name}
        </a>
      </h2>
      {dayMenu.lunchtimeStart && dayMenu.lunchtimeEnd && (
        <h3 className="mt-2 text-xl">
          Lunchtime: {dayMenu.lunchtimeStart} - {dayMenu.lunchtimeEnd}
        </h3>
      )}
      {dayMenu.menuType === 'buffet' && dayMenu.buffetPrice && (
        <h3 className="mt-2 text-xl">Buffet: {dayMenu.buffetPrice}€</h3>
      )}
      <div className="mt-2 flex flex-wrap">
        <Menu items={visibleItems} />
      </div>
    </article>
  )
}

export default RestaurantDayMenu
