import got from 'got'

import { type ScrapeFunction } from '../scrape-service.js'
import { getIsoDateStr, getWeekday, parseIsoDate } from '../util/time-util.js'
import { type MenuItem } from '../menu-service.js'
import logger from '../logger.js'
import { clampWeekMenu, initWeekMenu } from '../util/scrape-util.js'

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

const scrape: ScrapeFunction = async () => {
  log.info('Starting scrape')

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

  const weekMenu = initWeekMenu()

  response.menus.forEach(({ date, menuPackages }) => {
    const weekday = getWeekday(parseIsoDate(date))
    const menuPackage = menuPackages.find((mp) => mp.meals.length)

    if (!menuPackage) {
      return (weekMenu[weekday] = [])
    }

    if (buffetPrice == undefined && menuPackage.name.length) {
      buffetPrice = parsePrice(menuPackage.name)
    }

    weekMenu[weekday] = menuPackage.meals.map(
      ({ name }): MenuItem => ({ name })
    )
  })

  log.info('Scrape complete')

  return {
    buffetPrice,
    weekMenu: clampWeekMenu(weekMenu),
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
