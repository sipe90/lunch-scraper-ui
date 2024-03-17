import { HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { MenuItem, Weekday } from '../menu-service.js'
import { clampWeekMenu, nameAndPriceParser, openPage, sanitizeString } from '../util/scrape-util.js'

const log = logger('scraper:pikku-buddha')

const parseNameAndPrice = nameAndPriceParser(/^\d\. *(.+) +(\d+(?:,\d+)?) *€$/)

const paths = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai']

const scrape: HtmlScrape = async (context, url) => {

    const weekMenu: MenuItem[][] = await Promise.all(paths.map(async (weekDay) => {
        const dayUrl = `${url}/${weekDay}`
        log.info('Opening a new page and navigating to %s', dayUrl)

        const page = await openPage(context, dayUrl)

        const menuItemLocator = await page.locator('h1', { hasText: 'lounaslista' }).locator('~ p:nth-of-type(n+3)').all()
        return await Promise.all(menuItemLocator.map(async (menuItem, i) => {
            const innerText = await menuItem.innerText()
            const nameAndPriceLocator = menuItem.locator(':nth-child(1)')

            const nameAndPrice = sanitizeString(await nameAndPriceLocator.innerText())
            const description = sanitizeString(innerText.substring(nameAndPrice.length, innerText.indexOf('.', nameAndPrice.length)))

            const [name, price] = parseNameAndPrice(nameAndPrice)

            return {
                name,
                price,
                description
            }
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