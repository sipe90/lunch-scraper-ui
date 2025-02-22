import { FC } from 'react'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { LunchArea } from '../types'
import Panel from '../components/Panel'

const LunchAreas: FC = () => {
  const menus = (useRouteLoaderData('areas') as LunchArea[]) ?? []

  return (
    <Panel className="min-h-[800px]">
      <nav className="flex gap-8 flex-wrap">
        {menus.map((area) => (
          <Link
            className="text-green-dark text-3xl underline"
            to={`/menus/${area.id}`}
          >
            {area.name}
          </Link>
        ))}
      </nav>
    </Panel>
  )
}

export default LunchAreas
