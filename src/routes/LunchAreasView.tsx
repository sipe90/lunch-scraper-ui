import { Link, useLoaderData } from '@tanstack/react-router'
import type { FC } from 'react'
import Panel from '../components/Panel'

const LunchAreas: FC = () => {
  const menus = useLoaderData({ from: '/menus' })

  return (
    <Panel className="min-h-[800px]">
      <nav className="flex gap-8 flex-wrap">
        {menus.map((area) => (
          <Link
            key={area.id}
            className="text-green-dark text-3xl underline"
            to="/menus/$areaId"
            params={{ areaId: area.id }}
          >
            {area.name}
          </Link>
        ))}
      </nav>
    </Panel>
  )
}

export default LunchAreas
