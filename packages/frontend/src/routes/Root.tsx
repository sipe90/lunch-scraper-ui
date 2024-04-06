import { type FC, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { type Menus } from '../types'
import { MenuProvider } from '../menu-context'

const Root: FC = () => {
  const [menus, setMenus] = useState<Menus | undefined>(undefined)

  useEffect(() => {
    fetch('/api/menus')
      .then(async (res) => res.json())
      .then((m: Menus) => {
        setMenus(m)
      })
      .catch(console.error)
  }, [])

  if (menus == null) {
    return null
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <nav>
        <NavBar />
      </nav>
      <main className="mt-6">
        <MenuProvider allMenus={menus}>
          <Outlet />
        </MenuProvider>
      </main>
    </div>
  )
}

export default Root
