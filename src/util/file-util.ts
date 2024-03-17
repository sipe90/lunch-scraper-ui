import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const filename = (metaUrl: string) => fileURLToPath(metaUrl)

export const dirname = (filename: string) => path.dirname(filename)
