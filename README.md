# SmartCart Lite

**Live:** https://flyrank-environment.vercel.app
**AI assistant:** https://flyrank-environment.vercel.app/chat
**Repository:** https://github.com/khadija-babar/FLYRANK_Environment

## Project brief

Shoppers who track the same products across multiple stores waste time manually
comparing prices and trusting whichever listing is most recent. SmartCart Lite
solves that with an AI assistant that compares equivalent products across the
stores a user tracks and names the cheapest option with a one-line reason. It is
for budget-conscious shoppers who want the best price without building a
spreadsheet — and it doubles as the capstone that proves I can ship a
production, AI-integrated web app end to end. I chose this idea because price
comparison is a real, understandable problem with a clear success signal
(an accurate comparison), which forced me to design the AI integration as a
genuine feature — a streaming assistant with a strict "never invent prices"
rule — rather than a decorative chatbot.

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

### The prompt, and why it's written this way

The system prompt (the only copy that governs behavior, in
`src/lib/ai-config.ts`) is:

```
You are SmartCart, the price-comparison assistant inside the SmartCart Lite app.
Your job: help the user compare prices for equivalent products across the
stores they track. They will describe a product they want (e.g. "which store
has the cheapest 24-pack of AA batteries?") or paste product listings.

Follow these rules:
- Be direct, warm, technical but plain. No fluff, no filler phrases.
- When comparing, list each store with its price and the winner clearly
  (e.g. "Cheapest: Store B at $12.99").
- If the user gives vague or incomplete product info, ask ONE targeted
  clarifying question before guessing.
- Never invent prices or store names. If you don't have a real price, say you
  need current data and ask them to paste it.
- Keep answers short. One comparison + a one-line reason.
```

Why these choices:

- **"Never invent prices or store names"** is the most important line. The
  assistant has no live store feed, so the only safe behavior is to refuse to
  fabricate data — a confident wrong price would be worse than no answer. This
  rule turns a real product limitation into a designed failure mode (FE-07
  resilience: the AI asks for data rather than hallucinating it).
- **"Ask ONE targeted clarifying question"** is a structured fallback for vague
  input — bounded, so the assistant can't interrogate the user into a corner.
- **"List each store with its price and the winner clearly"** makes output
  parseable for a shopper comparing options, not just prose.
- **"Direct, warm, technical but plain"** is the brand voice from the start of
  the internship; it keeps responses short and readable.
- The temperature is set per-request (`0.7`) in the route — warm enough to be
  conversational, low enough to stay on-task for a factual comparison task.

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
npm install && npm run dev
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

The deployed site is audited with Lighthouse and axe on the production URL:

- Performance 90 (mobile), Accessibility 100, Best practices 100, SEO 100
- axe: 0 WCAG 2.1 A/AA violations on `/`, `/chat`, and `/settings`
- Zero console errors

### Two concrete fixes from the audits

1. **Missing favicon (best-practices 96 → 100).** The app served no favicon, so
   browsers requested `/favicon.ico` and hit a 404 console error. Fix: wired
   `/favicon.svg` into the app metadata.
2. **Low-contrast empty state (axe serious violation).** The chat empty-state
   hint used `text-slate-400` (2.45:1 contrast — failed AA's 4.5:1). Fix:
   `text-slate-500` (4.55:1). axe now reports 0 violations across all pages.

## How it fails safely

- **Missing server API key:** the `/api/chat` route returns a clear 500 with
  `"Server API key is not configured."` instead of a stack trace. It never ships
  the key to the client.
- **LLM/provider errors:** streaming failures surface through the AI SDK as a
  terminal message in the chat; the input stays usable and the user can retry.
- **Corrupted settings:** `useSettings` wraps `localStorage` reads in try/catch
  and falls back to defaults rather than crashing.
- **Form errors:** the settings form uses zod validation and shows inline,
  accessible error messages (`role="alert"`) for bad URLs or short API keys.

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
