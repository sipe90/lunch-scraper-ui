import { addDays, format, getWeek, startOfWeek } from 'date-fns'
import { Menu, MenuItem } from './menu-service.js'

const WEEKDAYS = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai']

export const generateTemplateVars = (menus: Menu[]) => {
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 })
    const weekDates = WEEKDAYS.map((day, i) => `${day} ${format(addDays(startOfWeek(new Date()), i), "d.M")}`)

    return { menus, weekDates, currentWeek }
}

export const clampWeekMenu = (weekMenu: MenuItem[][]) => {
    if (weekMenu.length < 5) {
        return weekMenu.concat(...Array(5 - weekMenu.length).map(() => []))
    }
    if (weekMenu.length > 5) {
        return weekMenu.slice(0, 4)
    }
    return weekMenu
}
