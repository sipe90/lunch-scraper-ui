import { HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { clampWeekMenu, getWeek } from '../util.js'
import { MenuItem } from '../menu-service.js'

import * as R from 'remeda'

const log = logger('scraper:huili')

const scrape: HtmlScrape = async (page, url) => {
    log.info('Navigating to %s', url)
    await page.goto(url)

    const pricesListLocator = page.locator('ul', { hasText: '€' })
    const pricesLocator = await pricesListLocator.locator(':nth-child(-n+5 of li)').all()

    const prices = await Promise.all(pricesLocator.map(async (priceItem) => {
        const priceText = await priceItem.innerText()
        return parsePrice(priceText)
    }))

    const menuSectionLocators = await page.locator('p', { hasText: `Vko ${getWeek()}` }).locator('~ ul').all()
    let weekMenu: MenuItem[][] = await Promise.all(menuSectionLocators.map(async (menuSection) => {

        const menuItemLocator = await menuSection.locator('li').all()
        return Promise.all(menuItemLocator.map(async (menuItem, i) => {
            const name = (await menuItem.innerText()).trim()
            const price = prices[i]

            return { name, price, description: null }
        }))
    }))

    if (weekMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekMenu.length)

        if (weekMenu.length > 5) {
            log.warn('Trying to combine incomplete menus to form five menus: [%s]', weekMenu.map((m) => m.length))
            const expectedItems = R.maxBy(weekMenu, (menu) => menu.length)!.length

            weekMenu = weekMenu.reduce<MenuItem[][]>((acc, menu) => {
                if (menu.length < 5) {
                    const prevMenu: MenuItem[] = acc[acc.length - 1]
                    if (prevMenu.length < expectedItems && prevMenu.length + menu.length <= expectedItems) {
                        return acc.slice(0, -1).concat([prevMenu.concat(menu)])
                    }
                }
                return acc.concat([menu])
            }, [])

            if (weekMenu.length == 5) {
                log.info('Menus combined successfully')
            } else {
                log.warn('Failed to combine menus, result is likely to be incorrect: [%s]', weekMenu.map((m) => m.length))
            }
        }
    }

    log.info('Scrape complete')

    return {
        buffetPrice: null,
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