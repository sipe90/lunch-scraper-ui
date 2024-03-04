import { ScrapeFunction } from '../scrape-service.js'

import bistro from './bistro.js'
import bumma from './bumma.js'
import huvila from './huvila.js'
import zapata from './zapata.js'

export interface Venue {
    id: string
    name: string
    url: string
    weekly: boolean
    scrape: ScrapeFunction
}

const venues: Venue[] = [
    {
        id: 'bistro',
        name: 'Bistro En Place',
        url: 'https://www.bistroenplace.fi',
        weekly: true,
        scrape: bistro
    },
    {
        id: 'bumma',
        name: 'Bumma',
        url: 'https://www.bumma.fi/lounas',
        weekly: false,
        scrape: bumma
    },
    {
        id: 'zapata',
        name: 'Cantina Viva Zapata',
        url: 'https://cantinazapata.com/lounas',
        weekly: false,
        scrape: zapata
    },
    {
        id: 'huvila',
        name: 'Huvila',
        url: 'https://www.huvilassa.fi/lounas',
        weekly: false,
        scrape: huvila
    }
]

export default venues