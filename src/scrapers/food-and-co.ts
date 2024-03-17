import got from 'got'

import { ApiScrape } from '../scrape-service.js'
import { clampWeekMenu, getISODateStr } from '../util.js'
import { MenuItem } from '../menu-service.js'
import logger from '../logger.js'

const log = logger('scraper:food-and-co')

interface WeekMenusResponse {
    weekNumber: number
    menus: {
        dayOfWeek: string
        date: string
        menuPackages: {
            sortOrder: number
            name: string
            price: string
            meals: {
                name: string
                recipeId: number
                diets: string[]
                iconUrl: string
            }[]
        }[]
        html: null
        isManualMenu: boolean
    }[]
}

const API_ENDPOINT = 'https://www.compass-group.fi/menuapi/week-menus'

const scrape: ApiScrape = async () => {
    const searchParams = { costCenter: '3050', language: 'fi', date: getISODateStr() }

    log.info('Making a GET request to %s', API_ENDPOINT)

    const response = await got.get(API_ENDPOINT, { searchParams }).json<WeekMenusResponse>()

    let buffetPrice: string | null = null

    const weekMenu = response.menus.map(({ menuPackages }) => {
        const menuPackage = menuPackages.filter((mp) => mp.meals.length)[0]

        if (!menuPackage) {
            return []
        }

        if (buffetPrice == null && menuPackage.name.length) {
            buffetPrice = parsePrice(menuPackage.name)
        }

        return menuPackage.meals.map(({ name }): MenuItem => ({ name, price: null, description: null }))
    })

    if (weekMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekMenu.length)
    }

    log.info('Scrape complete')

    return {
        buffetPrice,
        weekMenu: clampWeekMenu(weekMenu),
        allWeekMenu: null,
    }
}

const parsePrice = (priceText: string) => {
    const match = priceText.match(/\d+(?:,\d+)?/)
    if (!match) {
        throw new Error(`Could not parse price from string "${priceText}"`)
    }
    return match[0]
}

export default scrape
