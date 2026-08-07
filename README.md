# SmartCart Lite

AI-assisted price comparison across your favorite stores. Built as the capstone
for the FlyRank Frontend AI Engineering internship.

**Live:** https://flyrank-environment.vercel.app
**AI assistant:** https://flyrank-environment.vercel.app/chat

## What it does

Users add product listings from different stores. The built-in AI assistant
(SmartCart) helps compare equivalent products across those stores — pointing out
the cheapest option with a clear, one-line recommendation. Settings let the user
configure the AI API key, model, and the list of store URLs they track.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling (design tokens in `src/app/globals.css`)
- **AI SDK 7** (`ai`, `@ai-sdk/react`, `@ai-sdk/google`) for streaming chat
- **Google Gemini** (`gemini-flash-latest`, free tier) as the LLM provider
- **react-hook-form + zod** for form validation
- **Vitest + Testing Library** for unit/component tests (v8 coverage)
- Deployed on **Vercel**

## How the AI assistant works

1. The client (`src/components/Chat.tsx`) uses `useChat` from `@ai-sdk/react`.
   Messages are sent to the server route as `{ text }`; responses stream back
   over SSE and render token by token.
2. The server route (`src/app/api/chat/route.ts`) calls `streamText` with the
   Gemini model, the system prompt, and a per-request `temperature`. It returns
   the UI message stream to `useChat`.
3. The model + system prompt are centralized in `src/lib/ai-config.ts` — the
   only place model/prompt changes should go.
4. The API key is read from `process.env.GOOGLE_GENERATIVE_AI_API_KEY` **on the
   server only**. It is configured as a Vercel environment variable and is never
   shipped to the browser. If it is missing, the route returns a clear message
   instead of a confusing 500.

Streaming UX details:

- A **thinking indicator** shows before the first token arrives, so there is no
  flicker gap at the handoff.
- **Auto-scroll pins to the bottom** only while the user is already at the
  bottom. The moment the user scrolls up, it releases — and a **"Jump to
  latest"** button appears when new content arrives while scrolled up.
- **Stop** halts the stream; the partial message stays, input re-enables, and
  the next send starts a fresh turn.
- Enter sends, Shift+Enter inserts a newline.

## Routes

| Route       | Screen                                                            |
| ----------- | ----------------------------------------------------------------- |
| `/`         | Home — hero + entry points                                        |
| `/products` | Product listings placeholder                                      |
| `/compare`  | AI price comparison placeholder                                   |
| `/cart`     | Running cart total placeholder                                    |
| `/chat`     | AI assistant — streaming price-comparison chat                    |
| `/settings` | API key / AI model / store URLs form (client component)           |
| `/health`   | Health check — fetches live data from a public API                |

## Project structure

```
src/
  app/
    layout.tsx      # root layout + navigation + design tokens
    page.tsx        # home
    globals.css     # Tailwind + theme tokens
    api/chat/       # streaming chat route (server, SSE)
    chat/           # AI assistant page
    products/       # placeholder page
    compare/        # placeholder page
    cart/           # placeholder page
    settings/       # settings page (client)
    health/         # health check (fetches live data)
  components/
    Chat.tsx             # streaming chat UI (useChat + auto-scroll)
    SettingsForm.tsx     # validated settings form
    *.test.tsx           # component tests
  hooks/
    useSettings.ts       # localStorage persistence (client-safe)
    useAutoScroll.ts     # pin-to-bottom scroll with "jump to latest"
    *.test.tsx           # hook tests
  lib/
    ai-config.ts         # model + system prompt (single source of truth)
  types/
    settings.ts
```

## Testing

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:coverage # run with v8 coverage report
```

Coverage is collected for `src/components` and `src/hooks`. Current coverage is
well above the capstone bar of 50% statements (see the coverage report for the
exact figure). Tests cover form validation (zod schema), the settings hook
(localStorage persistence, corrupted-JSON fallback), the auto-scroll hook
(pinned/stale/jump behavior), and the chat UI (message rendering, send/stop,
thinking indicator) with `useChat` mocked.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

To exercise the AI assistant locally, add a `GOOGLE_GENERATIVE_AI_API_KEY` to
`.env.local` (never commit `.env*` files).

## Production build

```bash
npm run build
npm start
```

## Quality gate

The deployed site is audited with Lighthouse (production URL):

- Performance ≥ 88
- Accessibility 100
- Best practices 100
- SEO 100
- Zero console errors (a missing favicon that caused a 404 was fixed by wiring
  `/favicon.svg` into the app metadata)

## Known limitations

- **Placeholder screens**: `/products`, `/compare`, and `/cart` are UI
  placeholders, not full features. Product data is not yet persisted or fetched
  from real store APIs.
- **Assistant has no live data access**: SmartCart will not invent prices or
  stores — it asks you to paste listings. Real price retrieval is a future
  integration.
- **Single-provider default**: Gemini is configured because it offers a free
  key; swapping to another provider is a one-line change in `ai-config.ts`.
- **Settings are local-only**: the API key/model/store URLs are stored in
  `localStorage` per browser, not in a backend account.
