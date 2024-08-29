import { getIsoYear, getIsoWeek } from './util/time-util.js'

export enum Weekday {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESSDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
}

export type Menus = {
  year: number
  week: number
  menus: Menu[]
}

export type Menu = {
  venue: string
  url: string
  weeklyOnly: boolean
  buffet: boolean
  buffetPrice?: string
  weekMenu?: WeekMenuArray
  allWeekMenu?: MenuItem[]
}

export type WeekMenuArray = [
  MenuItem[],
  MenuItem[],
  MenuItem[],
  MenuItem[],
  MenuItem[],
]

export type MenuItem = {
  name: string
  price?: string
  description?: string
  diets?: string[]
}

let menus: Menus = { year: getIsoYear(), week: getIsoWeek(), menus: [] }

export const getMenus = (): Menus => {
  return menus
}

export const saveMenus = (newMenus: Menus): void => {
  menus = newMenus
}
