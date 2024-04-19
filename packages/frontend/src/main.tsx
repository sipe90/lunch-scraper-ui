import ReactDOM from 'react-dom/client'
import { fi } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'

import './index.css'
import App from './App'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
