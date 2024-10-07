import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Weekday } from './const'
import { getYearAndWeek } from './time-util'

type AppContextType = {
  year: number
  week: number
  selectedDay: Weekday
  setSelectedDay: (day: Weekday) => void
}

const defaultValue: AppContextType = {
  year: 0,
  week: 0,
  selectedDay: Weekday.MONDAY,
  setSelectedDay: () => undefined,
}

const AppContext = createContext<AppContextType>(defaultValue)

export const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(Weekday.MONDAY)

  const [year, week] = useMemo(() => getYearAndWeek(), [])

  return (
    <AppContext.Provider
      value={{
        year,
        week,
        selectedDay,
        setSelectedDay,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
