# Accessible Component Playground

Standalone practice folder for **FE-05: Accessible Component Fundamentals**.

Three interactive components built **from scratch** (no component libraries)
against the W3C ARIA Authoring Practices Guide, plus a comparison with
shadcn/ui.

## Components

- `src/components/Modal.tsx` — APG Dialog (Modal): focus trap, Escape, focus restore
- `src/components/Tabs.tsx` — APG Tabs: arrow keys, Home/End, `aria-selected`
- `src/components/Disclosure.tsx` — APG Disclosure: `aria-expanded`, `aria-controls`
- `src/components/ui/` — shadcn/ui-style wrappers around Radix UI (for comparison)

## Run

```bash
npm install
npm run dev
```

## Test (keyboard-only, simulated real key events)

```bash
npm test
```

## Learnings

See `NOTES.md` — the concrete gaps between my hand-built components and
shadcn/ui (body scroll lock, background `aria-hidden`, portals, focus scoping).
