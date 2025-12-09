export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Menus = {
  lunchArea: LunchArea
  restaurants: Restaurant[]
  tags: MenuTagsByType
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

export type MenuTagsByType = {
  diet: DietTag[]
  allergen: AllergenTag[]
  dishType: DishTypeTag[]
  cuisine: CuisineTag[]
  protein: ProteinTag[]
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
  tags: MenuTagsByType
}

export type DietTag = 'vegetarian' | 'vegan' | 'pescatarian' | 'halal'

export type AllergenTag =
  | 'glutenFree'
  | 'lactoseFree'
  | 'dairyFree'
  | 'nutFree'
  | 'eggFree'
  | 'soyFree'
  | 'fishFree'
  | 'shellfishFree'

export type DishTypeTag =
  | 'soup'
  | 'salad'
  | 'burger'
  | 'pizza'
  | 'pasta'
  | 'curry'
  | 'stew'
  | 'riceBowl'
  | 'taco'
  | 'wrap'
  | 'sandwich'
  | 'kebab'
  | 'wings'
  | 'sushi'

export type CuisineTag =
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

export type ProteinTag =
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

export type MenuTag = DietTag | AllergenTag | DishTypeTag | CuisineTag | ProteinTag
