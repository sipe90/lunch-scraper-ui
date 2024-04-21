import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import {
  loadPage,
  nameAndPriceParser,
  sanitizeString,
} from '../util/scrape-util.js'
import { type MenuItem } from '../menu-service.js'

const log = logger('scraper:bistro')

const parseNameAndPrice = nameAndPriceParser(/^(.+) (\d+(?:,\d+)?)$/)

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  log.info('Loading lunch menu page from URL %s', url)

  const $ = await loadPage(url)

  const menuSectionLocator = $('.menu-section').first()

  const allWeekMenu = $(':nth-child(n+4)', menuSectionLocator)
    .slice(0, -1)
    .map((i, el) => {
      const rawNameAndPrice = $('.menu-item-title', el).text()
      const rawDescription = $('.menu-item-description', el).text()

      try {
        const [name, price] = parseNameAndPrice(sanitizeString(rawNameAndPrice))
        const description = sanitizeString(rawDescription)

        return { name, price, description } satisfies MenuItem
      } catch (err) {
        log.warn(err, 'Failed to scrape menu item (idx: %d)', i)
      }
    })
    .toArray()

  log.info('Scrape complete')

  return { allWeekMenu }
}

export default scrape
