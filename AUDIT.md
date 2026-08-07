# Performance & Accessibility Audit — SmartCart Lite

Audits run against the **production** URL (`https://flyrank-environment.vercel.app`)
with Lighthouse 13.4.1 (mobile throttling) and axe-core (WCAG 2.1 A/AA).

## Lighthouse results

| Category | Score |
| -------- | ----- |
| Performance (mobile) | 90 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Key metrics: LCP ~1.5s, CLS 0, no console errors.

## axe results — 0 WCAG A/AA violations

| Page | WCAG 2.1 A/AA violations | axe checks run |
| ---- | ------------------------ | -------------- |
| `/`       | 0 | 19 |
| `/chat`   | 0 | 23 |
| `/settings` | 0 | 25 |

```
=== https://flyrank-environment.vercel.app/
axe checks passed: 19, incomplete: 0
WCAG 2.1 A/AA violations: 0 — PASS
=== https://flyrank-environment.vercel.app/chat
axe checks passed: 23, incomplete: 0
WCAG 2.1 A/AA violations: 0 — PASS
=== https://flyrank-environment.vercel.app/settings
axe checks passed: 25, incomplete: 0
WCAG 2.1 A/AA violations: 0 — PASS
```

Run axe yourself:

```bash
npx @axe-core/cli https://flyrank-environment.vercel.app/chat
```

## Three concrete improvements from the audits

1. **Missing favicon → best-practices 96 → 100.**
   Finding: browsers requested `/favicon.ico` which 404'd, producing a console
   error.
   Fix: wired `/favicon.svg` into the app metadata (`src/app/layout.tsx`), so
   the icon is linked in HTML instead of guessed.

2. **Unused JavaScript on the home page → performance 88 → 90.**
   Finding: the header's `<Link href="/chat">` triggered Next.js route
   prefetching, pulling the ~91 KB AI SDK bundle into every page (91 KB fully
   unused on `/`).
   Fix: `prefetch={false}` on the `/chat` nav link. Unused JS dropped from 91 KB
   to 30 KB and the median mobile performance score rose to 90.

3. **Low-contrast empty state → axe serious violation → 0 violations.**
   Finding: `color-contrast` failure on the chat empty-state hint —
   `text-slate-400` (#94a3b8) measured 2.45:1 against the page background,
   below WCAG AA's 4.5:1 minimum.
   Fix: `text-slate-500` (#64748b), which measures 4.55:1 and passes. axe now
   reports 0 violations on all three audited pages.
