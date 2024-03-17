import { ScrapeFunction } from '../scrape-service.js'

import bistro from './bistro.js'
import bumma from './bumma.js'
import foodAndCo from './food-and-co.js'
import huili from './huili.js'
import huvila from './huvila.js'
import pikkuBuddha from './pikku-buddha.js'
import zapata from './zapata.js'

export interface Venue {
    id: string
    name: string
    url: string
    weeklyOnly: boolean
    buffet: boolean
    scraperType: 'api' | 'html'
    scraper: ScrapeFunction
}

const venues: Venue[] = [
    {
        id: 'bistro',
        name: 'Bistro En Place',
        url: 'https://www.bistroenplace.fi',
        weeklyOnly: true,
        buffet: false,
        scraperType: 'html',
        scraper: bistro
    },
    {
        id: 'bumma',
        name: 'Bumma',
        url: 'https://www.bumma.fi/lounas',
        weeklyOnly: false,
        buffet: false,
        scraperType: 'html',
        scraper: bumma
    },
    {
        id: 'food-and-co',
        name: 'Food & Co Järvenpää-talo',
        url: 'https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/jarvenpaa/jarvenpaa-talo/',
        weeklyOnly: false,
        buffet: true,
        scraperType: 'api',
        scraper: foodAndCo
    },
    {
        id: 'zapata',
        name: 'Cantina Viva Zapata',
        url: 'https://cantinazapata.com/lounas',
        weeklyOnly: false,
        buffet: false,
        scraperType: 'html',
        scraper: zapata
    },
    {
        id: 'huili',
        name: 'Huili',
        url: 'https://www.ravintolahuili.fi/lounas',
        weeklyOnly: false,
        buffet: false,
        scraperType: 'html',
        scraper: huili
    },
    {
        id: 'huvila',
        name: 'Huvila',
        url: 'https://www.huvilassa.fi/lounas',
        weeklyOnly: false,
        buffet: false,
        scraperType: 'html',
        scraper: huvila
    },
    {
        id: 'pikku-buddha',
        name: 'Pikku Buddha',
        url: 'https://www.ravintolapikkubuddha.com/lounas',
        weeklyOnly: false,
        buffet: false,
        scraperType: 'html',
        scraper: pikkuBuddha
    }
]

export default venues