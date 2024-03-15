import got from 'got'

import { ScrapeFunction } from '../scrape-service.js'
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

const scrape: ScrapeFunction = async () => {
    const searchParams = { costCenter: '3005', language: 'fi', date: getISODateStr() }

    log.info('Making a GET request to %s', API_ENDPOINT)

    const response = await got.get(API_ENDPOINT, { searchParams }).json<WeekMenusResponse>()

    const weekMenus = response.menus.map(({ menuPackages }) => menuPackages[0].meals.map(({ name }): MenuItem => ({ name, price: null, description: null })))

    log.info('Scrape complete')

    return [clampWeekMenu(weekMenus), null]
}

export default scrape
