import * as dateFns from 'date-fns'
import { Weekday } from './const'

export const getYearAndWeek = (date: Date = new Date()): [number, number] => {
  return [getYear(date), getWeek(date)]
}

export const getIsoDateStr = (date: Date = new Date()): string => {
  return dateFns.formatISO(date)
}

export const getYear = (date: Date = new Date()): number =>
  dateFns.getISOWeekYear(date)

export const getWeek = (date: Date = new Date()): number =>
  dateFns.getISOWeek(date)

export const getDayOfWeek = (date: Date = new Date()): Weekday | undefined => {
  const day = dateFns.getISODay(date) - 1
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  return day <= Weekday.FRIDAY ? day : undefined
}

export const getWeekdayDate = (
  year: number,
  week: number,
  weekday: Weekday
): Date => {
  const weekDate = dateFns.parse(
    `${year.toString(10)} ${week.toString(10)}`,
    'R I',
    new Date()
  )
  const weekDayDate = dateFns.setISODay(weekDate, weekday + 1)

  return weekDayDate
}

export const getWeekdayDateString = (
  year: number,
  week: number,
  weekday: Weekday
): string => {
  const weekDayDate = getWeekdayDate(year, week, weekday)
  const dateStr = dateFns.format(weekDayDate, 'cccc d.M')

  return dateStr.charAt(0).toLocaleUpperCase() + dateStr.slice(1)
}

export const getWeekDateRangeString = (year: number, week: number): string => {
  const mondayDate = getWeekdayDate(year, week, Weekday.MONDAY)
  const fridayDate = getWeekdayDate(year, week, Weekday.FRIDAY)

  return (
    dateFns.format(mondayDate, 'dd.-') +
    dateFns.format(fridayDate, 'dd.MM.yyyy')
  )
}
