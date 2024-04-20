import { type FC } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useWeekMenus } from '../menu-context'
import { getWeekDateRangeString } from '../time-util'
import cutlery from '../../assets/cutlery.png'

const Root: FC = () => {
  const { year, week, menus } = useWeekMenus()

  if (!menus) {
    return null
  }

  return (
    <div className="md:px-6 max-w-[1440px] mx-auto">
      <header className="px-4 md:px-20 py-2 md:py-6 border-2 border-gray-50">
        <h1 className="text-green-dark font-semibold text-xl md:text-4xl">
          Järvenpään lounaat{' '}
          <span className="text-nowrap">
            {getWeekDateRangeString(year, week)}
          </span>
        </h1>
      </header>
      <div className="px-4 md:px-20 py-4 md:py-8 bg-backgound bg-contain">
        <nav>
          <NavBar />
        </nav>
        <main className="px-6 md:px-12 bg-slate-50 rounded-b-2xl drop-shadow-md">
          <Outlet />
        </main>
      </div>
      <footer className="py-4 flex flex-row justify-center border-2 border-gray-50">
        <div>
          <img src={cutlery} className="size-9" />
        </div>
      </footer>
    </div>
  )
}

export default Root
