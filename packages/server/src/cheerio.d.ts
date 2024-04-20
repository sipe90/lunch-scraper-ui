/* eslint-disable @typescript-eslint/consistent-type-definitions */
import 'cheerio'

declare module 'cheerio' {
  interface Cheerio<T> {
    hasText(this: Cheerio<T>, text: string): Cheerio<T>
    hasNotText(this: Cheerio<T>, text: string): Cheerio<T>
  }
}
