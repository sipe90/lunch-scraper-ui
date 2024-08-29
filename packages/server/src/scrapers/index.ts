import { type ScrapeFunction } from '../scrape-service.js'

import bistro from './bistro.js'
import bumma from './bumma.js'
import foodAndCo from './food-and-co.js'
import huili from './huili.js'
import huvila from './huvila.js'
import pikkuBuddha from './pikku-buddha.js'
import zapata from './zapata.js'

export type Venue = {
  id: string
  name: string
  url: string
  weeklyOnly: boolean
  buffet: boolean
  scraper: ScrapeFunction
  isEnabled(): boolean
}

const isVenueEnabled = (id: string) => () =>
  process.env[`SCRAPER_${id}_DISABLE`]?.toLocaleLowerCase() !== 'true'

const venues: Venue[] = [
  {
    id: 'bistro',
    isEnabled: isVenueEnabled('BISTRO'),
    name: 'Bistro En Place',
    url: 'https://www.bistroenplace.fi',
    weeklyOnly: true,
    buffet: false,
    scraper: bistro,
  },
  {
    id: 'bumma',
    isEnabled: isVenueEnabled('BUMMA'),
    name: 'Bumma',
    url: 'https://www.bumma.fi/lounas',
    weeklyOnly: false,
    buffet: false,
    scraper: bumma,
  },
  {
    id: 'food-and-co',
    isEnabled: isVenueEnabled('FOOD-AND-CO'),
    name: 'Food & Co Järvenpää-talo',
    url: 'https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/jarvenpaa/jarvenpaa-talo/',
    weeklyOnly: false,
    buffet: true,
    scraper: foodAndCo,
  },
  {
    id: 'zapata',
    isEnabled: isVenueEnabled('ZAPATA'),
    name: 'Cantina Viva Zapata',
    url: 'https://cantinazapata.com/lounas',
    weeklyOnly: false,
    buffet: false,
    scraper: zapata,
  },
  {
    id: 'huili',
    isEnabled: isVenueEnabled('HUILI'),
    name: 'Huili',
    url: 'https://www.ravintolahuili.fi/lounas',
    weeklyOnly: false,
    buffet: false,
    scraper: huili,
  },
  {
    id: 'huvila',
    isEnabled: isVenueEnabled('HUVILA'),
    name: 'Huvila',
    url: 'https://www.huvilassa.fi/lounas',
    weeklyOnly: false,
    buffet: false,
    scraper: huvila,
  },
  {
    id: 'pikku-buddha',
    isEnabled: isVenueEnabled('PIKKU-BUDDHA'),
    name: 'Pikku Buddha',
    url: 'https://www.ravintolapikkubuddha.com/lounas',
    weeklyOnly: false,
    buffet: false,
    scraper: pikkuBuddha,
  },
]

export default venues
