import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import { fi } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'

import './index.css'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
