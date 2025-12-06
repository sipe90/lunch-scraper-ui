import type { FC } from 'react'
import cutlery from '../../assets/cutlery.png'

const Footer: FC = () => {
  return (
    <div>
      <img src={cutlery} alt="" className="size-9" />
    </div>
  )
}

export default Footer
