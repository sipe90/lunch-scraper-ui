import express from 'express'
import Graceful from '@ladjs/graceful'
import { Cron } from 'croner'
import * as R from 'remeda'

import logger from './logger.js'
import { Weekday, getDayMenus, getWeekMenus, saveMenus } from './menu-service.js'
import Scraper from './scrape-service.js'
import scrapeJob from './scrape-job.js'
import { formatISO } from 'date-fns'
import { getDayOfWeek } from './util.js'

const HOST = process.env.HOST || 'localhost'
const PORT = parseInt(process.env.PORT || '8080', 10)

const log = logger()
const app = express()

app.set('view engine', 'pug')
app.set('views', 'views')

app.use('/lunch', express.static('public'))

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

const weekdayMapping: Record<string, Weekday> = {
    'mon': Weekday.MONDAY,
    'tue': Weekday.TUESDAY,
    'wed': Weekday.WEDNESSDAY,
    'thu': Weekday.THURSDAY,
    'fri': Weekday.FRIDAY
}

const inverseWeekdayMapping: Record<Weekday, string> = R.invert(weekdayMapping)

app.get('/', (_, res) => {
    const weekday = getDayOfWeek()
    const weekdayPath = inverseWeekdayMapping[weekday]

    res.redirect(`/lunch/${weekdayPath}`)
})

app.get('/lunch', (_, res) => {
    const weekday = getDayOfWeek()
    const weekdayPath = inverseWeekdayMapping[weekday] || 'week'

    res.redirect(`/lunch/${weekdayPath}`)
})

app.get('/lunch/week', (_, res) => {
    const menus = getWeekMenus()
    res.render('week', menus)
})

app.get('/lunch/:weekday(mon|tue|wed|thu|fri)', (req, res) => {
    const weekday = weekdayMapping[req.params.weekday]
    if (weekday == undefined) {
        return res.render('404')
    }
    const menus = getDayMenus(weekday)
    res.render('day', menus)
})

app.get('*', (_, res) => {
    res.render('404')
})

const server = app.listen(PORT, HOST, () => {
    log.info('Server listening at %s:%d', HOST, PORT)
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
