import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  loadPage,
  nameAndPriceParser,
  processPromises,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:pikku-buddha')

const parseNameAndPrice = nameAndPriceParser(/^\d\. *(.+) +(\d+(?:,\d+)?) *€$/)

const paths = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai']

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  const weekMenuPromises = paths.map(async (weekDay) => {
    const dayUrl = `${url}/${weekDay}`
    log.info('Loading lunch menu page from URL %s', dayUrl)
    const $ = await loadPage(dayUrl)

    const menuItems = $('h1')
      .siblings('p')
      .slice(2)
      .map((_, el) => {
        const text = $(el).text()
        const nameAndPrice = $('strong', el).text()

        const description = sanitizeString(
          text.substring(
            nameAndPrice.length,
            text.indexOf('.', nameAndPrice.length) + 1
          )
        )

        const [name, price] = parseNameAndPrice(sanitizeString(nameAndPrice))

        return {
          name,
          price,
          description,
        } satisfies MenuItem
      })

    return menuItems.toArray()
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

  return { weekMenu: clampWeekMenu(weekMenu) }
}

export default scrape
