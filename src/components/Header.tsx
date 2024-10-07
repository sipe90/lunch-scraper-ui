import { type FC } from 'react'
import { getWeekDateRangeString } from '../time-util'
import { useAppContext } from '../app-context'

const Header: FC = () => {
  const { loading, year, week } = useAppContext()

  return (
    <h1 className="text-green-dark font-semibold text-xl md:text-4xl">
      Järvenpään lounaat{' '}
      {!loading && (
        <span className="text-nowrap">
          {getWeekDateRangeString(year, week)}
        </span>
      )}
    </h1>
  )
}

export default Header
