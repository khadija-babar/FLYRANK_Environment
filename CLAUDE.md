# CLAUDE.md — SmartCart Lite

## Project
SmartCart Lite — an AI-assisted frontend project for the FlyRank AI Frontend Engineer internship. A React web app where users add product listings from different stores, an AI API matches equivalent products across stores, and the UI shows a price comparison view with a running cart total.

## Stack
- Framework: Next.js (App Router) + React + TypeScript
- Styling: Tailwind CSS (utility classes + theme tokens in src/app/globals.css)
- Form handling: react-hook-form + zod for all form validation
- AI Integration: LLM API calls for product matching (provider TBD)
- Version control: Git + GitHub (deployed via Vercel)
- AI-assisted dev: Claude, Gemini CLI
- Server Components by default; add `"use client"` only where interactivity is needed (e.g. the settings form)

## Conventions
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Components: functional components with hooks, one component per file
- Code style: camelCase for variables/functions, PascalCase for components, strict TypeScript (no `any`)
- Branching: feature branches from main; one branch per assignment round

## Project Rules (from workflow drill)
1. Forms always use react-hook-form + zod for validation — never uncontrolled inputs or manual onChange validation
2. Every component must have a corresponding `.test.tsx` file with tests for: render, validation errors, disabled states, and status messages (loading/success/error)
3. Accessibility is non-negotiable: every input needs a label (`htmlFor`), error states need `role="alert"`, and sensitive fields must use appropriate `type` attributes (e.g. `password` for API keys)

## Notes
This project is in early Setup phase. Stack details (styling library, AI provider, backend if any) will be finalized as the project develops.
