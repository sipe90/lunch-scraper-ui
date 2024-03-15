import { HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { clampWeekMenu } from '../util.js'
import { MenuItem } from '../menu-service.js'

const log = logger('scraper:bumma')

const scrape: HtmlScrape = async (page, url) => {
    log.info('Navigating to %s', url)
    await page.goto(url)

    const menuSectionLocators = await page.locator('.menu-section').all()
    const weekdayMenu: MenuItem[][] = await Promise.all(menuSectionLocators.map(async (menuSection) => {

        const menuItemLocator = await menuSection.locator('.menu-item').all()
        return Promise.all(menuItemLocator.map(async (menuItem) => {
            const nameLocator = menuItem.locator('.menu-item-title')
            const priceLocator = menuItem.locator('.menu-item-price-bottom')
            const descriptionLocator = menuItem.locator('.menu-item-description')

            const name = (await nameLocator.innerText()).trim()
            const price = (await priceLocator.innerText()).trim()
            const description = (await descriptionLocator.innerText()).trim()

            return { name, price, description }
        }))
    }))

    if (weekdayMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekdayMenu.length)
    }

    log.info('Scrape complete')

    return [clampWeekMenu(weekdayMenu), null]
}



export default scrape