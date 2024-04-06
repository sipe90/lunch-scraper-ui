import { type FC } from 'react'
import { Link } from 'react-router-dom'

const NavBar: FC = () => {
  return (
    <ul className="mt-4 max-w-[800px] flex flex-row flex-wrap text-xl font-semibold">
      <NavLink path="/mon" text="Maanantai" />
      <NavLink path="/tue" text="Tiistai" />
      <NavLink path="/wed" text="Keskiviikko" />
      <NavLink path="/thu" text="Torstai" />
      <NavLink path="/fri" text="Perjantai" />
      <NavLink path="/week" text="Koko viikko" />
    </ul>
  )
}

type NavLinkProps = {
  path: string
  text: string
}

const NavLink: FC<NavLinkProps> = ({ path, text }) => {
  return (
    <li className="flex-1 min-w-24">
      <Link to={path}>{text}</Link>
    </li>
  )
}

export default NavBar
