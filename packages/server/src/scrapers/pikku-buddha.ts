import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  isEmpty,
  loadPage,
  nameAndPriceParser,
  processPromises,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:pikku-buddha')

const parseNameAndPrice = nameAndPriceParser(
  /^\d\.[\s\u00A0]*(\D+?)[\s\u00A0]*(\d+(?:,\d+)?)[\s\u00A0]*€?$/
)

const paths = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai']

const scrape: ScrapeFunction = async (url) => {
  log.info('Starting scrape')
  const weekMenuPromises = paths.map(async (weekDay, i) => {
    const dayUrl = `${url}/${weekDay}`
    log.info('Loading lunch menu page from URL %s', dayUrl)
    const $ = await loadPage(dayUrl)

    const menuItems = $('h1')
      .siblings('p')
      .slice(2)
      .map((j, el) => {
        const text = $(el).text()

        if (isEmpty(text)) {
          return null
        }

        const nameAndPrice = $('strong,span', el).text()

        if (isEmpty(nameAndPrice)) {
          return null
        }

        let description = undefined

        const periodIndex = text.indexOf('.', nameAndPrice.length)

        if (periodIndex != -1) {
          description = sanitizeString(
            text.substring(nameAndPrice.length, periodIndex + 1)
          )
        }

        try {
          const [name, price] = parseNameAndPrice(sanitizeString(nameAndPrice))

          return {
            name,
            price,
            description,
          } satisfies MenuItem
        } catch (err) {
          log.warn(
            err,
            'Failed to process day menu item (day %d, item %d)',
            i,
            j
          )
          return null
        }
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
