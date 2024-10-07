import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { fi } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'

import './index.css'
import Root from './routes/Root'
import DayMenus from './routes/DayMenus'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/jarvenpaa" replace={true} />,
    },
    {
      id: 'location',
      path: '/:location',
      element: <Root />,
      loader: ({ params }) =>
        fetch(`${import.meta.env.BASE_URL}api/menus/${params.location}`),
      children: [
        {
          path: '',
          element: <DayMenus />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
