import { type FC } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { Weekday } from '../const'

const NavBar: FC = () => {
  return (
    <ul className="flex gap-1 flex-row text-xl font-semibold drop-shadow-md">
      <Link path="/mon" weekday={Weekday.MONDAY} />
      <Link path="/tue" weekday={Weekday.TUESDAY} />
      <Link path="/wed" weekday={Weekday.WEDNESSDAY} />
      <Link path="/thu" weekday={Weekday.THURSDAY} />
      <Link path="/fri" weekday={Weekday.FRIDAY} />
      <Link path="/week" weekday="WEEK" />
    </ul>
  )
}

type NavLinkProps = {
  path: string
  weekday: Weekday | 'WEEK'
}

const Link: FC<NavLinkProps> = ({ path, weekday }) => {
  return (
    <li className="flex-1 min-w-4">
      <NavLink to={path}>
        {({ isActive }) => (
          <div
            className={clsx(
              'px-1 py-2 md:p-2 text-2xl rounded-t-2xl text-center font-medium truncate text-clip',
              {
                'bg-slate-50 text-green-light': isActive,
                'bg-slate-200 text-green': !isActive,
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
                "before:content-['Vk'] lg:before:content-['Koko_viikko']":
                  weekday === 'WEEK',
              }
            )}
          ></div>
        )}
      </NavLink>
    </li>
  )
}

export default NavBar
