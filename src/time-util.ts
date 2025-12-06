import * as dateFns from 'date-fns'
import type { Weekday } from './types'

export const getYearAndWeek = (date: Date = new Date()): [number, number] => {
  return [getYear(date), getWeek(date)]
}

export const getIsoDateStr = (date: Date = new Date()): string => {
  return dateFns.formatISO(date)
}

export const getYear = (date: Date = new Date()): number => dateFns.getISOWeekYear(date)

export const getWeek = (date: Date = new Date()): number => dateFns.getISOWeek(date)

export const getDayOfWeek = (date: Date = new Date()): Weekday => {
  return isoDayToWeekday(dateFns.getISODay(date))
}

export const getWeekdayDate = (year: number, week: number, weekday: Weekday): Date => {
  const weekDate = dateFns.parse(`${year.toString(10)} ${week.toString(10)}`, 'R I', new Date())
  const weekDayDate = dateFns.setISODay(weekDate, weekdayToIsoDay(weekday))

  return weekDayDate
}

export const getWeekdayDateString = (year: number, week: number, weekday: Weekday): string => {
  const weekDayDate = getWeekdayDate(year, week, weekday)
  const dateStr = dateFns.format(weekDayDate, 'cccc d.M')

  return dateStr.charAt(0).toLocaleUpperCase() + dateStr.slice(1)
}

export const getWeekDateRangeString = (year: number, week: number): string => {
  const mondayDate = getWeekdayDate(year, week, 'monday')
  const fridayDate = getWeekdayDate(year, week, 'friday')

  return dateFns.format(mondayDate, 'dd.-') + dateFns.format(fridayDate, 'dd.MM.yyyy')
}

const isoDayToWeekday = (isoDay: number): Weekday => {
  switch (isoDay) {
    case 1:
      return 'monday'
    case 2:
      return 'tuesday'
    case 3:
      return 'wednesday'
    case 4:
      return 'thursday'
    case 5:
      return 'friday'
    case 6:
      return 'saturday'
    case 7:
      return 'sunday'
    default:
      throw Error(`Invalid iso day: ${isoDay}`)
  }
}

const weekdayToIsoDay = (weekday: Weekday): number => {
  switch (weekday) {
    case 'monday':
      return 1
    case 'tuesday':
      return 2
    case 'wednesday':
      return 3
    case 'thursday':
      return 4
    case 'friday':
      return 5
    case 'saturday':
      return 6
    case 'sunday':
      return 7
    default:
      throw Error(`Invalid weekday`)
  }
}
