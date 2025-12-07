export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Menus = {
  lunchArea: LunchArea
  restaurants: Restaurant[]
}

export type LunchArea = {
  id: string
  name: string
}

export type Restaurant = {
  name: string
  url: string
  location: string | null
  dailyMenus: DailyMenus | null
}

type DailyMenus = {
  [key in Weekday]: {
    dayOfWeek: Weekday
    lunchtimeStart: string | null
    lunchtimeEnd: string | null
    menuType: MenuType
    buffetPrice: number | null
    items: MenuItem[]
  }
}

export type MenuType = 'a_la_carte' | 'buffet'

export type MenuItem = {
  name: string
  description: string | null
  price: number | null
  tags: MenuTag[]
}

export type MenuTag =
  // diet
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'halal'
  // allergens
  | 'gluten_free'
  | 'lactose_free'
  | 'dairy_free'
  | 'nut_free'
  | 'egg_free'
  | 'soy_free'
  | 'fish_free'
  | 'shellfish_free'
  // dish type
  | 'soup'
  | 'salad'
  | 'burger'
  | 'pizza'
  | 'pasta'
  | 'curry'
  | 'stew'
  | 'rice_bowl'
  | 'taco'
  | 'wrap'
  | 'sandwich'
  | 'kebab'
  | 'wings'
  | 'sushi'
  // cuisine
  | 'italian'
  | 'french'
  | 'nordic'
  | 'american'
  | 'mexican'
  | 'indian'
  | 'nepalese'
  | 'thai'
  | 'chinese'
  | 'japanese'
  | 'korean'
  // protein
  | 'beef'
  | 'pork'
  | 'chicken'
  | 'fish'
  | 'seafood'
  | 'lamb'
  | 'tofu'
  | 'halloumi'
  | 'falafel'
  | 'legumes'
  | 'game'
