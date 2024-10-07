import { type FC } from 'react'
import { useAppContext } from '../app-context'
import DayMenu from '../components/DayMenu'

const DayMenus: FC = () => {
  const { loading, menus, selectedDay } = useAppContext()

  if (loading || menus == undefined) {
    return null
  }

  return (
    <div className="py-4 flex gap-4 flex-col md:flex-row md:flex-wrap">
      {menus.map((menu, idx) => (
        <article key={idx} className="flex-1 md:min-w-[400px]">
          <h2 className="text-xl md:text-3xl text-green underline">
            <a href={menu.url} target="_blank" rel="noreferrer">
              {menu.name}
            </a>
          </h2>
          {menu.dailyMenus?.[selectedDay].length ? (
            <>
              {menu.dailyMenus.menu_type === 'buffet' && menu.dailyMenus.buffet_price && (
                <h3 className="ml-4 mt-2 text-xl">
                  Seisova pöytä: {menu.dailyMenus.buffet_price}€
                </h3>
              )}
              <div className="mt-2 flex flex-wrap">
                <DayMenu items={menu.dailyMenus[selectedDay]} />
              </div>
            </>
          ) : <div className="mt-2">Päivän ruokalista ei ole saatavilla</div>}
        </article>
      ))}
    </div>
  )
}

export default DayMenus
