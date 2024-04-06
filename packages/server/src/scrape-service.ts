import { type Browser, type BrowserContext, chromium } from 'playwright'
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

export type ScrapeResult = {
  weekMenu: WeekMenuArray | undefined
  allWeekMenu: MenuItem[] | undefined
  buffetPrice: string | undefined
}

export type HtmlScrape = (
  context: BrowserContext,
  url: string
) => Promise<ScrapeResult>
export type ApiScrape = () => Promise<ScrapeResult>

export type ScrapeFunction = HtmlScrape | ApiScrape

const log = logger('scrape-service')

class Scraper {
  static getInstance = async () => {
    if (this.instance == null) {
      log.info('Opening headless chromium browser')
      const browser = await chromium.launch({ headless: true, timeout: 10000 })
      this.instance = new Scraper(browser)
    }

    return this.instance
  }

  private static instance: Scraper

  private constructor(readonly browser: Browser) {}

  public scrapeMenus = async (force = false): Promise<Menus> => {
    log.info('Scraping all menus (force=%s)', force)
    const [year, week] = getYearAndWeek()

    return {
      year,
      week,
      menus: await Promise.all(
        scrapers.map(async (venue) => this.scrapeMenu(year, week, venue, force))
      ),
    }
  }

  public close = async (): Promise<void> => {
    log.info('Closing browser')
    await this.browser.close()
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
    const { id, url, scraperType, scraper, name, weeklyOnly, buffet } = venue

    let scrapeResult: ScrapeResult = {
      buffetPrice: undefined,
      allWeekMenu: undefined,
      weekMenu: undefined,
    }

    try {
      if (scraperType == 'api') {
        scrapeResult = await this.scrapeApi(scraper as ApiScrape)
      } else {
        scrapeResult = await this.scrapeHtml(venue)
      }
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

  private async scrapeApi(scraper: ApiScrape) {
    return scraper()
  }

  private async scrapeHtml(venue: Venue) {
    const { id, url, scraper } = venue

    log.debug('Opening a new browser context for scraping %s', id)

    const context = await this.browser.newContext()
    context.setDefaultTimeout(2000)
    context.setDefaultNavigationTimeout(30000)

    try {
      return await scraper(context, url)
    } finally {
      log.debug('Closing browser page after scraping %s', id)
      await context.close()
    }
  }
}

export default Scraper
