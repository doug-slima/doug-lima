"use client";

import { useState, useEffect, useRef } from "react";
import { CaretRight, CaretDown } from "@phosphor-icons/react";
import { type Section } from "./data";

const labels: Record<Section, string> = {
  playground: "Playground",
  "selected-works": "Selected Works",
};

const other = (s: Section): Section =>
  s === "playground" ? "selected-works" : "playground";

// Trigger height per breakpoint — open border-radius is always height / 2
const TRIGGER_HEIGHT = { mobile: 48, desktop: 56 } as const;
const OPEN_RADIUS = {
  mobile: TRIGGER_HEIGHT.mobile / 2,
  desktop: TRIGGER_HEIGHT.desktop / 2,
} as const;

interface Props {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function SectionDropdown({ activeSection, onSectionChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function onOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [isOpen]);

  const triggerColor = hoveredOption ? "#FAFAF5" : (isOpen || hovered) ? "#C7FF04" : "#FAFAF5";
  const openRadius = isDesktop ? OPEN_RADIUS.desktop : OPEN_RADIUS.mobile;

  return (
    <div
      ref={containerRef}
      className="self-start flex-shrink-0 relative h-[48px] md:h-[56px]"
      style={{ zIndex: isOpen ? 50 : undefined }}
    >
      {/* width reference — in-flow, sets wrapper width to max label width */}
      <div
        aria-hidden
        className="px-6 flex items-center gap-6 font-geist font-light text-[18px] whitespace-nowrap"
        style={{ height: 0, overflow: "hidden", visibility: "hidden" }}
      >
        {labels["selected-works"]}
        <CaretRight size={16} />
      </div>

      {/* pill — absolute so expansion doesn't displace the layout below */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col overflow-hidden"
        style={{
          backgroundColor: "#121210",
          borderRadius: isOpen ? `${openRadius}px` : "9999px",
          boxShadow: isOpen ? "0px 4px 12px -8px rgba(0,0,0,0.25)" : undefined,
        }}
      >
        {/* trigger row — always visible */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="h-[48px] md:h-[56px] px-6 w-full flex items-center justify-between gap-6 font-geist font-light text-[18px] cursor-pointer border-0 bg-transparent text-left whitespace-nowrap"
          style={{ color: triggerColor }}
        >
          {labels[activeSection]}
          {isOpen
            ? <CaretDown size={16} color={triggerColor} />
            : <CaretRight size={16} color={triggerColor} />}
        </button>

        {/* other option — height collapses when closed */}
        <button
          onClick={() => { onSectionChange(other(activeSection)); setIsOpen(false); }}
          onMouseEnter={() => setHoveredOption(true)}
          onMouseLeave={() => setHoveredOption(false)}
          tabIndex={isOpen ? 0 : -1}
          className="px-6 font-geist font-light text-[18px] cursor-pointer border-0 bg-transparent text-left whitespace-nowrap"
          style={{
            color: hoveredOption ? "#C7FF04" : "#FAFAF5",
            height: isOpen ? "auto" : 0,
            paddingBottom: isOpen ? "16px" : 0,
            overflow: "hidden",
          }}
        >
          {labels[other(activeSection)]}
        </button>
      </div>
    </div>
  );
}
