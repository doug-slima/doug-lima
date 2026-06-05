"use client";

import { forwardRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import Monogram from "./Monogram";

interface PageFooterProps {
  /** Only required for "floating" variant — used for onWheel forwarding */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  /** Optional center slot — Prev/Next control on Craft, empty on Track and Home */
  center?: React.ReactNode;
  /** Right slot — Back to top, Contact button, etc. */
  right: React.ReactNode;
  /**
   * "floating": absolute-positioned, animated (track).
   * "inline":   in-flow inside the scroll container — no absolute, no z-index (craft desktop).
   * "static":   in-flow, simplified layout (home).
   * Default: "floating".
   */
  variant?: "floating" | "inline" | "static";
}

const PageFooter = forwardRef<HTMLDivElement, PageFooterProps>(
  function PageFooter({ scrollRef, center, right, variant = "floating" }, ref) {
    if (variant === "static") {
      return (
        <div ref={ref} className="mt-auto flex items-center justify-between">
          <Monogram widthClass="w-[123px] md:w-[154px]" />
          {right}
        </div>
      );
    }

    if (variant === "inline") {
      return (
        <div
          ref={ref}
          className="bg-bg-base grid grid-cols-3 items-center px-[72px] py-20"
        >
          <Monogram widthClass="w-[123px] md:w-[154px]" className="monogram-enter" />
          <div className="flex justify-center">{center}</div>
          <div className="flex justify-end">{right}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        onWheel={(e) => {
          if (!scrollRef?.current) return;
          const delta = e.deltaMode === 0 ? e.deltaY : e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY * window.innerHeight;
          scrollRef.current.scrollBy({ top: delta });
        }}
        className="absolute bottom-0 left-0 right-0 z-20 bg-bg-base grid grid-cols-3 items-center px-[72px] py-20"
      >
        <Monogram widthClass="w-[123px] md:w-[154px]" className="monogram-enter" />
        <div className="flex justify-center">{center}</div>
        <div className="flex justify-end">{right}</div>
      </div>
    );
  }
);

export default PageFooter;

// ── Shared footer buttons ────────────────────────────────────────────────────

interface FooterBackToTopProps {
  onClick: () => void;
}

export function FooterBackToTop({ onClick }: FooterBackToTopProps) {
  return (
    <button
      onClick={onClick}
      className="h-[56px] pl-6 pr-5 rounded-full flex items-center gap-2 font-fenix text-[20px] text-text-default cursor-pointer border border-[#AFB4A7] hover:bg-[#E8E9D9] hover:border-transparent active:bg-[#C7FF04] active:border-transparent"
    >
      back to top <ArrowUp size={18} />
    </button>
  );
}
