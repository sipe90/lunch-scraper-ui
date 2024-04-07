import { type HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import {
  getIsoWeek,
  getShortDateStr,
  getWeekdayDates,
} from '../util/time-util.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  openPage,
  processPromises,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:huili')

const scrape: HtmlScrape = async (context, url) => {
  log.info('Opening a new page and navigating to %s', url)
  const page = await openPage(context, url)

  const pricesListLocator = page.locator('ul', { hasText: '€' })
  const pricesLocator = await pricesListLocator
    .locator(':nth-child(-n+5 of li)')
    .all()

  const prices = await Promise.all(
    pricesLocator.map(async (priceItem) => {
      const priceText = await priceItem.innerText()
      return parsePrice(priceText)
    })
  ).catch((err) => {
    log.error(err, 'Failed to scrape menu prices')
    return []
  })

  const menuStartLocator = page.locator('p', { hasText: `Vko ${getIsoWeek()}` })

  const weekMenuPromises = getWeekdayDates().map(async (wekdayDate, i) => {
    const menuSectionLocators = await menuStartLocator
      .locator('~ p', { hasText: getShortDateStr(wekdayDate) })
      .locator('+ ul, + ul + ul')
      .all()

    const itemSectionPromises = menuSectionLocators.map(
      async (menuSection, j) => {
        const menuItemLocator = await menuSection.locator('li').all()
        const itemPromises = menuItemLocator.map(async (menuItem, k) => {
          const name = sanitizeString(await menuItem.innerText())
          const price = prices[j + k]

          return { name, price, description: undefined } satisfies MenuItem
        })

        return processPromises(itemPromises, (err, k) => {
          log.warn(
            err,
            'Failed to process menu item (day: %d, idx: %d:%d)',
            i,
            j,
            k
          )
        })
      }
    )

    const itemSections = await processPromises(itemSectionPromises, (err) => {
      log.warn(err, 'lol')
    })

    return itemSections.flat()
  })

  const weekMenu = await processPromises(weekMenuPromises, (err, i) => {
    log.warn(err, 'Failed to process day menu (day %d)', i)
  })

  log.info('Scrape complete')

  return {
    buffetPrice: undefined,
    weekMenu: clampWeekMenu(weekMenu),
    allWeekMenu: undefined,
  }
}

const parsePrice = (priceText: string) => {
  const match = /\d+(?:,\d+)?/.exec(priceText)
  if (!match) {
    throw new Error(`Could not parse price from string "${priceText}"`)
  }

  return match[0]
}

export default scrape
