import React, { useEffect, useState } from 'react'
import { type FC } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import { type Menus } from './types'
import { MenuProvider } from './menu-context'

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

const App: FC = () => {
  const [menus, setMenus] = useState<Menus | undefined>(undefined)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/menus`)
      .then(async (res) => res.json())
      .then((m: Menus) => {
        setMenus(m)
      })
      .catch(console.error)
  }, [])

  return (
    <React.StrictMode>
      <MenuProvider allMenus={menus}>
        <RouterProvider router={router} />
      </MenuProvider>
    </React.StrictMode>
  )
}

export default App
