import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import { clampWeekMenu, loadPage } from '../util/scrape-util.js'

const log = logger('scraper:bumma')

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  log.info('Loading lunch menu page from URL %s', url)

  const $ = await loadPage(url)

  const weekMenu = $('.menu-section')
    .map((i, menuSection) => {
      const menuItems = $('.menu-item', menuSection).map((j, menuItem) => {
        try {
          const name = $('.menu-item-title', menuItem).text()
          const price = $('.menu-item-price-bottom', menuItem).text()
          const description = $('.menu-item-description', menuItem).text()

          return { name, price, description } satisfies MenuItem
        } catch (err) {
          log.warn(err, 'Failed to scrape menu item (day: %d, idx: %d)', i, j)
        }
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
