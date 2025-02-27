import { useEffect, useState, type FC } from 'react'
import DayMenu from '../components/DayMenu'
import { useRouteLoaderData } from 'react-router'
import { type Menus } from '../types'
import { Weekday } from '../const'
import { getDayOfWeek } from '../time-util'
import MenuNavigation from '../components/MenuNavigation'
import Panel from '../components/Panel'

const Menus: FC = () => {
  const [selectedDay, setSelectedDay] = useState<Weekday | undefined>(undefined)
  const menus = useRouteLoaderData('menus') as Menus

  useEffect(() => {
    if (!selectedDay) {
      const currentWeekday = getDayOfWeek()
      if (
        currentWeekday != Weekday.SATURDAY &&
        currentWeekday != Weekday.SUNDAY
      ) {
        setSelectedDay(currentWeekday)
      } else {
        setSelectedDay(Weekday.MONDAY)
      }
    }
  })

  if (menus && !menus.restaurants.length) {
    return (
      <Panel className="flex gap-4 flex-col md:flex-row md:flex-wrap min-h-[800px]">
        <h2 className="mt-2 text-2xl justify-self-center text-green font-semibold">No restaurants available for this location!</h2>
      </Panel>
    )
  }

  return (
    <>
      <nav>
        <MenuNavigation selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      </nav>
      <Panel roundedTop={false} className="flex gap-4 flex-col md:flex-row md:flex-wrap min-h-[800px]">
        {menus && selectedDay && menus.restaurants.map((restaurant, idx) => (
          <article key={idx} className="flex-1 md:min-w-[400px]">
            <h2 className="text-xl md:text-3xl text-green underline">
              <a href={restaurant.url} target="_blank" rel="noreferrer">
                {restaurant.name}
              </a>
            </h2>
            {restaurant.dailyMenus?.[selectedDay].length ? (
              <>
                {restaurant.dailyMenus.menu_type === 'buffet' &&
                  restaurant.dailyMenus.buffet_price && (
                    <h3 className="ml-4 mt-2 text-xl">
                      Buffet: {restaurant.dailyMenus.buffet_price}€
                    </h3>
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

export default Menus
