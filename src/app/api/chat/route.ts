// app/api/chat/route.ts
// ------------------------------------------------------------------
// Server-side route for the streaming chat. Uses the AI SDK's
// streamText to call Gemini, returning a text stream to useChat.
//
// The API key is read from process.env.GOOGLE_GENERATIVE_AI_API_KEY at
// runtime — it lives ONLY on the server (Vercel env var). It is never
// shipped to the browser.
// ------------------------------------------------------------------

import { streamText } from "ai";
import { MODEL, SYSTEM_PROMPT, MAX_TOKENS } from "@/lib/ai-config";

export const maxDuration = 30; // allow long streams on Vercel

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Guard: refuse to run if the key isn't configured on the server.
  // Returns a clear message instead of a confusing 500.
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response("Server API key is not configured.", { status: 500 });
  }

  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages,
    temperature: 0.7,
    maxOutputTokens: MAX_TOKENS,
  });

  // Return the SSE stream. useChat consumes this on the client.
  return result.toUIMessageStreamResponse();
}