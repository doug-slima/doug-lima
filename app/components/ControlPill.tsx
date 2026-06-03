"use client";

import { ArrowUp } from "@phosphor-icons/react";

interface ControlPillProps {
  atEnd: boolean;
  onScrollToTop: () => void;
}

export default function ControlPill({ atEnd, onScrollToTop }: ControlPillProps) {
  if (atEnd) {
    return (
      <button
        onClick={onScrollToTop}
        className="h-[56px] pl-6 pr-5 gap-2 rounded-full bg-[#A6AA74]/20 hover:bg-[#F6F3E6] hover:ring-1 hover:ring-[#DEDDCE] font-fenix text-[20px] text-[#3B4028] cursor-pointer flex items-center border-0 transition-all"
      >
        back to top <ArrowUp size={20} />
      </button>
    );
  }
  return (
    <div className="h-[56px] px-6 rounded-full bg-[#A6AA74]/20 font-fenix text-[20px] text-[#3B4028] cursor-default flex items-center">
      swipe-up to see more
    </div>
  );
}
