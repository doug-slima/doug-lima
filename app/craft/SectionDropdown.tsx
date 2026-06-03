"use client";

import { useState, useRef, useEffect } from "react";
import { CaretRight, CaretDown } from "@phosphor-icons/react";
import { type Section } from "./data";

interface SectionDropdownProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const labels: Record<Section, string> = {
  playground: "Playground",
  "selected-works": "Selected Works",
};

const other = (s: Section): Section =>
  s === "playground" ? "selected-works" : "playground";

export default function SectionDropdown({ activeSection, onSectionChange }: SectionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    function onOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 font-geist font-light text-[24px] leading-tight text-text-active bg-transparent border-0 p-0 cursor-pointer ${isOpen ? "invisible" : ""}`}
      >
        {labels[activeSection]}
        <CaretRight size={20} color="#3B4028" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute w-fit rounded-xl flex flex-col"
          style={{
            top: -20,
            left: -20,
            zIndex: 30,
            backgroundColor: "#F6F3E6",
            border: "1px solid #AFB4A7",
            boxShadow: "0 4px 12px -8px rgba(0,0,0,0.25)",
          }}
        >
          <button
            role="option"
            aria-selected
            onClick={close}
            className="flex items-center gap-2 font-geist font-light text-[24px] leading-tight text-text-active bg-transparent border-0 cursor-pointer text-left"
            style={{ padding: "20px 20px 8px 20px" }}
          >
            {labels[activeSection]}
            <CaretDown size={20} color="#3B4028" />
          </button>
          <button
            role="option"
            aria-selected={false}
            onClick={() => {
              onSectionChange(other(activeSection));
              close();
            }}
            className="font-geist font-light text-[24px] leading-tight bg-transparent border-0 cursor-pointer text-left"
            style={{ padding: "4px 20px 20px 20px", color: "#A6AA74" }}
          >
            {labels[other(activeSection)]}
          </button>
        </div>
      )}
    </div>
  );
}
