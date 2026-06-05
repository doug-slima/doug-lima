"use client";

import Link from "next/link";

interface SelectorItem {
  label: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
}

interface NavSelectorProps {
  items: SelectorItem[];
  variant?: "pill" | "underline";
  direction?: "row" | "col";
  gap?: number;
  className?: string;
  textSize?: string;
  pillHeight?: string;
}

function itemClass(active: boolean, variant: "pill" | "underline", textSize: string, pillHeight: string) {
  if (variant === "pill") {
    return active
      ? `flex-shrink-0 flex items-center px-[clamp(12px,3.5vw,20px)] md:px-5 ${pillHeight} rounded-full font-fenix ${textSize} text-text-active bg-[#C7FF04]`
      : `flex-shrink-0 flex items-center px-[clamp(12px,3.5vw,20px)] md:px-5 ${pillHeight} rounded-full font-fenix ${textSize} text-text-default bg-[#F9F9F2] ring-inset ring-1 ring-[#AFB4A7] hover:text-text-active hover:bg-[#E8E9D9] hover:ring-0 transition-all`;
  }
  return active
    ? "w-fit font-fenix text-[24px] text-text-active underline decoration-text-active underline-offset-[3px]"
    : "w-fit font-fenix text-[24px] text-text-default hover:text-text-active hover:underline hover:decoration-text-active hover:underline-offset-[3px] transition-colors";
}

export default function NavSelector({
  items,
  variant = "pill",
  direction = "row",
  gap = 8,
  className = "",
  textSize = "text-[20px] md:text-[24px]",
  pillHeight = "h-[32px]",
}: NavSelectorProps) {
  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={itemClass(item.active, variant, textSize, pillHeight)}>
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`${itemClass(item.active, variant, textSize, pillHeight)} border-0 py-0 cursor-pointer text-left`}
            style={item.active && variant === "pill" ? { backgroundColor: "#C7FF04" } : undefined}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
