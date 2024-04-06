import { pino } from 'pino'

const p = pino()

export const logger = (module = 'root') => p.child({ module })

export default logger
