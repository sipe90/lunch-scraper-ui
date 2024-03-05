import { ScrapeFunction } from '../scrape-service.js'

import bistro from './bistro.js'
import bumma from './bumma.js'
import huvila from './huvila.js'
import zapata from './zapata.js'

export interface Venue {
    id: string
    name: string
    url: string
    weeklyOnly: boolean
    scraper: ScrapeFunction
}

const venues: Venue[] = [
    {
        id: 'bistro',
        name: 'Bistro En Place',
        url: 'https://www.bistroenplace.fi',
        weeklyOnly: true,
        scraper: bistro
    },
    {
        id: 'bumma',
        name: 'Bumma',
        url: 'https://www.bumma.fi/lounas',
        weeklyOnly: false,
        scraper: bumma
    },
    {
        id: 'zapata',
        name: 'Cantina Viva Zapata',
        url: 'https://cantinazapata.com/lounas',
        weeklyOnly: false,
        scraper: zapata
    },
    {
        id: 'huvila',
        name: 'Huvila',
        url: 'https://www.huvilassa.fi/lounas',
        weeklyOnly: false,
        scraper: huvila
    }
]

export default venues