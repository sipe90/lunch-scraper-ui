import { type HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  processPromises,
  openPage,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:bumma')

const scrape: HtmlScrape = async (context, url) => {
  log.info('Opening a new page and navigating to %s', url)
  const page = await openPage(context, url)

  const menuSectionLocators = await page.locator('.menu-section').all()
  const weekMenuPromises = menuSectionLocators.map(async (menuSection, i) => {
    const menuItemLocator = await menuSection.locator('.menu-item').all()
    const itemPromises = menuItemLocator.map(async (menuItem) => {
      const nameLocator = menuItem.locator('.menu-item-title')
      const priceLocator = menuItem.locator('.menu-item-price-bottom')
      const descriptionLocator = menuItem.locator('.menu-item-description')

      const name = sanitizeString(await nameLocator.innerText())
      const price = sanitizeString(await priceLocator.innerText())
      const description = sanitizeString(await descriptionLocator.innerText())

      return { name, price, description } satisfies MenuItem
    })

    return processPromises(itemPromises, (err, j) => {
      log.warn(err, 'Failed to process menu item (day: %d, idx: %d)', i, j)
    })
  })

  const weekMenu = await processPromises(weekMenuPromises, (err, i) => {
    log.warn(err, 'Failed to process day menu (day %d)', i)
  })

  if (weekMenu.length != 5) {
    log.warn(
      'Found an unexpected number of elements in weekday menu (%d != 5)',
      weekMenu.length
    )
  }

  log.info('Scrape complete')

  return {
    buffetPrice: undefined,
    weekMenu: clampWeekMenu(weekMenu),
    allWeekMenu: undefined,
  }
}

export default scrape
