import { getWeek } from 'date-fns'

import { ScrapeFunction } from '../scrape-service.js'
import { clampWeekMenu } from '../util.js'
import logger from '../logger.js'
import { MenuItem } from '../menu-service.js'

const log = logger('scraper:zapata')

const scrape: ScrapeFunction = async (page, url) => {

    await page.goto(url)

    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 })

    const panelLocator = page.locator('div.vc_tta-panel', { hasText: `VIIKKO ${currentWeek} ` })
    const tableLocator = panelLocator.locator('table.lounastable')
    const weekDayTableLocators = (await tableLocator.all()).filter((_, i) => i < 5)
    const allWeekTableLocator = tableLocator.nth(5)

    const weekdayMenu: MenuItem[][] = await Promise.all(weekDayTableLocators.map(async (table) => {
        const itemLocators = await table.locator(':nth-child(n+2 of tr)')
            .filter({ hasNotText: 'PÄIVÄN PIZZA' })
            .all()
        const items = await Promise.all(itemLocators.map(async (item) => {
            const nameLocator = item.locator(':nth-child(1 of td)')
            const priceLocator = item.locator(':nth-child(3 of td)')

            const name = await nameLocator.innerText()
            const price = await priceLocator.innerText()

            return {
                name,
                price,
                description: null
            }
        }))

        return items
    }))

    if (weekdayMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekdayMenu.length)
    }

    const allWeekItemLocators = allWeekTableLocator.locator(':nth-child(n+2 of tr)').all()
    let allWeekItems: MenuItem[] = await Promise.all((await allWeekItemLocators).map(async (item) => {
        const nameLocator = item.locator(':nth-child(1 of td)')
        const priceLocator = item.locator(':nth-child(3 of td)')

        const name = await nameLocator.innerText()
        const price = await priceLocator.innerText()

        return {
            name,
            price,
            description: null
        }
    }))

    const pizzaItemLocator = tableLocator.first()
        .locator('tr')
        .filter({ hasText: 'PÄIVÄN PIZZA' })

    const pizzaNameLocator = pizzaItemLocator.locator(':nth-child(1 of td)')
    const pizzaPriceLocator = pizzaItemLocator.locator(':nth-child(3 of td)')
    const pizzaDescriptionLocator = tableLocator.nth(6).locator(':nth-child(2 of tr)')

    const pizzaName = (await pizzaNameLocator.innerText()).trim()
    const pizzaPrice = (await pizzaPriceLocator.innerText()).trim()
    const pizzaDescription = (await pizzaDescriptionLocator.innerText()).trim()

    allWeekItems = allWeekItems.concat({ name: pizzaName, price: pizzaPrice, description: pizzaDescription })

    log.info('Scrape complete')

    return [clampWeekMenu(weekdayMenu), allWeekItems]
}

export default scrape