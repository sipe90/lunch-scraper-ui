import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type RestaurantMenus } from './types'
import { Weekday } from './const'
import { getYearAndWeek } from './time-util'

type AppContextType = {
  loading: boolean
  year: number
  week: number
  menus: RestaurantMenus[] | undefined
  selectedDay: Weekday
  setSelectedDay: (day: Weekday) => void
}

const defaultValue: AppContextType = {
  loading: true,
  year: 0,
  week: 0,
  menus: undefined,
  selectedDay: Weekday.MONDAY,
  setSelectedDay: () => undefined,
}

const AppContext = createContext<AppContextType>(defaultValue)

type MenuProviderProps = {
  menus: RestaurantMenus[] | undefined
  loading: boolean
}

export const MenuProvider: FC<PropsWithChildren<MenuProviderProps>> = ({
  menus,
  loading,
  children,
}) => {

  const [selectedDay, setSelectedDay] = useState(Weekday.MONDAY)

  const [year, week] = useMemo(() => getYearAndWeek(), []) 

  return (
    <AppContext.Provider
      value={{
        loading,
        year,
        week,
        menus,
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
