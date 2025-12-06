import { RouterProvider } from '@tanstack/react-router'
import { setDefaultOptions } from 'date-fns'
import { fi } from 'date-fns/locale'
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { router } from './router'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Root element with id 'root' not found.")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
