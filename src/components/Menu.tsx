import type { FC } from 'react'
import type { MenuItem } from '../types'

type MenuProps = {
  title?: string
  items: MenuItem[]
}

const Menu: FC<MenuProps> = ({ title, items }) => {
  return (
    <div className="px-4 flex-1">
      {title && <h3 className="text-2xl text-green-dark">{title}</h3>}
      <div className="mt-1 flex flex-col">
        <ul className="list-disc">
          {items.map((item) => (
            <li key={item.name} className="mt-1">
              <div className="font-medium">
                <span>{item.name}</span>
                {item.price && <span className="ml-1">{item.price}€</span>}
              </div>
              <div className="italic font-light">
                <span>{item.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Menu
