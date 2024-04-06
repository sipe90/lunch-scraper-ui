import * as dateFns from 'date-fns'

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
