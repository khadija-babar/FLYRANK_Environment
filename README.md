# SmartCart Lite

AI-assisted price comparison across your favorite stores. Built as the capstone
for the FlyRank Frontend AI Engineering internship.

## What it does

Users add product listings from different stores. An AI API matches equivalent
products across stores, and the UI shows a price comparison view with a running
cart total.

## Stack

- **Next.js** (App Router) + React + TypeScript
- **Tailwind CSS** for styling (design tokens in `src/app/globals.css`)
- **react-hook-form + zod** for form validation
- Deployed on **Vercel**

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Production build

```bash
npm run build
npm start
```

## Routes

| Route      | Screen                                                            |
| ---------- | ----------------------------------------------------------------- |
| `/`        | Home — hero + entry points                                        |
| `/products`| Product listings placeholder                                       |
| `/compare` | AI price comparison placeholder                                   |
| `/cart`    | Running cart total placeholder                                    |
| `/settings`| API key / AI model / store URLs form (client component)           |
| `/health`  | Health check — fetches live data from a public API                |

## Project structure

```
src/
  app/
    layout.tsx      # root layout + navigation + design tokens
    page.tsx        # home
    globals.css     # Tailwind + theme tokens
    products/       # placeholder page
    compare/        # placeholder page
    cart/           # placeholder page
    settings/       # settings page (client)
    health/         # health check (fetches live data)
  components/
    SettingsForm.tsx
  hooks/
    useSettings.ts  # localStorage persistence (client-safe)
  types/
    settings.ts
```

## Notes

- Server Components by default; `"use client"` only for the interactive
  settings form.
- `useSettings` guards against SSR so `localStorage` is only touched on the
  client.
- Secrets: never commit `.env*` files; env vars are configured in Vercel.
