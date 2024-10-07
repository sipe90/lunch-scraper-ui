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

export const getDayOfWeek = (date: Date = new Date()): Weekday => {
  return isoDayToWeekday(dateFns.getISODay(date))
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
  const weekDayDate = dateFns.setISODay(weekDate, weekdayToIsoDay(weekday))

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

const isoDayToWeekday = (isoDay: number): Weekday => {
  switch(isoDay) {
    case 1: return Weekday.MONDAY
    case 2: return Weekday.TUESDAY
    case 3: return Weekday.WEDNESDAY
    case 4: return Weekday.THURSDAY
    case 5: return Weekday.FRIDAY
    case 6: return Weekday.SATURDAY
    case 7: return Weekday.SUNDAY
    default: throw Error(`Invalid iso day: ${isoDay}`)
  }
}

const weekdayToIsoDay = (weekday: Weekday): number => {
  switch(weekday) {
    case Weekday.MONDAY: return 1
    case Weekday.TUESDAY: return 2
    case Weekday.WEDNESDAY: return 3
    case Weekday.THURSDAY: return 4 
    case Weekday.FRIDAY: return 5
    case Weekday.SATURDAY: return 6
    case Weekday.SUNDAY: return 7
  }
}