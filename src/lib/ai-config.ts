// lib/ai.ts
// ------------------------------------------------------------------
// Central model + system prompt configuration for the SmartCart Lite
// AI assistant. Keep model and prompt changes here, NOT scattered in
// route handlers or components.
//
// Provider: Google Gemini (free tier) via the AI SDK. The brief allows
// any LLM; Gemini is used because it offers a free API key. Swapping to
// Anthropic later is a one-line change (createAnthropic + provider import).
// ------------------------------------------------------------------

import { google } from "@ai-sdk/google";

// The model used for streaming chat responses.
// - gemini-2.0-flash: fast, cheap, good for chat. Update freely.
export const MODEL_ID = "gemini-2.0-flash";

// The model instance bound to the system prompt. Model-level tuning (like
// temperature) moved to call settings in the AI SDK v4 provider API, so it
// is configured per-request in the chat route.
export const MODEL = google(MODEL_ID);

// The system prompt defines the assistant's role and rules. It is the ONLY
// copy that governs behavior, so it lives here in one commented block.
export const SYSTEM_PROMPT = `You are SmartCart, the price-comparison assistant inside the SmartCart Lite app.

Your job: help the user compare prices for equivalent products across the stores they track. They will describe a product they want (e.g. "which store has the cheapest 24-pack of AA batteries?") or paste product listings.

Follow these rules:
- Be direct, warm, technical but plain. No fluff, no filler phrases.
- When comparing, list each store with its price and the winner clearly (e.g. "Cheapest: Store B at $12.99").
- If the user gives vague or incomplete product info, ask ONE targeted clarifying question before guessing.
- Never invent prices or store names. If you don't have a real price, say you need current data and ask them to paste it.
- Keep answers short. One comparison + a one-line reason.`;

// Approximate cap on response length. Streams finish before this on their
// own; this is a safety bound for very long prompts.
export const MAX_TOKENS = 1024;