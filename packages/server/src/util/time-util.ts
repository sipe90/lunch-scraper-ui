import * as dateFns from 'date-fns'
import * as R from 'remeda'
import { type Weekday } from '../menu-service.js'

export const parseIsoDate = (dateStr: string): Date => dateFns.parseISO(dateStr)

export const getYearAndWeek = (date: Date = new Date()): [number, number] => [
  getIsoYear(date),
  getIsoWeek(date),
]

export const getIsoDateStr = (date: Date = new Date()): string =>
  dateFns.formatISO(date)

export const getIsoYear = (date: Date = new Date()): number =>
  dateFns.getISOWeekYear(date)

export const getIsoWeek = (date: Date = new Date()): number =>
  dateFns.getISOWeek(date)

export const getWeekday = (date: Date = new Date()): Weekday =>
  dateFns.getISODay(date) - 1

export const getWeekdayDate = (weekday: Weekday, date: Date = new Date()) =>
  dateFns.setDay(date, weekday + 1)

export const getWeekdayDates = (date: Date = new Date()) =>
  R.times(5, (w: Weekday) => getWeekdayDate(w, date))

export const getShortDateStr = (date: Date = new Date()): string =>
  dateFns.format(date, 'd.M')
