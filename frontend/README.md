# Frontend

The app is built with Vite and follows Feature-Sliced Design. `src` is organized into these layers:

- `app` — application setup, routing, and store configuration
- `pages` — route-level screens
- `widgets` — large reusable page blocks, such as the header
- `features` — user-facing capabilities, including authentication and editing
- `entities` — domain models and reusable entity UI
- `shared` — UI primitives, API utilities, configuration, and common types

Higher layers may use lower layers. Import a slice through its `index.ts` public API; keep implementation details inside the slice.

## Scripts

- `npm start` — run the Vite development server on port 3000
- `npm test` — run tests with Vitest
- `npm run build` — create a production build
