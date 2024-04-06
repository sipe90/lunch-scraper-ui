import { type HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import {
  nameAndPriceParser,
  openPage,
  processPromises,
  sanitizeString,
} from '../util/scrape-util.js'
import { type MenuItem } from '../menu-service.js'

const log = logger('scraper:bistro')

const parseNameAndPrice = nameAndPriceParser(/^(.+) (\d+(?:,\d+)?)$/)

const scrape: HtmlScrape = async (context, url) => {
  log.info('Opening a new page and navigating to %s', url)
  const page = await openPage(context, url)

  const menuSectionLocator = page.locator('.menu-section').first()
  const menuItemLocator = await menuSectionLocator
    .locator(':nth-child(n+4 of .menu-item)')
    .all()
  const itemPromises = menuItemLocator.map(async (menuItem) => {
    const nameAndPriceLocator = menuItem.locator('.menu-item-title')
    const descriptionLocator = menuItem.locator('.menu-item-description')

    const nameAndPrice = sanitizeString(await nameAndPriceLocator.innerText())
    const description = sanitizeString(
      await descriptionLocator.innerText().catch(() => '')
    )

    const [name, price] = parseNameAndPrice(nameAndPrice)

    return { name, price, description } satisfies MenuItem
  })

  const allWeekMenu = await processPromises(itemPromises, (err, i) => {
    log.warn(err, 'Failed to process menu item (idx: %d)', i)
  })

  log.info('Scrape complete')

  return {
    buffetPrice: undefined,
    weekMenu: undefined,
    allWeekMenu,
  }
}

export default scrape
