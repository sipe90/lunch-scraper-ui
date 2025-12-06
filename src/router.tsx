import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import LunchAreasView from './routes/LunchAreasView'
import MenusView from './routes/MenusView'
import Root from './routes/Root'
import type { LunchArea, Menus } from './types'

const basepath = import.meta.env.BASE_URL ?? '/'

const fetchJson = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${basepath}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Request to ${endpoint} failed with status ${response.status}`)
  }
  // oxlint-disable-next-line no-unsafe-type-assertion
  return (await response.json()) as T
}

const rootRoute = createRootRoute({
  component: Root,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/menus', replace: true })
  },
})

const lunchAreasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'menus',
  loader: async () => fetchJson<LunchArea[]>('api/areas'),
  component: LunchAreasView,
})

const menusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'menus/$areaId',
  loader: async ({ params }) => fetchJson<Menus>(`api/areas/${params.areaId}`),
  component: MenusView,
})

const routeTree = rootRoute.addChildren([indexRoute, lunchAreasRoute, menusRoute])

export const router = createRouter({
  routeTree,
  basepath,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
