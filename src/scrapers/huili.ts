import { ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { clampWeekMenu } from '../util.js'
import { MenuItem } from '../menu-service.js'

const log = logger('scraper:huvila')

const scrape: ScrapeFunction = async (page, url) => {
    log.info('Navigating to %s', url)
    await page.goto(url)

    const pricesListLocator = page.locator('ul', { hasText: '€' })
    const pricesLocator = await pricesListLocator.locator(':nth-child(-n+5 of li)').all()

    const prices = await Promise.all(pricesLocator.map(async (priceItem) => {
        const priceText = await priceItem.innerText()
        return parsePrice(priceText)
    }))

    const menuSectionLocators = (await page.locator('ul').all()).slice(4)
    const weekdayMenu: MenuItem[][] = await Promise.all(menuSectionLocators.map(async (menuSection) => {

        const menuItemLocator = await menuSection.locator('li').all()
        return Promise.all(menuItemLocator.map(async (menuItem, i) => {
            const name = (await menuItem.innerText()).trim()
            const price = prices[i]

            return { name, price, description: null }
        }))
    }))

    if (weekdayMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekdayMenu.length)
    }

    log.info('Scrape complete')

    return [clampWeekMenu(weekdayMenu), null]
}

const parsePrice = (priceText: string) => {
    const match = priceText.match(/\d+(?:,\d+)?/)
    if (!match) {
        throw new Error(`Could not parse price from string "${priceText}"`)
    }
    return match[0]
}


export default scrape