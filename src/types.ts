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
  dailyMenus: DailyMenus | null
}

type DailyMenus = {
  [key in Weekday]: {
    dayOfWeek: Weekday
    lunchtimeStart: string | null
    lunchtimeEnd: string | null
    menuType: MenuType
    buffetPrice: number | null
    items: MenuItem[]
  }
}

export type MenuType = 'a_la_carte' | 'buffet'

export type MenuItem = {
  name: string
  description: string | null
  price: number | null
  tags: string[]
}
