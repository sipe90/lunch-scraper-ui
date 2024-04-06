import { getWeek } from 'date-fns'

import { type HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import {
  clampWeekMenu,
  openPage,
  processPromises,
  sanitizeString,
} from '../util/scrape-util.js'

const log = logger('scraper:zapata')

const scrape: HtmlScrape = async (context, url) => {
  log.info('Opening a new page and navigating to %s', url)
  const page = await openPage(context, url)

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 })

  const panelLocator = page.locator('div.vc_tta-panel', {
    hasText: `VIIKKO ${currentWeek} `,
  })
  const tableLocator = panelLocator.locator('table.lounastable')
  const weekDayTableLocators = (await tableLocator.all()).filter(
    (_, i) => i < 5
  )
  const allWeekTableLocator = tableLocator.nth(5)

  const weekMenu: MenuItem[][] = await Promise.all(
    weekDayTableLocators.map(async (table) => {
      const itemLocators = await table
        .locator(':nth-child(n+2 of tr)')
        .filter({ hasNotText: 'PÄIVÄN PIZZA' })
        .all()
      const items = await Promise.all(
        itemLocators.map(async (item) => {
          const nameLocator = item.locator(':nth-child(1 of td)')
          const priceLocator = item.locator(':nth-child(3 of td)')

          const name = await nameLocator.innerText()
          const price = await priceLocator.innerText()

          return {
            name,
            price,
            description: undefined,
          }
        })
      )

      return items
    })
  )

  if (weekMenu.length != 5) {
    log.warn(
      'Found an unexpected number of elements in weekday menu (%d != 5)',
      weekMenu.length
    )
  }

  const allWeekItemLocators = allWeekTableLocator
    .locator(':nth-child(n+2 of tr)')
    .all()
  const allWeekMenuItemPromises = (await allWeekItemLocators).map(
    async (item) => {
      const nameLocator = item.locator(':nth-child(1 of td)')
      const priceLocator = item.locator(':nth-child(3 of td)')

      const name = await nameLocator.innerText()
      const price = await priceLocator.innerText()

      return {
        name,
        price,
        description: undefined,
      } satisfies MenuItem
    }
  )

  let allWeekMenu: MenuItem[] = await processPromises(allWeekMenuItemPromises)

  try {
    const pizzaItemLocators = (await tableLocator.all()).map(async (table) => {
      const pizzaItemLocator = table
        .locator('tr')
        .filter({ hasText: 'PÄIVÄN PIZZA' })

      const pizzaNameLocator = pizzaItemLocator.locator(':nth-child(1 of td)')
      const pizzaPriceLocator = pizzaItemLocator.locator(':nth-child(3 of td)')
      const pizzaDescriptionLocator = tableLocator
        .nth(6)
        .locator(':nth-child(2 of tr)')

      const pizzaName = sanitizeString(await pizzaNameLocator.innerText())
      const pizzaPrice = sanitizeString(await pizzaPriceLocator.innerText())
      const pizzaDescription = sanitizeString(
        await pizzaDescriptionLocator.innerText()
      )

      return {
        name: pizzaName,
        price: pizzaPrice,
        description: pizzaDescription,
      }
    })

    const pizzaItems = await processPromises(pizzaItemLocators)
    if (pizzaItems.length) {
      allWeekMenu = allWeekMenu.concat(pizzaItems[0])
    }
  } catch (err) {
    log.warn(err, 'Failed to ')
  }

  log.info('Scrape complete')

  return {
    buffetPrice: undefined,
    weekMenu: clampWeekMenu(weekMenu),
    allWeekMenu,
  }
}

export default scrape
