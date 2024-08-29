import { type ScrapeFunction } from '../scrape-service.js'
import logger from '../logger.js'
import { type MenuItem } from '../menu-service.js'
import { clampWeekMenu, loadPage, sanitizeString } from '../util/scrape-util.js'
import { getIsoWeek } from '../util/time-util.js'

const log = logger('scraper:zapata')

const scrape: ScrapeFunction = async (url) => {
  log.info('Opening a new page and navigating to %s', url)
  const $ = await loadPage(url)

  const weekPanel = $('div.vc_tta-panel').hasText(`viikko ${getIsoWeek()} `)

  const tables = $('table.lounastable', weekPanel)
  const weekDayTables = tables.slice(0, 5)
  const allWeekTable = tables.get(5)
  const pizzaTable = tables.get(6)

  const weekMenu = weekDayTables
    .map((_, el) => {
      const items = $('tr', el)
        .slice(1)
        .hasNotText('päivän pizza')
        .map((_, el) => {
          const name = $('td', el).eq(0).text()
          const diets = $('td', el).eq(1).text()
          const price = $('td', el).eq(2).text()

          return {
            name,
            diets: diets.length ? [diets] : undefined,
            price,
          } satisfies MenuItem
        })

      return [items.toArray()]
    })
    .toArray()

  if (weekMenu.length != 5) {
    log.warn(
      'Found an unexpected number of elements in weekday menu (%d != 5)',
      weekMenu.length
    )
  }

  let allWeekMenu: MenuItem[] = $('tr', allWeekTable)
    .slice(1)
    .map((_, el) => {
      const name = $('td', el).eq(0).text()
      const price = $('td', el).eq(2).text()

      return {
        name,
        price,
      } satisfies MenuItem
    })
    .toArray()

  try {
    const pizzaItems = $(weekDayTables)
      .map((_, el) => {
        const pizzaItem = $('tr', el).hasText('päivän pizza')

        const name = sanitizeString($('td', pizzaItem).eq(0).text())
        const price = sanitizeString($('td', pizzaItem).eq(2).text())
        const description = sanitizeString($('tr', pizzaTable).eq(1).text())

        return {
          name,
          price,
          description,
        } satisfies MenuItem
      })
      .toArray()

    if (pizzaItems.length) {
      allWeekMenu = allWeekMenu.concat(pizzaItems[0])
    }
  } catch (err) {
    log.warn(err, 'Failed to scrape pizza information')
  }

  log.info('Scrape complete')

  return {
    weekMenu: clampWeekMenu(weekMenu),
    allWeekMenu,
  }
}

export default scrape
