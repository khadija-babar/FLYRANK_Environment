# NOTES.md — Hand-built vs shadcn/ui

**Assignment:** FE-05 Accessible Component Fundamentals
**Repo:** `playground/` folder of FLYRANK_Environment

I built three components by hand (modal, tabs, disclosure) against the ARIA APG
patterns, keyboard-tested them with Vitest + Testing Library (`user-event`,
which simulates real keyboard events), then installed Radix UI and the
shadcn/ui-style wrappers to compare.

## What I built from scratch

| Component | Pattern | Roles / keys implemented | Keyboard test |
|-----------|---------|--------------------------|---------------|
| `Modal.tsx` | APG Dialog (Modal) | `role=dialog aria-modal`, focus trap, Escape, focus restore to trigger | ✓ |
| `Tabs.tsx` | APG Tabs (automatic) | `tablist/tab/tabpanel`, `aria-selected`, `aria-controls`, arrow keys, Home/End | ✓ |
| `Disclosure.tsx` | APG Disclosure | `aria-expanded`, `aria-controls`, `hidden` | ✓ |

All three pass the keyboard tests (focus traps in the modal, Escape closes and
returns focus, arrows rotate tabs, disclosure toggles with Space/Enter).

## What shadcn/ui (Radix) handled that I missed

### 1. Body scroll lock (modal)

My hand-built modal does **not** lock background scrolling. While it's open,
the page behind can still scroll with the wheel/touch — a classic a11y miss.
Radix uses `react-remove-scroll`, so when a modal opens the page behind is
frozen and restored when it closes. My version has no equivalent.

### 2. `aria-hidden` on everything behind the dialog

Radix applies `aria-hidden` to all siblings of the modal content while it's
open (`hideOthers` from `aria-hidden`), so screen readers cannot reach the
background content. My modal only marks the dialog itself; background content
remains in the accessibility tree. For a true modal this is required.

### 3. Rendering via a Portal

Radix renders dialog content into a `Portal` at the end of `<body>`, which
escapes any `overflow`/`transform`/`z-index` contexts on ancestors. My modal
renders inline in the tree, so a parent with `overflow: hidden` or a
`transform` could clip or mis-layer it.

### 4. Focus containment beyond Tab cycling

I trap Tab/Shift+Tab, but Radix's `FocusScope` also:
- prevents focus from escaping via `focus()` calls (e.g. `window.find`, autofocus on other elements),
- emits focus-guards so browser-injected elements (like the omnibox dropdown) don't steal focus.

### 5. Click-outside dismissal with proper semantics

My overlay closes on `mousedown` on the backdrop. Radix's `DismissableLayer`
handles outside press for pointer **and** touch/pen, ignores drags that start
inside the dialog, and adds `data-state` + `pointer-events` guards.

### 6. `react-remove-scroll` style `data-state` animations and body styling

Not a correctness gap but worth noting: shadcn wraps everything in
`data-[state=open/closed]` classes, so open/close animations and overlay fade
come free. Mine has none.

### Tabs-specific gaps

- **`aria-orientation` / `dir`:** Radix sets `aria-orientation` on the tablist
  and honors `dir="rtl"` (my arrow-key logic assumes LTR; ArrowLeft/ArrowRight
  would be wrong in an RTL page).
- **`activationMode="manual"`:** Radix supports roving-tabindex mode where
  arrows move focus but don't auto-select (manual activation). My tabs are
  automatic-only.
- **Wrapping `Home`/`End`:** handled identically, so that part matched.

### Disclosure

shadcn does not ship a disclosure component — the closest is Accordion
(`@radix-ui/react-accordion`). For a single disclosure my version is close to
correct, but Radix's Accordion adds multi-item type semantics, keyboard
navigation between items, and animations I don't need here.

## Bottom line

The hand-built components pass the keyboard tests and the core ARIA roles, but
Radix/shadcn handles the **hard 20%**: scroll lock, background `aria-hidden`,
portals, and robust focus scoping. Those are exactly the parts that are
invisible in a happy-path demo and obvious to a screen-reader user or on a real
phone. Next time I reach for a library for the dialog rather than hand-rolling
it — the pattern is deceptively deep.

## Verification

- `npm run build` — TypeScript compiles clean, no `any` in component props.
- `npm test` — 3 keyboard tests pass (modal trap/escape/restore, tabs arrows,
  disclosure Space/Enter).
