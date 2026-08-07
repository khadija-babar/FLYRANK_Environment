# Testing Evidence — SmartCart Lite

Run with **Vitest** + **Testing Library** (`jsdom`). Scripts in `package.json`:

```bash
npm test              # vitest run
npm run test:watch    # vitest (watch)
npm run test:coverage # vitest run --coverage (v8)
```

## Latest run — 23/23 tests passing

```
Test Files  5 passed (5)
     Tests  23 passed (23)
```

### Unit tests (one per risky area)

| File | Tests | What it covers |
| ---- | ----- | -------------- |
| `src/components/SettingsForm.test.tsx` | 6 | Renders, zod validation (short API key, bad URL), calls `onSave` with valid data, save/reset states, accessible success status |
| `src/components/Chat.test.tsx` | 6 | Empty state, send (trims input, clears box), thinking indicator, renders text from message `parts`, Stop button, disabled Send |
| `src/hooks/useSettings.test.tsx` | 5 | Defaults, persistence round-trip, corrupted-JSON fallback, save status, reset |
| `src/hooks/useAutoScroll.test.tsx` | 3 | Pinned default, stale-while-scrolled-up, jump-to-latest |
| `playground/src/components/components.test.tsx` | 3 | ARIA tabs pattern from FE-05 (click + arrow-key selection) |

`useChat` from `@ai-sdk/react` is mocked in the Chat tests so the UI is tested
in isolation; the real streaming path is verified separately against the live
production endpoint.

## Coverage — 86.5% statements (bar: ≥50%)

v8 coverage over `src/components` + `src/hooks`:

```
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   86.51 |    74.77 |   93.47 |   89.93 |
 src/components    |   88.63 |    79.24 |     100 |    87.8 |
 src/hooks         |   85.24 |    61.11 |   85.71 |   90.56 |
```

To regenerate the HTML report: `npm run test:coverage`, then open
`coverage/index.html`.

## Live streaming check (production)

The real AI path is exercised against the deployed endpoint (not mocked):

```
POST https://flyrank-environment.vercel.app/api/chat
→ 200, SSE stream with 3+ text-delta events and a final response
```

This confirms the server route, env-var guard, Gemini call, and SSE transport
all work end to end in production.
