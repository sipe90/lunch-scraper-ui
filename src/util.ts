import * as dateFns from 'date-fns'
import { fi } from "date-fns/locale"
import { MenuItem, WeekMenuArray, Weekday } from './menu-service.js'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as R from 'remeda'

export const filename = (metaUrl: string) => fileURLToPath(metaUrl)

export const dirname = (filename: string) => path.dirname(filename)

export const getYearAndWeek = (date: Date = new Date()): [number, number] => {
    return [
        dateFns.getISOWeekYear(date),
        getWeek(date)
    ]
}

export const getWeek = (date: Date = new Date()) => {
    return dateFns.getISOWeek(date)
}

export const getWeekdayDate = (year: number, week: number, weekday: Weekday): Date => {
    const weekDate = dateFns.parse(`${year.toString(10)} ${week.toString(10)}`, 'R I', new Date(), { weekStartsOn: 1, locale: fi })
    const weekDayDate = dateFns.setISODay(weekDate, weekday + 1)

    return weekDayDate
}

export const getWeekdayDateString = (year: number, week: number, weekday: Weekday): string => {
    const weekDayDate = getWeekdayDate(year, week, weekday)
    const dateStr = dateFns.format(weekDayDate, 'cccc d.M', { weekStartsOn: 1, locale: fi })

    return dateStr.charAt(0).toLocaleUpperCase() + dateStr.slice(1)
}

export const clampWeekMenu = (weekMenu?: MenuItem[][]): WeekMenuArray => {
    if (!weekMenu) {
        return [[], [], [], [], []]
    }
    if (weekMenu.length < 5) {
        return weekMenu.concat(...R.range(0, 5 - weekMenu.length).map(() => [])) as WeekMenuArray
    }
    if (weekMenu.length > 5) {
        return weekMenu.slice(0, 5) as WeekMenuArray
    }
    return weekMenu as WeekMenuArray
}
