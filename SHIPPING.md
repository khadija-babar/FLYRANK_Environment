# SmartCart Lite — Ship It Checklist & Reflection

## Deployment checklist (signed off)

| # | Item | Status | Evidence |
| - | ---- | ------ | -------- |
| 1 | Production build passes (`npm run build`) | ✅ Done | Local + Vercel build green; TypeScript clean |
| 2 | Deployed to production on Vercel | ✅ Done | https://flyrank-environment.vercel.app |
| 3 | AI assistant streams real responses on prod | ✅ Done | Verified SSE `start` → text-delta → final on `/chat` |
| 4 | Server-only API key (never in client bundle) | ✅ Done | Key read from `process.env.GOOGLE_GENERATIVE_AI_API_KEY` in `/api/chat`; missing key → clear 500 message |
| 5 | Automated tests present and passing | ✅ Done | 23 tests, 5 files, Vitest |
| 6 | Coverage at or above the 50% statement bar | ✅ Done | 86.5% statements (v8) |
| 7 | Lighthouse audit passes the ≥85 bar | ✅ Done | Performance 90, Accessibility 100, Best practices 100, SEO 100 |
| 8 | Zero console errors | ✅ Done | Fixed missing favicon 404 (wired `/favicon.svg` in metadata) |
| 9 | axe: no WCAG A/AA violations | ✅ Done | 0 violations on `/`, `/chat`, `/settings` (fixed a 2.45:1 contrast failure) |
| 10 | README documents architecture + AI integration | ✅ Done | `README.md` rewritten |
| 11 | Known limitations documented honestly | ✅ Done | `README.md` "Known limitations" section |
| 12 | Rollback plan documented | ✅ Done | See below |
| 13 | Committed and pushed to GitHub | ✅ Done | Branch `main`, https://github.com/khadija-babar/FLYRANK_Environment |

## Rollback plan & monitoring

- **Rollback:** Vercel keeps every production deployment with its URL hash. If a
  deploy breaks, either run `vercel --prod` from the last good commit (main is
  the source of truth — `git revert`/reset then redeploy), or open the Vercel
  dashboard → Deployments → select the previous green deployment → **Promote to
  Production**. Target is seconds, not minutes.
- **Monitoring:** the `/health` route fetches live data from a public API and
  falls back to local data if unreachable, so uptime is visible from the URL
  itself. Vercel logs server errors per deployment; the chat route surfaces
  missing-key and provider errors as readable responses rather than silent
  failures.
- **Secrets safety:** the only secret (`GOOGLE_GENERATIVE_AI_API_KEY`) lives as
  a Vercel environment variable and in gitignored `.env.local`. Nothing sensitive
  is in the repo, so `main` is always safe to redeploy from.


## How I verified (real evidence, not assumptions)

- **Streaming works in production.** I tested the live URL in a headless
  browser and confirmed the `/api/chat` route emits a proper SSE stream:
  `start` event, then `text-delta` events, then a final response. The assistant
  rendered real Gemini output token-by-token.
- **The API key stays on the server.** The key exists only as a Vercel
  environment variable; the client bundle contains no secret. When the var is
  absent the route answers with a readable error rather than a stack trace.
- **Lighthouse measured on the deployed URL**, not localhost, on mobile
  settings. Median performance across three runs is 90; best-practices moved
  from 96 → 100 after the favicon fix, and the prefetch change cut unused JS on
  the home page from 91 KB to 30 KB.
- **axe run with axe-core against the live pages**, not just Lighthouse's
  built-in checks. It caught a real `color-contrast` serious violation on
  `/chat` (2.45:1) that I then fixed (4.55:1) and re-verified to 0 violations.
- **Coverage is computed by v8** over `src/components` and `src/hooks` — the
  real bar from the rubric, not a hand-wave.

## Reflection

### What the capstone actually proves

The assignment asks for a live, AI-integrated web app plus the quality work that
makes it shippable. The hard parts here were not "write a chat box." They were:

1. **Streaming chat that doesn't feel broken.** A naive auto-scroll yanks the
   user down mid-read. I built pin-to-bottom scrolling that releases the moment
   the user scrolls up and shows a "Jump to latest" affordance instead — plus a
   thinking indicator before the first token so the handoff has no flicker gap,
   and a Stop control that leaves state in a clean, resendable position.
2. **A server route that is honest about failures.** Missing API key → a clear
   message, not a 500 stack trace.
3. **Config that is safe to change.** Model + system prompt live in exactly one
   file (`src/lib/ai-config.ts`), so future swaps (e.g. Gemini → Anthropic) are
   a one-line change instead of a hunt through components.
4. **Tests for the risky parts.** Form validation (zod), localStorage
   persistence incl. corrupted-JSON fallback, auto-scroll pinned/stale/jump
   behavior, and the chat UI with `useChat` mocked. 86.5% statement coverage is
   comfortable margin over the 50% bar.

### What I'd do differently / next steps

- **Real product data.** `/products`, `/compare`, and `/cart` are honest
  placeholders. The next step is wiring listings to a real store API (or a
  scraper-friendly feed) so the assistant compares real, current prices instead
  of asking the user to paste them.
- **Provider tuning.** I defaulted to `gemini-flash-latest` because of the free
  tier; a production app would A/B model choice and temperature per task.
- **Account-backed settings.** Settings live in `localStorage` per browser
  today; a real product would persist them to a backend so the assistant
  follows the user across devices.
- **One correction I'm glad I made.** I initially targeted a now-retired
  numbered Gemini model, and only discovered it while testing the live
  endpoint (it 404/429'd on new keys). Moving to the `latest` alias removed the
  model-name treadmill entirely — a good lesson in preferring stable aliases
  over pinned versions for fast-moving APIs.

### Shipped, in one line

SmartCart Lite is live on Vercel, streams real Gemini answers through a
server-side route, keeps its secret out of the client, passes a 50%+ coverage
bar with 23 passing tests, audits at 90/100/100/100, and passes axe with 0
WCAG A/AA violations.
