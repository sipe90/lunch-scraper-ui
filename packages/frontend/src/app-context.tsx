import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import { type MenuItem, type DayMenu, type WeekMenu, type Menus } from './types'
import { Weekday } from './const'

type AppContextType = {
  loading: boolean
  year: number
  week: number
  menus: WeekMenu[] | undefined
  selectedDay: Weekday
  setSelectedDay: (day: Weekday) => void
  getDayMenus: (day: Weekday) => DayMenu[] | undefined
}

const defaultValue: AppContextType = {
  loading: true,
  year: 0,
  week: 0,
  menus: undefined,
  selectedDay: Weekday.MONDAY,
  setSelectedDay: () => undefined,
  getDayMenus: () => undefined,
}

const AppContext = createContext<AppContextType>(defaultValue)

type MenuProviderProps = {
  allMenus: Menus | undefined
  loading: boolean
}

export const MenuProvider: FC<PropsWithChildren<MenuProviderProps>> = ({
  allMenus,
  loading,
  children,
}) => {
  const { year = 0, week = 0, menus } = allMenus ?? {}

  const [selectedDay, setSelectedDay] = useState(Weekday.MONDAY)

  const getDayMenus = useCallback(_getDayMenus(menus), [menus])

  return (
    <AppContext.Provider
      value={{
        loading,
        year,
        week,
        menus,
        selectedDay,
        setSelectedDay,
        getDayMenus,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}

const _getDayMenus =
  (menus: WeekMenu[] | undefined) =>
  (weekday: Weekday): DayMenu[] | undefined => {
    if (menus == undefined) {
      return undefined
    }

    return menus.map(
      ({ venue, url, buffet, buffetPrice, weekMenu, allWeekMenu }) => ({
        venue,
        url,
        buffet,
        buffetPrice,
        dayMenu: _getDayMenu(
          weekMenu ? weekMenu[weekday] : undefined,
          allWeekMenu
        ),
      })
    )
  }

const _getDayMenu = (
  weekdayMenu: MenuItem[] | undefined,
  allWeekMenu: MenuItem[] | undefined
) => {
  if (weekdayMenu == undefined && allWeekMenu == undefined) return undefined
  if (weekdayMenu == undefined) return allWeekMenu
  if (allWeekMenu == undefined) return weekdayMenu
  return weekdayMenu.concat(allWeekMenu)
}
