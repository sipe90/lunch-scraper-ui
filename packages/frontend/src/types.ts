export type Menus = {
  year: number
  week: number
  menus: WeekMenu[]
}

export type WeekMenu = {
  venue: string
  url: string
  weeklyOnly: boolean
  buffet: boolean
  buffetPrice: string | undefined
  weekMenu: WeekMenuArray | undefined
  allWeekMenu: MenuItem[] | undefined
}

export type WeekMenuArray = [
  MenuItem[],
  MenuItem[],
  MenuItem[],
  MenuItem[],
  MenuItem[],
]

export type DayMenu = {
  venue: string
  url: string
  buffet: boolean
  buffetPrice: string | undefined
  dayMenu: MenuItem[] | undefined
}

export type MenuItem = {
  name: string
  price: string | undefined
  description: string | undefined
}
