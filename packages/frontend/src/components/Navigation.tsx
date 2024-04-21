import { type FC } from 'react'
import clsx from 'clsx'
import { Weekday } from '../const'
import { useAppContext } from '../app-context'

const NavBar: FC = () => {
  const { selectedDay, setSelectedDay } = useAppContext()

  return (
    <ul className="flex gap-1 flex-row text-xl font-semibold drop-shadow-md">
      <DayLink
        weekday={Weekday.MONDAY}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
      <DayLink
        weekday={Weekday.TUESDAY}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
      <DayLink
        weekday={Weekday.WEDNESSDAY}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
      <DayLink
        weekday={Weekday.THURSDAY}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
      <DayLink
        weekday={Weekday.FRIDAY}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
    </ul>
  )
}

type DayLinkProps = {
  weekday: Weekday
  selectedDay: Weekday
  onSelect: (selected: Weekday) => void
}

const DayLink: FC<DayLinkProps> = ({ weekday, selectedDay, onSelect }) => {
  const isSelected = weekday === selectedDay
  return (
    <li className="flex-1 min-w-4">
      <a
        className={clsx(
          'block px-1 py-2 md:p-2 text-2xl rounded-t-2xl text-center font-medium truncate text-clip hover:cursor-pointer',
          {
            'bg-slate-50 text-green-light': isSelected,
            'bg-slate-200 text-green': !isSelected,
            "before:content-['Ma'] lg:before:content-['Maanantai']":
              weekday === Weekday.MONDAY,
            "before:content-['Ti'] lg:before:content-['Tiistai']":
              weekday === Weekday.TUESDAY,
            "before:content-['Ke'] lg:before:content-['Keskiviikko']":
              weekday === Weekday.WEDNESSDAY,
            "before:content-['To'] lg:before:content-['Torstai']":
              weekday === Weekday.THURSDAY,
            "before:content-['Pe'] lg:before:content-['Perjantai']":
              weekday === Weekday.FRIDAY,
          }
        )}
        onClick={() => {
          onSelect(weekday)
        }}
      ></a>
    </li>
  )
}

export default NavBar
