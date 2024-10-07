import { type FC } from 'react'
import { getWeekDateRangeString } from '../time-util'
import { useAppContext } from '../app-context'
import { useRouteLoaderData } from 'react-router-dom'
import { Location } from '../types'

const Header: FC = () => {
  const { year, week } = useAppContext()

  const location = useRouteLoaderData('location') as Location

  return (
    <h1 className="text-green-dark font-semibold text-xl md:text-4xl">
      {location != null ? (
        <>
          <span>{location.name} lunches in week </span>
          <span className="text-nowrap">
            {getWeekDateRangeString(year, week)}
          </span>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </h1>
  )
}

export default Header
