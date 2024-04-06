import { type FC } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import * as R from 'remeda'

import { getDayOfWeek } from '../time-util'
import { Weekday, weekdayPath } from '../const'
import DayMenus from './DayMenus'
import WeekMenus from './WeekMenus'
import Root from './Root'

const RedirectToday: FC = () => {
  const weekday = getDayOfWeek()
  const path = weekdayPath[weekday] || 'mon'

  return <Navigate to={path} />
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <RedirectToday />,
      },
      ...R.values(Weekday).map((weekday) => ({
        path: `/${weekdayPath[weekday]}`,
        element: <DayMenus weekday={weekday} />,
      })),
      {
        path: '/week',
        element: <WeekMenus />,
      },
      {
        path: '*',
      },
    ],
  },
]

export default routes
