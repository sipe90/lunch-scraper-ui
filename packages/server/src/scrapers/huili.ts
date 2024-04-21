import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import {
  getIsoWeek,
  getShortDateStr,
  getWeekdayDates,
} from '../util/time-util.js'
import { type MenuItem } from '../menu-service.js'
import { clampWeekMenu, loadPage, sanitizeString } from '../util/scrape-util.js'

const log = logger('scraper:huili')

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  log.info('Loading lunch menu page from URL %s', url)

  const $ = await loadPage(url)

  const prices = $('ul')
    .hasText('€')
    .children()
    .slice(0, 5)
    .map((i, el) => {
      try {
        return parsePrice($(el).text())
      } catch (err) {
        log.warn(err, 'Failed to parse price (idx: %d)', i)
      }
    })
    .toArray()

  const menuStart = $('p').hasText(`Vko ${getIsoWeek()}`)

  const weekMenu = getWeekdayDates().map((weekdayDate) => {
    const menuSections = $('~ p', menuStart)
      .hasText(getShortDateStr(weekdayDate))
      .nextUntil('p', 'ul')

    const itemSections = menuSections.map((j, menuSection) => {
      const menuItems = $('li', menuSection).map((k, menuItem) => {
        const name = sanitizeString($(menuItem).text())
        const price = prices[j + k]

        return { name, price } satisfies MenuItem
      })

      return menuItems.toArray()
    })

    return itemSections.toArray()
  })

  log.info('Scrape complete')

  return { weekMenu: clampWeekMenu(weekMenu) }
}

const parsePrice = (priceText: string) => {
  const match = /\d+(?:,\d+)?/.exec(priceText)
  if (!match) {
    throw new Error(`Could not parse price from string "${priceText}"`)
  }

  return match[0]
}

export default scrape
