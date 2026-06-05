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
  const [isFooterMounted, setIsFooterMounted] = useState(false);
  const isFooterMountedRef = useRef(false);
  const footerHeightRef = useRef(0);
  // Exit anchor: scrollTop when enter finishes
  const enterScrollTopRef = useRef(-1);
  // Enter anchor: scrollTop when atEnd is first detected
  const atEndScrollTopRef = useRef(-1);
  // Prevents re-triggering enter after footer reaches translateY(0)
  const enterCompleteRef = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = scrollRef.current;
    const lastEl = lastItemRef.current;
    if (!container || !lastEl) return;

    container.scrollTo({ top: 0, behavior: "instant" });

    setIsFooterMounted(false);
    isFooterMountedRef.current = false;

    enterScrollTopRef.current = -1;
    atEndScrollTopRef.current = -1;
    enterCompleteRef.current = false;
    if (contentDivRef.current) {
      contentDivRef.current.style.paddingBottom = "0px";
      contentDivRef.current.style.transform = "";
      contentDivRef.current.style.transition = "";
    }

    const onScroll = () => {
      const containerBottom = container.getBoundingClientRect().bottom;
      const lastBottom = lastEl.getBoundingClientRect().bottom;
      const newAtEnd = lastBottom <= containerBottom + 4;

      // First time reaching end: record anchor and mount footer.
      // queueMicrotask defers setIsFooterMounted(true) past the current sync batch,
      // ensuring React sees false→true as two distinct commits so useLayoutEffect fires.
      if (newAtEnd && !isFooterMountedRef.current && atEndScrollTopRef.current < 0) {
        atEndScrollTopRef.current = container.scrollTop;
        queueMicrotask(() => {
          if (!isFooterMountedRef.current && atEndScrollTopRef.current >= 0) {
            setIsFooterMounted(true);
          }
        });
      }

      const footerEl = footerRef.current;
      const contentDiv = contentDivRef.current;
      const footerHeight = footerHeightRef.current;

      if (footerEl && contentDiv && isFooterMountedRef.current && footerHeight > 0) {

        // ── EXIT (1:1) ────────────────────────────────────────────────────────
        if (enterScrollTopRef.current >= 0) {
          const scrolledBack = Math.max(0, enterScrollTopRef.current - container.scrollTop);
          const newY = Math.min(scrolledBack, footerHeight);

          if (newY > 0) {
            // Cancel any active spring before taking scroll control
            footerEl.style.transition = "";
            contentDiv.style.transition = "";
            contentDiv.style.transform = "";
            footerEl.style.transform = `translateY(${newY}px)`;
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

        // ── ENTER (1:1 + spring settle at completion) ─────────────────────────
        if (!enterCompleteRef.current && atEndScrollTopRef.current >= 0) {
          const scrolledPast = Math.max(0, container.scrollTop - atEndScrollTopRef.current);
          const newY = Math.max(0, footerHeight - scrolledPast);
          footerEl.style.transform = `translateY(${newY}px)`;

          if (newY <= 0) {
            enterCompleteRef.current = true;
            footerEl.style.pointerEvents = "auto";
            footerEl.style.zIndex = "";
            enterScrollTopRef.current = container.scrollTop;

            // Spring settle — footer and content pop up together then spring back in sync.
            // Both move identically so the zero gap between them is preserved throughout.
            footerEl.style.transition = "none";
            footerEl.style.transform = "translateY(-10px)";
            contentDiv.style.transition = "none";
            contentDiv.style.transform = "translateY(-10px)";
            footerEl.getBoundingClientRect(); // force reflow so browser sees the -10px state
            const spring = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
            footerEl.style.transition = spring;
            footerEl.style.transform = "translateY(0px)";
            contentDiv.style.transition = spring;
            contentDiv.style.transform = "translateY(0px)";
            footerEl.addEventListener("transitionend", () => {
              footerEl.style.transition = "";
              contentDiv.style.transition = "";
              contentDiv.style.transform = "";
            }, { once: true });
          }
        }
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [resetKey]);

  // useLayoutEffect runs synchronously before paint — two jobs:
  // 1. Sync isFooterMountedRef immediately (zero frame delay vs. a separate useEffect)
  // 2. On mount: push footer off-screen, reserve scroll space, set z-auto so footer
  //    enters from behind the carousel (scroll container is later in DOM, wins at z-auto)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    isFooterMountedRef.current = isFooterMounted;

    const footerEl = footerRef.current;
    const contentDiv = contentDivRef.current;
    if (!isFooterMounted || !footerEl || !contentDiv) return;

    const measured = footerEl.getBoundingClientRect().height || footerEl.offsetHeight;
    const footerHeight = measured > 0 ? measured : 220;

    footerHeightRef.current = footerHeight;
    footerEl.style.transform = `translateY(${footerHeight}px)`;
    footerEl.style.pointerEvents = "none";
    footerEl.style.zIndex = "auto"; // behind carousel during enter
    contentDiv.style.paddingBottom = `${footerHeight}px`;
  }, [isFooterMounted]);

  return { isFooterMounted };
}
