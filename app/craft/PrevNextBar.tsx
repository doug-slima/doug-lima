"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface PrevNextBarProps {
  onPrev: () => void;
  onNext: () => void;
}

export default function PrevNextBar({ onPrev, onNext }: PrevNextBarProps) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[20]"
      style={{ backgroundColor: "#313621", paddingTop: "24px", paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
    >
      <div
        className="mx-10 h-[56px] rounded-full flex items-center justify-between px-5"
        style={{ backgroundColor: "#121210", boxShadow: "0px 16px 48px -8px rgba(12,12,13,0.50)" }}
      >
        <button
          onClick={onPrev}
          aria-label="Previous project"
          className="flex items-center gap-2 font-fenix text-[18px] cursor-pointer border-0 bg-transparent"
          style={{ color: "#FAFAF5" }}
        >
          <CaretLeft size={18} color="#FAFAF5" /> Prev
        </button>
        <button
          onClick={onNext}
          aria-label="Next project"
          className="flex items-center gap-2 font-fenix text-[18px] cursor-pointer border-0 bg-transparent"
          style={{ color: "#FAFAF5" }}
        >
          Next <CaretRight size={18} color="#FAFAF5" />
        </button>
      </div>
    </div>
  );
}
