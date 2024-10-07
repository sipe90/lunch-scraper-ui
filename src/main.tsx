import React from 'react'
import ReactDOM from 'react-dom/client'
import { fi } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'
import App from './App'

import './index.css'


setDefaultOptions({ locale: fi, weekStartsOn: 1 })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
