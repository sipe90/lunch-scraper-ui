import { type FC } from 'react'
import { type Weekday } from '../const'
import { useWeekMenus } from '../menu-context'
import DayMenu from '../components/DayMenu'

type DayMenusProps = {
  weekday: Weekday
}

const DayMenus: FC<DayMenusProps> = ({ weekday }) => {
  const { getDayMenus } = useWeekMenus()

  const dayMenus = getDayMenus(weekday)

  if (dayMenus == null) {
    return null
  }

  return (
    <div className="py-4 flex flex-col gap-4">
      {dayMenus.map((menu, idx) => (
        <article key={idx}>
          <h2 className="text-xl md:text-3xl text-green underline">
            <a href={menu.url} target="_blank" rel="noreferrer">
              {menu.venue}
            </a>
          </h2>
          {menu.dayMenu?.length ? (
            <>
              {menu.buffet && (
                <h3 className="ml-4 mt-2 text-xl">
                  Seisova pöytä: {menu.buffetPrice}
                </h3>
              )}
              <div className="mt-2 flex flex-wrap">
                <DayMenu menu={menu.dayMenu} />
              </div>
            </>
          ) : null}
          {!menu.dayMenu?.length && (
            <div className="mt-2">Päivän ruokalista ei ole saatavilla</div>
          )}
        </article>
      ))}
    </div>
  )
}

export default DayMenus
