import { ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { clampWeekMenu } from '../util.js'

const log = logger('scraper:bistro')

const scrape: ScrapeFunction = async (page, url) => {
    log.info('Navigating to %s', url)
    await page.goto(url)

    const menuSectionLocator = page.locator('.menu-section').first()
    const menuItemLocator = await menuSectionLocator.locator(':nth-child(n+4 of .menu-item)').all()
    const allWeekItems = await Promise.all(menuItemLocator.map(async (menuItem) => {
        const nameAndPriceLocator = menuItem.locator('.menu-item-title')
        const descriptionLocator = menuItem.locator('.menu-item-description')

        const nameAndPrice = (await nameAndPriceLocator.innerText()).trim()
        const description = (await descriptionLocator.innerText().catch(() => '')).trim()

        const [name, price] = parseNameAndPrice(nameAndPrice)

        return { name, price, description }
    }))

    return [clampWeekMenu(), allWeekItems]
}

const parseNameAndPrice = (nameAndPrice: string) => {
    const match = nameAndPrice.match(/^(.+) (\d+(?:,\d+)?)$/)
    if (!match) {
        throw new Error(`Could not parse menu item name and price from string "${nameAndPrice}"`)
    }
    const name = match[1]
    const price = match[2]

    if (!name) {
        throw new Error(`Could not parse menu item name from string "${nameAndPrice}"`)
    }
    if (!price) {
        throw new Error(`Could not parse menu item price from string "${nameAndPrice}"`)
    }

    return [name.trim(), price.trim()]
}

export default scrape