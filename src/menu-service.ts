import * as R from 'remeda'

export interface Menu {
    venue: string
    url: string
    weekly: boolean
    weekMenu: MenuItem[][]
}

export interface MenuItem {
    name: string,
    price: string | null,
    description: string | null,
}

let menus: Menu[] = []

export const getMenus = (): Menu[] => R.clone(menus)

export const saveMenus = (newMenus: Menu[]): void => { menus = newMenus }