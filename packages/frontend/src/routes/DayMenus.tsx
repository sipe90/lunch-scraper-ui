import { type FC } from 'react'
import { type Weekday } from '../const'
import { useWeekMenus } from '../menu-context'
import DayMenu from '../components/DayMenu'
import { getWeekdayDateString } from '../time-util'

type DayMenusProps = {
  weekday: Weekday
}

const DayMenus: FC<DayMenusProps> = ({ weekday }) => {
  const { year, week, getDayMenus } = useWeekMenus()

  const dayMenus = getDayMenus(weekday)

  if (dayMenus == null) {
    return null
  }

  return (
    <>
      <h1 className="text-4xl">{getWeekdayDateString(year, week, weekday)}</h1>
      <div className="mt-4 flex flex-col">
        {dayMenus.map((menu, idx) => (
          <div key={idx} className="mt-4">
            <h2 className="text-3xl">
              <a href={menu.url} target="_blank" rel="noreferrer">
                {menu.venue}
              </a>
            </h2>
            {menu.dayMenu && (
              <>
                {menu.buffet && (
                  <h3 className="mt-2 text-xl">
                    Seisova pöytä: {menu.buffetPrice}
                  </h3>
                )}
                <div className="mt-2 flex flex-wrap">
                  <DayMenu menu={menu.dayMenu} />
                </div>
              </>
            )}
            {!menu.dayMenu?.length && (
              <div className="mt-2">Päivän ruokalista ei ole saatavilla</div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default DayMenus
