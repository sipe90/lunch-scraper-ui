import type { FC } from 'react'
import type { Restaurant, Weekday } from '../types'
import Menu from './Menu'

type RestaurantDayMenuProps = {
  restaurant: Restaurant
  selectedDay: Weekday
}

const RestaurantDayMenu: FC<RestaurantDayMenuProps> = ({ restaurant, selectedDay }) => {
  const dailyMenu = restaurant.dailyMenus?.[selectedDay]

  return (
    <article key={restaurant.name} className="flex-1 md:min-w-[400px]">
      <h2 className="text-xl md:text-3xl text-green underline">
        <a href={restaurant.url} target="_blank" rel="noreferrer">
          {restaurant.name}
        </a>
      </h2>
      {dailyMenu ? (
        <>
          {dailyMenu.lunchtimeStart && dailyMenu.lunchtimeEnd && (
            <h3 className="mt-2 text-xl">
              Lunchtime: {dailyMenu.lunchtimeStart} - {dailyMenu.lunchtimeEnd}
            </h3>
          )}
          {dailyMenu.menuType === 'buffet' && dailyMenu.buffetPrice && (
            <h3 className="mt-2 text-xl">Buffet: {dailyMenu.buffetPrice}€</h3>
          )}
          <div className="mt-2 flex flex-wrap">
            <Menu items={dailyMenu.items} />
          </div>
        </>
      ) : (
        <div className="mt-2">The daily menu is not available</div>
      )}
    </article>
  )
}

export default RestaurantDayMenu
