import scrapers, { type Venue } from './scrapers/index.js'
import { loadMenu, saveMenu } from './storage-service.js'
import {
  type MenuItem,
  type Menu,
  type Menus,
  type WeekMenuArray,
} from './menu-service.js'
import logger from './logger.js'
import { getYearAndWeek } from './util/time-util.js'
import { promiseChain } from './util/scrape-util.js'

export type ScrapeResult = {
  weekMenu?: WeekMenuArray
  allWeekMenu?: MenuItem[]
  buffetPrice?: string
}

export type ScrapeFunction = (url: string) => Promise<ScrapeResult>

const log = logger('scrape-service')

class Scraper {
  static getInstance = async () => {
    if (this.instance == null) {
      this.instance = new Scraper()
    }

    return this.instance
  }

  private static instance: Scraper

  public scrapeMenus = async (force = false): Promise<Menus> => {
    log.info('Scraping all menus (force=%s)', force)
    const [year, week] = getYearAndWeek()

    const enabledVenues = scrapers.filter(({ isEnabled }) => isEnabled())
    const scrapePromises = enabledVenues.map(
      (v) => async () => this.scrapeMenu(year, week, v, force)
    )

    const menus = await promiseChain(scrapePromises)

    return {
      year,
      week,
      menus,
    }
  }

  private async scrapeMenu(
    year: number,
    week: number,
    venue: Venue,
    force: boolean
  ): Promise<Menu> {
    if (!force) {
      const menu = await loadMenu(year, week, venue.id)
      if (menu != null) {
        return menu
      }
    }

    const scrapedMenu = await this.doScrape(venue)
    await saveMenu(year, week, venue.id, scrapedMenu)
    return scrapedMenu
  }

  private async doScrape(venue: Venue): Promise<Menu> {
    const { id, url, scraper, name, weeklyOnly, buffet } = venue

    let scrapeResult: ScrapeResult = {
      buffetPrice: undefined,
      allWeekMenu: undefined,
      weekMenu: undefined,
    }

    try {
      scrapeResult = await scraper(url)
    } catch (err) {
      log.error(err, 'Failed to scrape %s', id)
    }

    const { buffetPrice, weekMenu, allWeekMenu } = scrapeResult

    return {
      venue: name,
      url,
      weeklyOnly,
      buffet,
      buffetPrice,
      weekMenu,
      allWeekMenu,
    }
  }
}

export default Scraper
