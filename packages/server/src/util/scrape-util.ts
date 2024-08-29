import * as R from 'remeda'
import got from 'got'
import * as cheerio from 'cheerio'

import { type MenuItem, type WeekMenuArray } from '../menu-service.js'

export const promiseChain = async <T>(promises: Array<() => Promise<T>>) => {
  return promises.reduce(
    async (chain, c) =>
      chain.then(async (res) => c().then((cur) => [...res, cur])),
    Promise.resolve<T[]>([])
  )
}

export const loadPage = async (url: string): Promise<cheerio.CheerioAPI> => {
  const response = await got(url)

  if (response.statusCode !== 200) {
    throw new Error(
      `Failed to scrape ${url}. Server returned a non-OK response: (${response.statusCode}) ${response.statusMessage}`
    )
  }

  const $ = cheerio.load(response.body)

  $.prototype.hasText = function <T extends cheerio.AnyNode>(
    this: cheerio.Cheerio<T>,
    text: string
  ) {
    return this.filter((_, el) =>
      this._make(el).text().toLowerCase().includes(text.toLowerCase())
    )
  }

  $.prototype.hasNotText = function <T extends cheerio.AnyNode>(
    this: cheerio.Cheerio<T>,
    text: string
  ) {
    return this.filter(
      (_, el) =>
        !this._make(el).text().toLowerCase().includes(text.toLowerCase())
    )
  }

  return $
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

/**
 * @deprecated
 * @param regExp
 * @returns
 */
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

const parser =
  (name: string, regExp: RegExp) =>
  (str: string): string => {
    const match = str.match(regExp)

    if (!match) {
      throw new Error(`Could not parse ${name} from string "${str}"`)
    }

    const matched = match[1]

    if (!matched) {
      throw new Error(`Could not parse ${name} from string "${str}"`)
    }

    return sanitizeString(matched)
  }

const optionalParser =
  (regExp: RegExp) =>
  (str: string): string | undefined => {
    const match = str.match(regExp)

    if (!match) {
      return undefined
    }

    const matched = match[1]

    if (!matched) {
      return undefined
    }

    return sanitizeString(matched)
  }

export const nameParser = (regExp: RegExp) => parser('name', regExp)
export const priceParser = (regExp: RegExp) => parser('price', regExp)
export const descriptionParser = (regExp: RegExp) => optionalParser(regExp)
export const dietsParser = (regExp: RegExp) => optionalParser(regExp)

export const parseDiets = (str: string): string[] => {
  const match = /\((.*?)\)/g.exec(str)

  return (
    match
      ?.at(1)
      ?.split(',')
      ?.map((d) => d.trim()) ?? []
  )
}

export const sanitizeString = (str: string): string => {
  return str.trim().replaceAll(/[\s\u00A0]+/g, ' ')
}

export const isEmpty = (str: string): boolean => {
  return str.replaceAll(/[\s\u00A0]+/g, '').length === 0
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
