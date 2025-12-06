import { setDefaultOptions } from 'date-fns'
import { fi } from 'date-fns/locale'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import './index.css'
import LunchAreasView from './routes/LunchAreasView'
import MenusView from './routes/MenusView'
import Root from './routes/Root'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '',
          element: <Navigate to="/menus" replace={true} />,
        },
        {
          id: 'areas',
          path: '/menus',
          loader: async (): Promise<Response> => fetch(`${import.meta.env.BASE_URL}api/areas`),
          element: <LunchAreasView />,
        },
        {
          id: 'menus',
          path: '/menus/:areaId',
          loader: async ({ params }): Promise<Response> =>
            fetch(`${import.meta.env.BASE_URL}api/areas/${params.areaId}`),
          element: <MenusView />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Root element with id 'root' not found.")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
