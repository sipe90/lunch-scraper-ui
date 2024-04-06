export enum Weekday {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESSDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
}

export const weekdayPath: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'mon',
  [Weekday.TUESDAY]: 'tue',
  [Weekday.WEDNESSDAY]: 'wed',
  [Weekday.THURSDAY]: 'thu',
  [Weekday.FRIDAY]: 'fri',
}
