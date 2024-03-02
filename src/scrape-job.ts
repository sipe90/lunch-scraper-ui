import Scraper from './scrape-service.js'
import { saveMenus } from './menu-service.js'

const scrapeJob = async () => {
    const scraper = await Scraper.getInstance()
    const menus = await scraper.scrapeMenus()

    saveMenus(menus)
}

export default scrapeJob
