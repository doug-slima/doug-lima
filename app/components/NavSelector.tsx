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
}

function itemClass(active: boolean, variant: "pill" | "underline") {
  if (variant === "pill") {
    return active
      ? "flex items-center px-3 md:px-4 h-[28px] md:h-[32px] rounded-full font-fenix text-[20px] md:text-[24px] text-text-active bg-[#C7FF04]"
      : "flex items-center px-3 md:px-4 h-[28px] md:h-[32px] rounded-full font-fenix text-[20px] md:text-[24px] text-text-default ring-inset ring-1 ring-[#AFB4A7] hover:text-text-active hover:bg-[#E8E9D9] hover:ring-0 transition-all";
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
}: NavSelectorProps) {
  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={itemClass(item.active, variant)}>
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`${itemClass(item.active, variant)} bg-transparent border-0 p-0 cursor-pointer text-left`}
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
