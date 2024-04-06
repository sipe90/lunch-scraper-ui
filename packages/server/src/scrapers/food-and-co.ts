import got from 'got'

import { type ApiScrape } from '../scrape-service.js'
import { getIsoDateStr } from '../util/time-util.js'
import { type MenuItem } from '../menu-service.js'
import logger from '../logger.js'
import { clampWeekMenu } from '../util/scrape-util.js'

const log = logger('scraper:food-and-co')

type WeekMenusResponse = {
  weekNumber: number
  menus: Array<{
    dayOfWeek: string
    date: string
    menuPackages: Array<{
      sortOrder: number
      name: string
      price: string
      meals: Array<{
        name: string
        recipeId: number
        diets: string[]
        iconUrl: string
      }>
    }>
    html: undefined
    isManualMenu: boolean
  }>
}

const apiEndpoint = 'https://www.compass-group.fi/menuapi/week-menus'

const scrape: ApiScrape = async () => {
  const searchParams = {
    costCenter: '3050',
    language: 'fi',
    date: getIsoDateStr(),
  }

  log.info('Making a GET request to %s', apiEndpoint)

  const response = await got
    .get(apiEndpoint, { searchParams })
    .json<WeekMenusResponse>()

  let buffetPrice: string | undefined

  const weekMenu = response.menus.map(({ menuPackages }) => {
    const menuPackage = menuPackages.find((mp) => mp.meals.length)

    if (!menuPackage) {
      return []
    }

    if (buffetPrice == undefined && menuPackage.name.length) {
      buffetPrice = parsePrice(menuPackage.name)
    }

    return menuPackage.meals.map(
      ({ name }): MenuItem => ({
        name,
        price: undefined,
        description: undefined,
      })
    )
  })

  if (weekMenu.length != 5) {
    log.warn(
      'Found an unexpected number of elements in weekday menu (%d != 5)',
      weekMenu.length
    )
  }

  log.info('Scrape complete')

  return {
    buffetPrice,
    weekMenu: clampWeekMenu(weekMenu),
    allWeekMenu: undefined,
  }
}

const parsePrice = (priceText: string) => {
  const match = /\d+(?:,\d+)?/.exec(priceText)
  if (!match) {
    throw new Error(`Could not parse price from string "${priceText}"`)
  }

  return match[0]
}

export default scrape
