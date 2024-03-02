import { ScrapeFunction } from '../scrape-service.js'
import bumma from './bumma.js'
import huvila from './huvila.js'
import zapata from './zapata.js'

export interface Venue {
    id: string
    name: string
    url: string
    scrape: ScrapeFunction
}

const venues: Venue[] = [
    {
        id: 'bumma',
        name: 'Bumma',
        url: 'https://www.bumma.fi/lounas',
        scrape: bumma
    },
    {
        id: 'zapata',
        name: 'Cantina Viva Zapata',
        url: 'https://cantinazapata.com/lounas',
        scrape: zapata
    },
    {
        id: 'huvila',
        name: 'Huvila',
        url: 'https://www.huvilassa.fi/lounas',
        scrape: huvila
    }
]

export default venues