import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSettings } from "./useSettings";

const KEY = "smartcart-settings";

describe("useSettings", () => {
  it("starts with defaults when nothing is stored", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toEqual({
      apiKey: "",
      model: "gpt-4",
      storeUrls: [],
    });
  });

  it("reads persisted settings from localStorage", () => {
    const stored = { apiKey: "sk-test", model: "gemini-pro", storeUrls: ["https://a.com"] };
    localStorage.setItem(KEY, JSON.stringify(stored));
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toEqual(stored);
    localStorage.clear();
  });

  it("falls back to defaults on corrupted JSON", () => {
    localStorage.setItem(KEY, "{not valid json");
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.apiKey).toBe("");
    localStorage.clear();
  });

  it("saves settings to localStorage and reports success", async () => {
    const { result } = renderHook(() => useSettings());
    const next = { apiKey: "sk-new", model: "claude-3" as const, storeUrls: ["https://b.com"] };
    await act(async () => {
      await result.current.saveSettings(next);
    });
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(next);
    expect(result.current.settings).toEqual(next);
    expect(result.current.status).toBe("success");
    localStorage.clear();
  });

  it("resets to defaults and clears storage", () => {
    localStorage.setItem(KEY, JSON.stringify({ apiKey: "sk-x", model: "gpt-4", storeUrls: [] }));
    const { result } = renderHook(() => useSettings());
    act(() => result.current.resetSettings());
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(result.current.settings.apiKey).toBe("");
  });
});
