import { Browser, Page, chromium } from 'playwright'
import scrapers, { Venue } from './scrapers/index.js'
import { loadMenu, saveMenu } from './storage-service.js'
import { MenuItem, Menu, Menus, WeekMenuArray } from './menu-service.js'
import logger from './logger.js'
import { getYearAndWeek } from './util.js'

export type HtmlScrape = (page: Page, url: string) => Promise<[WeekMenuArray | null, MenuItem[] | null]>
export type ApiScrape = () => Promise<[WeekMenuArray | null, MenuItem[] | null]>

export type ScrapeFunction = HtmlScrape | ApiScrape

const log = logger('scrape-service')

class Scraper {

    private browser: Browser

    private constructor(browser: Browser) {
        this.browser = browser
    }

    private static instance: Scraper

    static getInstance = async () => {
        if (this.instance == null) {
            log.info('Opening headless chromium browser')
            const browser = await chromium.launch({ headless: true, timeout: 10000 })
            this.instance = new Scraper(browser)
        }

        return this.instance
    }

    public scrapeMenus = async (force: boolean = false): Promise<Menus> => {
        log.info('Scraping all menus (force=%s)', force)
        const [year, week] = getYearAndWeek()

        return {
            year,
            week,
            vendorMenus: await Promise.all(scrapers.map((venue) => this.scrapeMenu(year, week, venue, force)))
        }
    }

    public close = async (): Promise<void> => {
        log.info('Closing browser')
        await this.browser.close()
    }

    private scrapeMenu = async (year: number, week: number, venue: Venue, force: boolean): Promise<Menu> => {
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

    private doScrape = async (venue: Venue): Promise<Menu> => {
        const { id, url, scraperType, scraper, name, weeklyOnly, buffet } = venue

        let weekMenu: WeekMenuArray | null = null
        let allWeekMenu: MenuItem[] | null = null

        try {
            if (scraperType == 'api') {
                [weekMenu, allWeekMenu] = await this.scrapeApi(scraper as ApiScrape)
            } else {
                [weekMenu, allWeekMenu] = await this.scrapeHtml(venue)
            }
        } catch (err) {
            log.error(err, 'Failed to scrape %s', id)
        }

        return { venue: name, url, weeklyOnly, buffet, weekMenu, allWeekMenu }
    }

    private scrapeApi = async (scraper: ApiScrape) => {
        return scraper()
    }

    private scrapeHtml = async (venue: Venue) => {
        const { id, url, scraper } = venue

        log.debug('Opening a new browser page for scraping %s', id)
        const page = await this.browser.newPage()
        page.setDefaultTimeout(2000)
        page.setDefaultNavigationTimeout(10000)

        try {
            return await scraper(page, url)
        } finally {
            log.debug('Closing browser page after scraping %s', venue.id)
            await page.close()
        }
    }
}

export default Scraper
