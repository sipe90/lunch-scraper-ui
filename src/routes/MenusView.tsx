import { useLoaderData } from '@tanstack/react-router'
import { type FC, useEffect, useState } from 'react'
import DayMenu from '../components/DayMenu'
import MenuNavigation from '../components/MenuNavigation'
import Panel from '../components/Panel'
import { getDayOfWeek } from '../time-util'
import type { Weekday } from '../types'

const MenusView: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Weekday | undefined>()
  const menus = useLoaderData({ from: '/menus/$areaId' })

  useEffect(() => {
    if (!selectedDay) {
      const currentWeekday = getDayOfWeek()
      if (currentWeekday !== 'saturday' && currentWeekday !== 'sunday') {
        setSelectedDay(currentWeekday)
      } else {
        setSelectedDay('monday')
      }
    }
  }, [selectedDay])

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
      <Panel roundedTop={false} className="flex gap-4 flex-col md:flex-row md:flex-wrap min-h-[800px]">
        {selectedDay &&
          menus.restaurants.map((restaurant) => (
            <article key={restaurant.name} className="flex-1 md:min-w-[400px]">
              <h2 className="text-xl md:text-3xl text-green underline">
                <a href={restaurant.url} target="_blank" rel="noreferrer">
                  {restaurant.name}
                </a>
              </h2>
              {restaurant.dailyMenus?.[selectedDay].length ? (
                <>
                  {restaurant.dailyMenus.menu_type === 'buffet' && restaurant.dailyMenus.buffet_price && (
                    <h3 className="ml-4 mt-2 text-xl">Buffet: {restaurant.dailyMenus.buffet_price}€</h3>
                  )}
                  <div className="mt-2 flex flex-wrap">
                    <DayMenu items={restaurant.dailyMenus[selectedDay]} />
                  </div>
                </>
              ) : (
                <div className="mt-2">The daily menu is not available</div>
              )}
            </article>
          ))}
      </Panel>
    </>
  )
}

export default MenusView
