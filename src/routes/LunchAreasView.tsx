import type { FC } from 'react'
import { Link, useRouteLoaderData } from 'react-router'
import Panel from '../components/Panel'
import type { LunchArea } from '../types'

const LunchAreas: FC = () => {
  const menus: LunchArea[] = useRouteLoaderData('areas') ?? []

  return (
    <Panel className="min-h-[800px]">
      <nav className="flex gap-8 flex-wrap">
        {menus.map((area) => (
          <Link key={area.id} className="text-green-dark text-3xl underline" to={`/menus/${area.id}`}>
            {area.name}
          </Link>
        ))}
      </nav>
    </Panel>
  )
}

export default LunchAreas
