import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoScroll } from "./useAutoScroll";

function makeContainer(): HTMLDivElement {
  const el = document.createElement("div");
  Object.defineProperty(el, "clientHeight", { value: 300, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: 1000, writable: true, configurable: true });
  Object.defineProperty(el, "scrollTop", { value: 0, writable: true, configurable: true });
  return el;
}

describe("useAutoScroll", () => {
  it("returns refs and defaults pinned=true, stale=false", () => {
    const { result } = renderHook(() => useAutoScroll());
    expect(result.current.pinned).toBe(true);
    expect(result.current.stale).toBe(false);
    expect(result.current.containerRef).toBeDefined();
  });

  it("marks stale when content arrives while scrolled up", () => {
    const { result } = renderHook(() => useAutoScroll());
    const el = makeContainer();
    el.scrollTop = 0; // user at top -> not pinned
    act(() => {
      result.current.containerRef.current = el;
      el.dispatchEvent(new Event("scroll"));
    });
    act(() => result.current.markStale());
    expect(result.current.stale).toBe(true);
  });

  it("jumpToLatest pins back to the bottom and clears stale", () => {
    const { result } = renderHook(() => useAutoScroll());
    const el = makeContainer();
    act(() => {
      result.current.containerRef.current = el;
      el.dispatchEvent(new Event("scroll"));
    });
    act(() => result.current.markStale());
    expect(result.current.stale).toBe(true);
    act(() => result.current.jumpToLatest());
    expect(result.current.pinned).toBe(true);
    expect(result.current.stale).toBe(false);
    expect(el.scrollTop).toBe(1000);
  });
});
