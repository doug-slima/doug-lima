import { useState, useRef, useEffect, useLayoutEffect } from "react";

/**
 * Shared logic for the two-column split layout used in /track and /craft.
 *
 * Left column: fixed, measured to position the right column 80px to its right.
 * Right column: scrollable with first/last items centered at 50vh.
 *
 * resetDeps: when these values change, scroll resets to top and layout is re-measured.
 * Pass [] (default) for static content like /track.
 * Pass [activeProject] for dynamic content like /craft.
 */
export function useSplitLayout(resetDeps: unknown[] = [], blurHeight: number = 185) {
  const [atEnd, setAtEnd] = useState(false);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [rightColLeft, setRightColLeft] = useState(492);

  const rightColRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const leftEl = leftContentRef.current;
    const firstEl = firstItemRef.current;
    const lastEl = lastItemRef.current;
    if (!leftEl || !firstEl || !lastEl) return;

    const half = window.innerHeight / 2;

    setRightColLeft(leftEl.getBoundingClientRect().right + 80);
    setPaddingTop(Math.max(0, half - blurHeight - firstEl.offsetHeight / 2));
    setPaddingBottom(Math.max(0, half - lastEl.offsetHeight / 2));
  }, resetDeps);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = rightColRef.current;
    container?.scrollTo({ top: 0, behavior: "instant" });
    setAtEnd(false);

    const lastEl = lastItemRef.current;
    if (!container || !lastEl) return;

    const onScroll = () => {
      const containerBottom = container.getBoundingClientRect().bottom;
      const lastBottom = lastEl.getBoundingClientRect().bottom;
      setAtEnd(lastBottom <= containerBottom + 4);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, resetDeps);

  const scrollToTop = () => {
    rightColRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    refs: { rightColRef, leftContentRef, firstItemRef, lastItemRef },
    state: { atEnd, paddingTop, paddingBottom, rightColLeft },
    scrollToTop,
  };
}
