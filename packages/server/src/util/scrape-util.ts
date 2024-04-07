import * as R from 'remeda'

import { type MenuItem, type WeekMenuArray } from '../menu-service.js'
import { type BrowserContext } from 'playwright'

export const openPage = async (context: BrowserContext, url: string) => {
  const page = await context.newPage()
  const pageResponse = (await page.goto(url))!

  if (!pageResponse.ok()) {
    throw new Error(
      `Failed to scrape ${url}. Server returned a non-OK response: ${pageResponse.statusText()}`
    )
  }

  return page
}

export const initWeekMenu = (): MenuItem[][] =>
  R.times(5, R.constant<MenuItem[]>([]))

export const processPromises = async <T>(
  promises: Array<Promise<T>>,
  onRejected?: (reason: unknown, idx: number) => void
): Promise<T[]> => {
  const results = await Promise.allSettled(promises)
  return results.reduce<T[]>((acc, result, idx) => {
    if (result.status === 'fulfilled') {
      return acc.concat([result.value])
    }

    onRejected?.(result.reason, idx)
    return acc
  }, [])
}

export const nameAndPriceParser =
  (regExp: RegExp) => (nameAndPrice: string) => {
    const match = nameAndPrice.match(regExp)
    if (!match) {
      throw new Error(
        `Could not parse menu item name and price from string "${nameAndPrice}"`
      )
    }

    const name = match[1]
    const price = match[2]

    if (!name) {
      throw new Error(
        `Could not parse menu item name from string "${nameAndPrice}"`
      )
    }

    if (!price) {
      throw new Error(
        `Could not parse menu item price from string "${nameAndPrice}"`
      )
    }

    return [sanitizeString(name), sanitizeString(price)]
  }

export const sanitizeString = (str: string): string => {
  return str.trim().replaceAll(/\s+/g, ' ')
}

export const clampWeekMenu = (weekMenu?: MenuItem[][]): WeekMenuArray => {
  if (!weekMenu) {
    return [[], [], [], [], []]
  }

  if (weekMenu.length < 5) {
    return weekMenu.concat(
      R.range(0, 5 - weekMenu.length).map(() => [])
    ) as WeekMenuArray
  }

  if (weekMenu.length > 5) {
    return weekMenu.slice(0, 5) as WeekMenuArray
  }

  return weekMenu as WeekMenuArray
}
