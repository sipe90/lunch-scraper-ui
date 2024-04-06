import { type FC } from 'react'
import DayMenu from '../components/DayMenu'
import { useWeekMenus } from '../menu-context'
import { getWeekdayDateString } from '../time-util'

const WeekMenus: FC = () => {
  const { year, week, menus } = useWeekMenus()

  if (menus == null) {
    return null
  }

  return (
    <div className="mt-4 flex flex-col">
      {menus.map((menu, idx) => (
        <div key={idx} className="mt-4">
          <h2 className="text-3xl">
            <a href={menu.url} target="_blank" rel="noreferrer">
              {menu.venue}
            </a>
          </h2>
          {(menu.weekMenu ?? menu.allWeekMenu) && (
            <div className="mt-2 flex flex-wrap">
              {!menu.weeklyOnly &&
                menu.weekMenu?.map((m, idx) => (
                  <DayMenu
                    key={idx}
                    title={getWeekdayDateString(year, week, idx)}
                    menu={m}
                  />
                ))}
              {menu.allWeekMenu && (
                <DayMenu title="Koko viikon annokset" menu={menu.allWeekMenu} />
              )}
            </div>
          )}
          {!menu.weekMenu && !menu.allWeekMenu && (
            <div className="mt-2">Viikon ruokalista ei ole saatavilla</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default WeekMenus
