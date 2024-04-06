import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from 'react'
import { type MenuItem, type DayMenu, type WeekMenu, type Menus } from './types'
import { type Weekday } from './const'

type MenuContextType = {
  year: number
  week: number
  menus: WeekMenu[] | undefined
  getDayMenus: (day: Weekday) => DayMenu[] | undefined
}

const defaultValue: MenuContextType = {
  year: 0,
  week: 0,
  menus: undefined,
  getDayMenus: () => undefined,
}

const MenuContext = createContext<MenuContextType>(defaultValue)

type MenuProviderProps = {
  allMenus: Menus | undefined
}

export const MenuProvider: FC<PropsWithChildren<MenuProviderProps>> = ({
  allMenus,
  children,
}) => {
  const { year = 0, week = 0, menus } = allMenus ?? {}

  const getDayMenus = useCallback(_getDayMenus(menus), [menus])

  return (
    <MenuContext.Provider value={{ year, week, menus, getDayMenus }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useWeekMenus = () => {
  return useContext(MenuContext)
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
