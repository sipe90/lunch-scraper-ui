import { type HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  nameAndPriceParser,
  openPage,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:pikku-buddha')

const parseNameAndPrice = nameAndPriceParser(/^\d\. *(.+) +(\d+(?:,\d+)?) *€$/)

const paths = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai']

const scrape: HtmlScrape = async (context, url) => {
  const weekMenu: MenuItem[][] = await Promise.all(
    paths.map(async (weekDay) => {
      const dayUrl = `${url}/${weekDay}`
      log.info('Opening a new page and navigating to %s', dayUrl)

      const page = await openPage(context, dayUrl)

      const menuItemLocator = await page
        .locator('h1', { hasText: 'lounaslista' })
        .locator('~ p:nth-of-type(n+3)')
        .all()
      return Promise.all(
        menuItemLocator.map(async (menuItem) => {
          const innerText = await menuItem.innerText()
          const nameAndPriceLocator = menuItem.locator(':nth-child(1)')

          const nameAndPrice = await nameAndPriceLocator.innerText()
          const description = sanitizeString(
            innerText.substring(
              nameAndPrice.length,
              innerText.indexOf('.', nameAndPrice.length) + 1
            )
          )

          const [name, price] = parseNameAndPrice(sanitizeString(nameAndPrice))

          return {
            name,
            price,
            description,
          }
        })
      )
    })
  )

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
