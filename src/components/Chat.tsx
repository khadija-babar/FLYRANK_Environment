"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useAutoScroll } from "@/hooks/useAutoScroll";

function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export function Chat() {
  const { messages, status, sendMessage, stop } = useChat();
  const [input, setInput] = useState("");
  const { containerRef, pinned, stale, markStale, jumpToLatest } = useAutoScroll();
  const lastCount = useRef(messages.length);
  const isLoading = status === "submitted" || status === "streaming";

  const latest = messages[messages.length - 1];
  const isAssistant = latest?.role === "assistant";
  const hasContent = isAssistant && messageText(latest.parts).length > 0;
  // Track whether we've started a new turn so the thinking indicator resets.
  useEffect(() => {
    if (messages.length !== lastCount.current) {
      lastCount.current = messages.length;
    }
  }, [messages.length]);

  // Auto-scroll: follow new content only while pinned; otherwise flag "stale"
  // so a jump-to-latest button appears. This is the robustness bar from the
  // assignment: pin while at bottom, release the moment the user scrolls up.
  useEffect(() => {
    if (pinned) {
      const el = containerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } else if (messages.length > 0) {
      markStale();
    }
  }, [messages, isLoading, pinned, containerRef, markStale]);

  return (
    <div className="relative flex h-full flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">
              Ask SmartCart to compare prices, e.g. &quot;Cheapest 24-pack AA batteries
              across my stores?&quot;
            </p>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const content = messageText(m.parts);
            return (
              <div key={i} className={isUser ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    isUser
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-violet-600 px-4 py-2.5 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800"
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{content}</p>
                  ) : (
                    <>
                      {/* Thinking indicator BEFORE the first token. It stays
                          visible until content actually arrives, so there is no
                          flicker gap at the handoff. */}
                      {isLoading && !hasContent && (
                        <p aria-label="SmartCart is thinking" className="flex items-center gap-1.5 py-1">
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{content}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jump-to-latest affordance, only when the user scrolled away from
          the bottom while new content streamed in. */}
      {stale && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 flex justify-center">
          <button
            type="button"
            onClick={jumpToLatest}
            className="pointer-events-auto rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50"
          >
            Jump to latest ↓
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input.trim() });
            setInput("");
          }
        }}
        className="border-t border-slate-200 bg-white p-4"
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter makes a new line.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Describe a product to compare…"
            aria-label="Message"
            className="max-h-40 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
          {isLoading ? (
            // Stop is a state problem, not a UI one: after stop() the partial
            // message persists in state, input re-enables, and the next send
            // starts a fresh turn. "Stop, then send again" must work.
            <button
              type="button"
              onClick={() => stop()}
              className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}