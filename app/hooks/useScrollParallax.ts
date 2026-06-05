"use client";

import { useEffect } from "react";

interface Options {
  elementRef: React.RefObject<HTMLElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /**
   * How much the element lags behind the scroll container.
   * 0 = no parallax. 1 = element doesn't move at all.
   * Default: 0.4 (element moves at 60% of scroll speed).
   */
  factor?: number;
  /** Changing this key resets the parallax — pass activeProject, section, etc. */
  resetKey?: string;
}

/**
 * Scroll-driven parallax for an in-flow element inside a custom scroll container.
 *
 * Formula: translateY = factor × (scrollTop − scrollMax)
 * Always ≤ 0 — pulls the element above its natural position so it:
 *   • enters: peeks out from behind the content above as the user scrolls down
 *   • exits:  lingers while the content above (higher z-index) slides over it
 *
 * The caller is responsible for z-index layering:
 *   - scroll container: isolation: isolate
 *   - content above:    position: relative; z-index: 10
 *   - parallax element: no z-index (z-auto, below content above)
 */
export function useScrollParallax({
  elementRef,
  scrollRef,
  factor = 0.4,
  resetKey = "",
}: Options) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = scrollRef.current;
    const el = elementRef.current;
    if (!container || !el) return;

    const onScroll = () => {
      const scrollMax = container.scrollHeight - container.clientHeight;
      if (scrollMax <= 0) return;
      el.style.transform = `translateY(${factor * (container.scrollTop - scrollMax)}px)`;
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (elementRef.current) elementRef.current.style.transform = "";
    };
  }, [resetKey]);
}
