import type { FC } from 'react'
import { Outlet } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Root: FC = () => {
  return (
    <div className="md:px-6 max-w-[1440px] mx-auto">
      <header className="px-4 md:px-20 py-2 md:py-6 border-2 border-gray-50">
        <Header />
      </header>
      <div className="px-4 md:px-20 py-4 md:py-8 bg-[url('/assets/bg.jpg')] bg-contain">
        <main>
          <Outlet />
        </main>
      </div>
      <footer className="py-4 flex flex-row justify-center border-2 border-gray-50">
        <Footer />
      </footer>
    </div>
  )
}

export default Root
