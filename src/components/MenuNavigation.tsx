import clsx from 'clsx'
import type { FC } from 'react'
import type { Weekday } from '../types'

type Props = {
  selectedDay?: Weekday
  setSelectedDay: (w: Weekday) => void
}

const MenuNavigation: FC<Props> = ({ selectedDay, setSelectedDay }) => {
  return (
    <ul className="flex gap-1 flex-row text-xl font-semibold drop-shadow-md">
      <DayLink weekday={'monday'} selectedDay={selectedDay} onSelect={setSelectedDay} />
      <DayLink weekday={'tuesday'} selectedDay={selectedDay} onSelect={setSelectedDay} />
      <DayLink weekday={'wednesday'} selectedDay={selectedDay} onSelect={setSelectedDay} />
      <DayLink weekday={'thursday'} selectedDay={selectedDay} onSelect={setSelectedDay} />
      <DayLink weekday={'friday'} selectedDay={selectedDay} onSelect={setSelectedDay} />
    </ul>
  )
}

type DayLinkProps = {
  weekday: Weekday
  selectedDay?: Weekday
  onSelect: (selected: Weekday) => void
}

const DayLink: FC<DayLinkProps> = ({ weekday, selectedDay, onSelect }) => {
  const isSelected = weekday === selectedDay
  return (
    <li className="flex-1 min-w-4">
      <button
        type="button"
        className={clsx(
          'block px-1 py-2 md:p-2 text-3xl md:text-4xl rounded-t-2xl text-center font-medium truncate text-clip hover:cursor-pointer',
          {
            'bg-slate-50 text-green-light': isSelected,
            'bg-slate-200 text-green': !isSelected,
            "before:content-['Mo'] md:before:content-['Mon'] xl:before:content-['Monday']": weekday === 'monday',
            "before:content-['Tu'] md:before:content-['Tue'] xl:before:content-['Tuesday']": weekday === 'tuesday',
            "before:content-['We'] md:before:content-['Wed'] xl:before:content-['Wednesday']": weekday === 'wednesday',
            "before:content-['Th'] md:before:content-['Thu'] xl:before:content-['Thursday']": weekday === 'thursday',
            "before:content-['Fr'] md:before:content-['Fri'] xl:before:content-['Friday']": weekday === 'friday',
          },
        )}
        aria-label={`Select ${weekday}`}
        onClick={() => {
          onSelect(weekday)
        }}
      />
    </li>
  )
}

export default MenuNavigation
