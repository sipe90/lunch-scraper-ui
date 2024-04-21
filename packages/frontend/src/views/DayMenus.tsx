import { type FC } from 'react'
import { useAppContext } from '../app-context'
import DayMenu from '../components/DayMenu'

const DayMenus: FC = () => {
  const { loading, getDayMenus, selectedDay } = useAppContext()

  const dayMenus = getDayMenus(selectedDay)

  if (loading || dayMenus == null) {
    return null
  }

  return (
    <div className="py-4 flex gap-4 flex-col md:flex-row md:flex-wrap">
      {dayMenus.map((menu, idx) => (
        <article key={idx} className="flex-1 md:min-w-[400px]">
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
