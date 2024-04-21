import { useEffect, useState } from 'react'
import { type FC } from 'react'
import { type Menus } from './types'
import Navigation from './components/Navigation'
import DayMenus from './views/DayMenus'
import Header from './components/Header'
import { MenuProvider } from './app-context'
import Footer from './components/Footer'

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
    <MenuProvider allMenus={menus} loading={menus === undefined}>
      <div className="md:px-6 max-w-[1440px] mx-auto">
        <header className="px-4 md:px-20 py-2 md:py-6 border-2 border-gray-50">
          <Header />
        </header>
        <div className="px-4 md:px-20 py-4 md:py-8 bg-backgound bg-contain">
          <nav>
            <Navigation />
          </nav>
          <main className="px-6 md:px-12 bg-slate-50 rounded-b-2xl drop-shadow-md">
            <DayMenus />
          </main>
        </div>
        <footer className="py-4 flex flex-row justify-center border-2 border-gray-50">
          <Footer />
        </footer>
      </div>
    </MenuProvider>
  )
}

export default App
