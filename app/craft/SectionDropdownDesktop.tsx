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

interface Props {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function SectionDropdownDesktop({ activeSection, onSectionChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        backgroundColor: "#121210",
        borderRadius: isOpen ? "28px" : "9999px",
        boxShadow: isOpen ? "0px 4px 12px -8px rgba(0,0,0,0.25)" : undefined,
      }}
    >
      {/* width reference — always "Selected Works" + gap + chevron, sets container to max trigger width */}
      <div
        aria-hidden
        className="px-6 flex items-center gap-6 font-geist font-light text-[18px] whitespace-nowrap"
        style={{ height: 0, overflow: "hidden", visibility: "hidden" }}
      >
        {labels["selected-works"]}
        <CaretRight size={16} />
      </div>

      {/* trigger row — always visible */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="h-[56px] px-6 w-full flex items-center justify-between gap-6 font-geist font-light text-[18px] cursor-pointer border-0 bg-transparent text-left whitespace-nowrap"
        style={{ color: triggerColor }}
      >
        {labels[activeSection]}
        {isOpen
          ? <CaretDown size={16} color={triggerColor} />
          : <CaretRight size={16} color={triggerColor} />}
      </button>

      {/* other option — always rendered, height collapses when closed */}
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
  );
}
