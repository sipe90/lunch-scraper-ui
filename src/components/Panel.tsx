import cls from 'clsx'
import type { FC, PropsWithChildren } from 'react'

type PanelProps = {
  className?: string
  roundedTop?: boolean
  roundedBottom?: boolean
}

const Panel: FC<PropsWithChildren<PanelProps>> = ({ className, roundedTop = true, roundedBottom = true, children }) => (
  <div
    className={cls('p-6 md:p-12 bg-slate-50 drop-shadow-md', className, {
      'rounded-t-md': roundedTop,
      'rounded-b-md': roundedBottom,
    })}
  >
    {children}
  </div>
)

export default Panel
