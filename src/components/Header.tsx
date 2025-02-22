import { useMemo, type FC } from 'react'
import { getWeekDateRangeString, getYearAndWeek } from '../time-util'
import { useRouteLoaderData } from 'react-router-dom'
import { Menus } from '../types'


const Header: FC = () => {
  const location = useRouteLoaderData('menus') as Menus | undefined

  const weekDateRange = useMemo(() => { 
    const [year, week] = getYearAndWeek()
    return getWeekDateRangeString(year, week)
  }, [])

  return (
    <h1 className="text-green-dark font-semibold text-xl md:text-4xl">
      {location ? (
        <>
          <span>{location.lunchArea.name} lunches in week </span>
          <span className="text-nowrap">
            {weekDateRange}
          </span>
        </>
      ) : (
        <span>LunchScraper</span>
      )}
    </h1>
  )
}

export default Header
