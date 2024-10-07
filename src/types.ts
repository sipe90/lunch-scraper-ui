/* eslint-disable @typescript-eslint/ban-types */
import { type Weekday } from "./const"

export type RestaurantMenus = {
  name: string
  url: string
  location: string | null
  lunchtimeStart: string | null
  lunchtimeEnd: string | null
  dailyMenus: DailyMenus | null
}

type WeekdayMenus = {
  [key in Weekday]: MenuItem[]
}

export type DailyMenus = {
  menu_type: MenuType
  buffet_price: number | null
} & WeekdayMenus

export type MenuType = 'a_la_carte' | 'buffet'

export type MenuItem = {
  name: string
  description: string | null
  price: number | null
  diets: string[]
}
