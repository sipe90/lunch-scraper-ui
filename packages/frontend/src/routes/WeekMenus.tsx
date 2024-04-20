import { type FC } from 'react'
import DayMenu from '../components/DayMenu'
import { useWeekMenus } from '../menu-context'
import { getWeekdayDateString } from '../time-util'

const WeekMenus: FC = () => {
  const { year, week, menus } = useWeekMenus()

  if (!menus) {
    return null
  }

  return (
    <div className="flex flex-col">
      {menus.map((menu, idx) => (
        <article key={idx} className="mt-4">
          <h2 className="text-xl md:text-3xl text-green underline">
            <a href={menu.url} target="_blank" rel="noreferrer">
              {menu.venue}
            </a>
          </h2>
          {menu.buffet && (
            <h3 className="ml-4 mt-2 text-xl">
              Seisova pöytä: {menu.buffetPrice}
            </h3>
          )}
          {(menu.weekMenu ?? menu.allWeekMenu) && (
            <div className="mt-2 flex flex-wrap">
              {!menu.weeklyOnly &&
                menu.weekMenu?.length &&
                menu.weekMenu.map((m, idx) =>
                  m.length ? (
                    <DayMenu
                      key={idx}
                      title={getWeekdayDateString(year, week, idx)}
                      menu={m}
                    />
                  ) : (
                    <div key={idx}>Päivän ruokalista ei ole saatavilla</div>
                  )
                )}
              {menu.allWeekMenu && (
                <DayMenu title="Koko viikon annokset" menu={menu.allWeekMenu} />
              )}
            </div>
          )}
          {!menu.weekMenu && !menu.allWeekMenu && (
            <div className="mt-2">Viikon ruokalista ei ole saatavilla</div>
          )}
        </article>
      ))}
    </div>
  )
}

export default WeekMenus
