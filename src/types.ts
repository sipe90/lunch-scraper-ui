import { Weekday } from "./const"

export interface RestaurantMenus {
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

export interface DailyMenus extends WeekdayMenus {
  menu_type: MenuType
  buffet_price: number | null
}

export type MenuType = 'a_la_carte' | 'buffet'

export interface MenuItem {
  name: string
  description: string | null
  price: number | null
  diets: string[]
}
