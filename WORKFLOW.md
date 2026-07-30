# WORKFLOW.md — AI-Assisted Workflow Drill

## Overview

I built a settings form (API key, model selection, store URLs) for my SmartCart Lite capstone project twice: once with a single vague prompt and once with a precise, spec-driven prompt with verification. This file documents what the diff taught me.

## Branch `r1-vague` — One lazy prompt

**Prompt used:** "Add a settings page to my app."

The AI produced a single `Settings.tsx` file: a functional component with three inline-styled fields and an `alert()` on save. No TypeScript types, no validation, no error handling, no persistence, no tests. The `alert()` is not accessible — screen readers don't announce it reliably. The API key field uses `type="text"` instead of `type="password"`, leaking sensitive input visually. Empty submission succeeds silently. The component is not wired into `App.tsx` at all — it was dropped as a standalone file with no integration.

**Time spent:** 2 minutes to write the prompt + 1 minute to accept and save. Review caught nothing because I didn't really review — that was the point.

## Branch `r2-precise` — Spec-driven with verification

**Prompt:** (structured as file references + constraints + example + verification step)

"Create a settings form for SmartCart Lite with three fields: API Key (password input, min 8 chars validation), AI Model (dropdown: gpt-4, gpt-3.5, claude-3, gemini-pro), Store URLs (textarea, comma-separated, each must start with http/https). Use react-hook-form + zod for validation. Write types in src/types/settings.ts, a reusable form component in src/components/SettingsForm.tsx, a useSettings hook for localStorage persistence with save/reset/status, and wire it into App.tsx. Add tests in SettingsForm.test.tsx covering: renders all fields, shows validation errors for empty API key, shows validation error for invalid URLs, disables submit when saving, shows success/error messages. Use aria-invalid, aria-describedby, and role=alert for accessibility. Run tests and fix until all pass."

**What was different:**
- **Types:** Strict TS interfaces for Settings, SettingsFormData, SaveStatus, errors — no `any` anywhere
- **Validation:** Zod schema checks minimum key length, URL format, non-empty store list. Errors render inline with role="alert"
- **Persistence:** LocalStorage through a custom hook with idle/saving/success/error states
- **Accessibility:** All inputs have `htmlFor` labels, password input masks the key, ARIA attributes on error bindings, `role="status"` for success message
- **Tests:** 6 passing tests including validation, disabled state, and status messages
- **Integration:** Component is wired into App.tsx and renders on load

**AI mistake caught:** The initial test used `toBeInTheDocument` without the jest-dom setup file — the AI assumed it was pre-configured. The `userEvent` import wasn't installed either. Fixing these required adding the setup file and installing the missing package — a 2-minute fix, but an error the AI should have caught if it verified its own assumptions.

**Time spent:** 15 minutes to write the precise prompt + 5 minutes to fix the test setup + 2 minutes to tweak the disabled/`isDirty` logic (button was locked on pristine form, preventing validation from showing on first click). Total: 22 minutes.

## Comparison

| Dimension | r1-vague | r2-precise |
|-----------|----------|------------|
| Files | 1 (unwired) | 5 (wired + types + hook + tests) |
| Correctness | No validation | Zod schema with 3 rules |
| Accessibility | None | Labels, aria-*, role=alert |
| Edge cases | None | Loading, empty, error states |
| Tests | 0 | 6 passing |
| Review effort | 1 min (nothing to catch) | 5 min (caught test setup bug) |
| Total time | 3 min | 22 min |

## Key lesson

Round two felt slower but produced production-quality code on the first real attempt. The vague prompt looked faster but the output was unusable — it would need the same 22 minutes of rework anyway, just done reactively during debugging rather than proactively in the spec. The precise prompt also caught one AI mistake (missing test dependencies/configuration) that the vague approach wouldn't have exposed until CI failed.

The single biggest time saver was including "write tests and run them" in the prompt — the AI self-corrected several issues when the tests failed that I never had to look at.
