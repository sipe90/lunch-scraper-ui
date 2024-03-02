import { pino } from 'pino'

const p = pino()

export const logger = (module: string = 'root') => p.child({ module })

export default logger