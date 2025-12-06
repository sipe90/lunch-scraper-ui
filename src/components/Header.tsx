import { useRouterState } from '@tanstack/react-router'
import { type FC, useMemo } from 'react'
import { getWeekDateRangeString, getYearAndWeek } from '../time-util'

const Header: FC = () => {
  const menusMatch = useRouterState({
    select: (state) => state.matches.find((match) => match.routeId === '/menus/$areaId'),
  })
  const location = menusMatch?.loaderData

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
