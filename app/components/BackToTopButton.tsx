"use client";

import { ArrowUp } from "@phosphor-icons/react";

interface BackToTopButtonProps {
  paddingBottom: number;
  zIndex?: number;
}

export default function BackToTopButton({ paddingBottom, zIndex = 30 }: BackToTopButtonProps) {
  return (
    <div
      className="control-bar-enter md:hidden fixed bottom-0 left-0 right-0 px-10 flex justify-end"
      style={{ paddingBottom: `calc(${paddingBottom}px + env(safe-area-inset-bottom))`, zIndex, pointerEvents: "none" }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="h-[56px] px-5 rounded-full flex items-center gap-2 font-fenix text-[18px] text-text-default cursor-pointer"
        style={{
          backgroundColor: "#F6F3E6",
          border: "1px solid #D0D1B3",
          boxShadow: "0px 4px 12px -8px rgba(0,0,0,0.25)",
          pointerEvents: "auto",
        }}
      >
        Back to top <ArrowUp size={18} />
      </button>
    </div>
  );
}
