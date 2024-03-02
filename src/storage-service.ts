import path from 'path'
import { mkdirSync, statSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import * as R from 'remeda'
import { format } from 'date-fns'
import { Menu } from './menu-service.js'

const storageFolder = './data'
const fileExt = '.json'

export type VendorMenus = Record<string, Menu | null>

export const loadMenus = async (date: Date, venues: string[]): Promise<VendorMenus> => {
    const menus = await Promise.all(venues.map((venue) => loadMenu(date, venue)))
    const vendorMenus = R.mapToObj.indexed(venues, (venue, i) => [venue, menus[i]])

    return vendorMenus
}

export const loadMenu = async (date: Date, venue: string): Promise<Menu | null> => {
    checkFolderExists(storageFolder)
    const filePath = getFilePath(date, venue)

    if (statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
        const fileStr = await readFile(filePath, { encoding: 'utf8' })
        return JSON.parse(fileStr) as Menu
    }

    return null
}

export const saveMenu = async (date: Date, venue: string, menu: Menu): Promise<void> => {
    checkFolderExists(storageFolder)
    const filePath = getFilePath(date, venue)

    const menuStr = JSON.stringify(menu, null, 2)

    return writeFile(filePath, menuStr, { encoding: 'utf8', mode: '600' })
}


const checkFolderExists = (path: string) => {
    if (!statSync(path, { throwIfNoEntry: false })?.isDirectory()) {
        mkdirSync(path)
    }
}

const getFilePath = (date: Date, venue: string) => {
    const prefix = format(date, 'yyyy_II', { weekStartsOn: 1 })
    const filePath = path.join(storageFolder, prefix + '_' + venue + fileExt)

    return filePath
}
