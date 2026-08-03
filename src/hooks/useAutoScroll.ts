// hooks/useAutoScroll.ts
// ------------------------------------------------------------------
// Pin-to-bottom auto-scroll that releases the moment the user scrolls up.
//
// The classic failure mode: an unconditional scrollIntoView on every token
// yanks the user back down while they're trying to read earlier messages.
// This hook only follows new content when the user is already at the
// bottom, and surfaces a "jump to latest" flag otherwise.
// ------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

export function useAutoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  // pinned = user is at the bottom, so new content should keep us down there
  const [pinned, setPinned] = useState(true);
  // stale = content arrived while the user was scrolled up (show jump button)
  const [stale, setStale] = useState(false);

  // Track scroll position on every scroll event.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const atBottom = distanceFromBottom < 40;
      setPinned(atBottom);
      if (atBottom) setStale(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Follow new content while pinned.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (pinned) {
      el.scrollTop = el.scrollHeight;
    }
  });

  // When the user isn't pinned and new content arrives, flag it stale.
  const markStale = () => {
    setStale(true);
  };

  // Jump to the newest content.
  const jumpToLatest = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setPinned(true);
    setStale(false);
  };

  return { containerRef, pinned, stale, markStale, jumpToLatest };
}