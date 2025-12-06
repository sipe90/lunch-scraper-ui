export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Menus = {
  lunchArea: LunchArea
  restaurants: Restaurant[]
}

export type LunchArea = {
  id: string
  name: string
}

export type Restaurant = {
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
