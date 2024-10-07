import { type FC } from 'react'
import { useAppContext } from '../app-context'
import DayMenu from '../components/DayMenu'
import { useRouteLoaderData } from 'react-router-dom'
import { Location } from '../types'

const DayMenus: FC = () => {
  const { selectedDay } = useAppContext()

  const location = useRouteLoaderData('location') as Location

  if (location == null) {
    return null
  }

  return (
    <div className="py-4 flex gap-4 flex-col md:flex-row md:flex-wrap">
      {location.restaurants.map((restaurant, idx) => (
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
    </div>
  )
}

export default DayMenus
