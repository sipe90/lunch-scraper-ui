import clsx from 'clsx'
import type { FC } from 'react'
import * as R from 'remeda'
import type { Weekday } from '../types'

type Props = {
  selectedDay?: Weekday
  setSelectedDay: (w: Weekday) => void
}

type Labels = {
  short: string
  medium: string
  long: string
}

const days = {
  monday: { short: 'Mo', medium: 'Mon', long: 'Monday' },
  tuesday: { short: 'Tu', medium: 'Tue', long: 'Tuesday' },
  wednesday: { short: 'We', medium: 'Wed', long: 'Wednesday' },
  thursday: { short: 'Th', medium: 'Thu', long: 'Thursday' },
  friday: { short: 'Fr', medium: 'Fri', long: 'Friday' },
} as const

const MenuNavigation: FC<Props> = ({ selectedDay, setSelectedDay }) => {
  return (
    <ul className="flex gap-1 flex-row text-xl font-semibold drop-shadow-md">
      {R.pipe(
        days,
        R.entries(),
        R.map(([weekday, labels]) => (
          <DayLink
            key={weekday}
            weekday={weekday}
            isSelected={selectedDay === weekday}
            labels={labels}
            onSelect={setSelectedDay}
          />
        )),
      )}
    </ul>
  )
}

type DayLinkProps = {
  weekday: Weekday
  labels: Labels
  isSelected: boolean
  onSelect: (selected: Weekday) => void
}

const DayLink: FC<DayLinkProps> = ({ weekday, isSelected, onSelect, labels }) => {
  return (
    <li className="flex-1 min-w-4">
      <button
        type="button"
        className={clsx(
          'w-full px-1 py-2 md:p-2 text-3xl md:text-4xl rounded-t-2xl text-center font-medium truncate text-clip hover:cursor-pointer',
          isSelected ? 'bg-slate-50 text-green-light' : 'bg-slate-200 text-green',
        )}
        aria-label={`Select ${labels.long}`}
        onClick={() => onSelect(weekday)}
      >
        <span className="md:hidden">{labels.short}</span>
        <span className="hidden md:inline xl:hidden">{labels.medium}</span>
        <span className="hidden xl:inline">{labels.long}</span>
      </button>
    </li>
  )
}

export default MenuNavigation
