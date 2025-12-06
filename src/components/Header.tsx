import { type FC, useMemo } from 'react'
import { useRouteLoaderData } from 'react-router'
import { getWeekDateRangeString, getYearAndWeek } from '../time-util'
import type { Menus } from '../types'

const Header: FC = () => {
  const location: Menus | undefined = useRouteLoaderData('menus')

  const weekDateRange = useMemo(() => {
    const [year, week] = getYearAndWeek()
    return getWeekDateRangeString(year, week)
  }, [])

  return (
    <h1 className="text-green-dark font-semibold text-xl md:text-4xl">
      {location ? (
        <>
          <span>{location.lunchArea.name} lunches in week </span>
          <span className="text-nowrap">{weekDateRange}</span>
        </>
      ) : (
        <span>LunchScraper</span>
      )}
    </h1>
  )
}

export default Header
