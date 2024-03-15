import { HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { clampWeekMenu } from '../util.js'
import { MenuItem } from '../menu-service.js'

const log = logger('scraper:huvila')

const scrape: HtmlScrape = async (page, url) => {
    log.info('Navigating to %s', url)
    await page.goto(url)

    const menuSectionLocators = await page.locator('.menu-items').all()
    const weekMenu: MenuItem[][] = await Promise.all(menuSectionLocators.map(async (menuSection) => {

        const menuItemLocator = await menuSection.locator('.menu-item').all()
        return Promise.all(menuItemLocator.slice(0, -1).map(async (menuItem) => {
            const nameLocator = menuItem.locator('.menu-item-title')
            const priceLocator = menuItem.locator('.menu-item-price-bottom')
            const descriptionLocator = menuItem.locator('.menu-item-description')

            const name = (await nameLocator.innerText()).trim()
            const price = (await priceLocator.innerText()).trim()
            const description = (await descriptionLocator.innerText({ timeout: 100 }).catch(() => '')).trim()

            return { name, price, description }
        }))
    }))

    if (weekMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekMenu.length)
    }

    log.info('Scrape complete')

    return {
        buffetPrice: null,
        weekMenu: clampWeekMenu(weekMenu),
        allWeekMenu: null,
    }
}



export default scrape