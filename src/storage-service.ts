import path from 'path'
import { mkdirSync, statSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { Menu } from './menu-service.js'

const storageFolder = './data'
const fileExt = '.json'

export const loadMenu = async (year: number, week: number, venue: string): Promise<Menu | null> => {
    checkFolderExists(storageFolder)
    const filePath = getFilePath(year, week, venue)

    if (statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
        const fileStr = await readFile(filePath, { encoding: 'utf8' })
        return JSON.parse(fileStr) as Menu
    }

    return null
}

export const saveMenu = async (year: number, week: number, venue: string, menu: Menu): Promise<void> => {
    checkFolderExists(storageFolder)
    const filePath = getFilePath(year, week, venue)

    const menuStr = JSON.stringify(menu, null, 2)

    return writeFile(filePath, menuStr, { encoding: 'utf8', mode: '600' })
}


const checkFolderExists = (path: string) => {
    if (!statSync(path, { throwIfNoEntry: false })?.isDirectory()) {
        mkdirSync(path)
    }
}

const getFilePath = (year: number, week: number, venue: string) => {
    const prefix = `${year.toString(10)}_${week.toString(10).padStart(2, '0')}`
    const filePath = path.join(storageFolder, prefix + '_' + venue + fileExt)

    return filePath
}
