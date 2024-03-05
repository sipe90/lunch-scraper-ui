import { Browser, Page, chromium } from 'playwright'
import scrapers, { Venue } from './scrapers/index.js'
import { loadMenu, saveMenu } from './storage-service.js'
import { MenuItem, Menu, Menus, WeekMenuArray } from './menu-service.js'
import logger from './logger.js'
import { getYearAndWeek } from './util.js'

export type ScrapeFunction = (page: Page, url: string) => Promise<[WeekMenuArray, MenuItem[]]>

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
        log.debug('Opening a new browser page for scraping %s', venue.id)
        const page = await this.browser.newPage()
        page.setDefaultTimeout(2000)
        page.setDefaultNavigationTimeout(10000)

        let weekMenu: WeekMenuArray = [[], [], [], [], []]
        let allWeekMenu: MenuItem[] = []

        try {
            [weekMenu, allWeekMenu] = await venue.scraper(page, venue.url)
        } catch (err) {
            log.error(err, 'Failed to scrape %s', venue.id)
        } finally {
            log.debug('Closing browser page after scraping %s', venue.id)
            await page.close()
        }

        return { venue: venue.name, url: venue.url, weeklyOnly: venue.weeklyOnly, weekMenu, allWeekMenu }
    }
}

export default Scraper
