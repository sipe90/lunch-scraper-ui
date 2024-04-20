import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import { clampWeekMenu, loadPage, sanitizeString } from '../util/scrape-util.js'

const log = logger('scraper:huvila')

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  log.info('Loading lunch menu page from URL %s', url)

  const $ = await loadPage(url)

  const weekMenu = $('.menu-items')
    .map((_, menuSection) => {
      const menuItems = $('.menu-item', menuSection)
        .slice(0, -1)
        .map((_, menuItem) => {
          const name = sanitizeString($('.menu-item-title', menuItem).text())
          const price = sanitizeString(
            $('.menu-item-price-bottom', menuItem).text()
          )
          const description = sanitizeString(
            $('.menu-item-description', menuItem).text()
          )

          return { name, price, description } satisfies MenuItem
        })

      return [menuItems.toArray()]
    })
    .toArray()

  if (weekMenu.length != 5) {
    log.warn(
      'Found an unexpected number of elements in weekday menu (%d != 5)',
      weekMenu.length
    )
  }

  log.info('Scrape complete')

  return { weekMenu: clampWeekMenu(weekMenu) }
}

export default scrape
