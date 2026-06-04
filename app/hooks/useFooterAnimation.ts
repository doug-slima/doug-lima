"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";

interface Options {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  lastItemRef: React.RefObject<HTMLDivElement | null>;
  contentDivRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
  /** Changes to this key reset scroll position and animation state — pass activeProject, etc. */
  resetKey?: string;
}


export function useFooterAnimation({
  scrollRef,
  lastItemRef,
  contentDivRef,
  footerRef,
  resetKey = "",
}: Options) {
  const [atEnd, setAtEnd] = useState(false);
  const [isFooterMounted, setIsFooterMounted] = useState(false);
  const isFooterMountedRef = useRef(false);
  // Exit anchor: scrollTop when enter finishes; exit is measured from this point
  const enterScrollTopRef = useRef(-1);
  // Enter anchor: scrollTop when atEnd is first detected
  const atEndScrollTopRef = useRef(-1);
  // Prevents re-triggering enter scroll logic after footer reaches translateY(0)
  const enterCompleteRef = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = scrollRef.current;
    const lastEl = lastItemRef.current;
    if (!container || !lastEl) return;

    container.scrollTo({ top: 0, behavior: "instant" });
    setAtEnd(false);
    setIsFooterMounted(false);
    isFooterMountedRef.current = false;
    enterScrollTopRef.current = -1;
    atEndScrollTopRef.current = -1;
    enterCompleteRef.current = false;
    if (contentDivRef.current) contentDivRef.current.style.paddingBottom = "0px";

    const onScroll = () => {
      const containerBottom = container.getBoundingClientRect().bottom;
      const lastBottom = lastEl.getBoundingClientRect().bottom;
      const newAtEnd = lastBottom <= containerBottom + 4;

      // First time reaching end: record anchor and mount footer
      if (newAtEnd && !isFooterMountedRef.current && atEndScrollTopRef.current < 0) {
        atEndScrollTopRef.current = container.scrollTop;
        setIsFooterMounted(true);
      }

      const footerEl = footerRef.current;
      const contentDiv = contentDivRef.current;

      if (footerEl && contentDiv && isFooterMountedRef.current) {
        const footerHeight = footerEl.offsetHeight;

        // ── SCROLL-DRIVEN EXIT ─────────────────────────────────────────────────
        if (enterScrollTopRef.current >= 0) {
          const scrolledBack = Math.max(0, enterScrollTopRef.current - container.scrollTop);
          const newY = Math.min(scrolledBack * 0.6, footerHeight);
          footerEl.style.transform = `translateY(${newY}px)`;

          if (newY > 0) {
            footerEl.style.zIndex = "auto";
            footerEl.style.pointerEvents = "none";
          } else {
            footerEl.style.zIndex = "";
            footerEl.style.pointerEvents = "auto";
          }

          if (newY >= footerHeight) {
            enterScrollTopRef.current = -1;
            enterCompleteRef.current = false;
            atEndScrollTopRef.current = -1;
            isFooterMountedRef.current = false;
            setIsFooterMounted(false);
            contentDiv.style.paddingBottom = "0px";
          }
        }

        // ── SCROLL-DRIVEN ENTER ────────────────────────────────────────────────
        // Footer rises 1:1 with scroll — same feel as the exit, mirrored
        if (!enterCompleteRef.current && atEndScrollTopRef.current >= 0) {
          const scrolledPast = Math.max(0, container.scrollTop - atEndScrollTopRef.current);
          const newY = Math.max(0, footerHeight - scrolledPast);
          footerEl.style.transform = `translateY(${newY}px)`;

          if (newY <= 0) {
            enterCompleteRef.current = true;
            footerEl.style.transform = "translateY(0px)";
            footerEl.style.pointerEvents = "auto";
            footerEl.style.zIndex = "";
            enterScrollTopRef.current = container.scrollTop;
          }
        }
      }

      setAtEnd(newAtEnd);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [resetKey]);

  // Keep ref in sync so scroll listener reads current mounted state
  useEffect(() => { isFooterMountedRef.current = isFooterMounted; }, [isFooterMounted]);

  // Before first paint: hide footer below viewport and add scroll space for enter + bounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const footerEl = footerRef.current;
    const contentDiv = contentDivRef.current;
    if (!isFooterMounted || !footerEl || !contentDiv) return;
    const footerHeight = footerEl.offsetHeight;
    footerEl.style.transform = `translateY(${footerHeight}px)`;
    footerEl.style.pointerEvents = "none";
    contentDiv.style.paddingBottom = `${footerHeight}px`;
  }, [isFooterMounted]);

  return { isFooterMounted, atEnd };
}
