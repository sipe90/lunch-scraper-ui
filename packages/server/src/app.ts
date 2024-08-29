import path from 'node:path'
import express from 'express'
import Graceful from '@ladjs/graceful'
import { Cron } from 'croner'

import 'dotenv/config'

import logger from './logger.js'
import { getMenus, saveMenus } from './menu-service.js'
import Scraper from './scrape-service.js'
import scrapeJob from './scrape-job.js'
import { formatISO, setDefaultOptions } from 'date-fns'
import { fi } from 'date-fns/locale'

setDefaultOptions({ locale: fi, weekStartsOn: 1 })

const host = process.env.HOST ?? 'localhost'
const port = parseInt(process.env.PORT ?? '8080', 10)

const log = logger()
const app = express()

app.set('trust proxy', true)

const scrapeCron = new Cron('0 * * * *')
const scraper = await Scraper.getInstance()

scraper
  .scrapeMenus(true)
  .then((menus) => {
    saveMenus(menus)
    const nextRun = scrapeCron.nextRun()
    log.info(
      'Initial scrape complete, scheduling scrape job. Next run is at %s',
      nextRun ? formatISO(nextRun) : 'NEVER'
    )

    scrapeCron.schedule(async () => {
      log.info('Running scrape job')
      await scrapeJob()
      log.info('Scrape job completed')
    })
  })
  .catch((err) => {
    log.error(err, 'Failed to do initial scrape')
    process.exit(1)
  })

app.use(express.static('public'))

app.get('/api/menus', (_, res) => {
  res.json(getMenus())
})

app.use('*', express.static(path.join('public', 'index.html')))

const server = app.listen(port, () => {
  log.info('Server listening at %s:%d', host, port)
})

const graceful = new (Graceful as unknown as typeof Graceful.default)({
  servers: [server],
  customHandlers: [
    () => {
      scrapeCron.stop()
    },
  ],
  logger: logger('graceful'),
})

graceful.listen()
