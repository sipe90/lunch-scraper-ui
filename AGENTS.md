## Overview
- Single page app showing lunch menus scraped by the backend (LLM-powered scraper stores weekly menus to a DB and serves them here). Built with React 19 + TypeScript, Vite, Tailwind v4, and TanStack Router.
- Fetches data from the backend under `BASE_URL` (defaults to `/`). Endpoints expected: `api/areas` (array of `LunchArea`) and `api/areas/:areaId` (type `Menus`).
- Time handling uses `date-fns` with Finnish locale; week/date helpers live in `src/time-util.ts`.
- Two screens: area list (`/menus`) shows available lunch areas; area detail (`/menus/:areaId`) shows the current week menus for all restaurants in that area.

## Key Files
- `src/router.tsx`: Route tree and data loading.
- `src/routes/*`: Page components (`LunchAreasView`, `MenusView`, `Root`).
- `src/components/*`: UI building blocks (`Header`, `MenuNavigation`, `Panel`, etc).
- `src/types.ts`: Shared domain types for API responses.
- `src/index.css`: Tailwind setup with custom green palette.

## Dev Workflow
- Node 24, pnpm 10 (see `package.json` engines).
- Install: `pnpm install`
- Run dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`; Format: `pnpm format`

## Conventions & Notes
- Prefer Tailwind utility classes; keep styling consistent with existing palette and layout.
- Keep routing/loading in TanStack Router; use route loaders for API fetches instead of in-component fetches.
- Respect existing types—update `src/types.ts` if API shapes change.
- Week/day logic is centralized in `time-util`; reuse helpers instead of ad-hoc date math.
- Avoid removing base path handling in the router (`import.meta.env.BASE_URL`).
