import { type FC } from 'react'
import { type MenuItem } from '../types'

type DayMenuProps = {
  title?: string
  menu: MenuItem[]
}

const DayMenu: FC<DayMenuProps> = ({ title, menu }) => {
  return (
    <div className="py-2 px-4 flex-1">
      {title && <h3 className="text-2xl">{title}</h3>}
      <div className="mt-1 flex flex-col">
        <ul className="list-disc">
          {menu.map((item, idx) => (
            <li key={idx} className="mt-1">
              <div>
                <b>{item.name}</b>
                <i className="ml-1">{item.description}</i>
              </div>
              <div>
                <i>{item.description}</i>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DayMenu
