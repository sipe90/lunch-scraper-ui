import { useLoaderData } from '@tanstack/react-router'
import { type FC, useEffect, useState } from 'react'
import MenuNavigation from '../components/MenuNavigation'
import Panel from '../components/Panel'
import RestaurantDayMenu from '../components/RestaurantDayMenu'
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
            <RestaurantDayMenu key={restaurant.name} restaurant={restaurant} selectedDay={selectedDay} />
          ))}
      </Panel>
    </>
  )
}

export default MenusView
