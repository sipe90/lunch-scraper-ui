import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import Graceful from '@ladjs/graceful'
import { Cron } from 'croner'

import logger from './logger.js'
import { getMenus, saveMenus } from './menu-service.js'
import { generateTemplateVars } from './util.js'
import Scraper from './scrape-service.js'
import scrapeJob from './scrape-job.js'
import { formatISO } from 'date-fns'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = 3000

const log = logger()
const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '..', 'public')))

const scrapeCron = new Cron('0 * * * *')
const scraper = await Scraper.getInstance()

scraper.scrapeMenus(true).then((menus) => {
    saveMenus(menus)
    const nextRun = scrapeCron.nextRun()
    log.info('Initial scrape complete, scheduling scrape job. Next run is at %s', nextRun ? formatISO(nextRun) : 'NEVER')

    scrapeCron.schedule(async () => {
        log.info('Running scrape job')
        await scrapeJob()
        log.info('Scrape job completed')
    })
}).catch((err) => {
    log.error(err, 'Failed to do initial scrape')
    process.exit(1)
})

app.get('/', (req, res) => {
    const menus = getMenus()
    const data = generateTemplateVars(menus || [])
    res.render('index', data)
})

const server = app.listen(3000, () => {
    log.info('Server listening at port %d', port)
})

const graceful = new (Graceful as unknown as typeof Graceful.default)({
    servers: [server],
    customHandlers: [
        () => scrapeCron.stop(),
        () => scraper.close()
    ],
    logger: logger('graceful'),
})

graceful.listen()
