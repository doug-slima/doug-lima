"use client";

import { useState, useRef, useEffect } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";

const pillShadow: React.CSSProperties = {
  boxShadow: "0px 4px 12px -8px rgba(0,0,0,0.25)",
};

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstPillRef = useRef<HTMLAnchorElement>(null);
  const isKeyboardRef = useRef(false);

  useEffect(() => {
    const onKeyDown = () => { isKeyboardRef.current = true; };
    const onPointerDown = () => { isKeyboardRef.current = false; };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@douglima.work");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close = () => {
    setIsOpen(false);
    if (isKeyboardRef.current) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen && isKeyboardRef.current) firstPillRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="relative">

      {/* Trigger — hover: surface color matching NavSelector pill (desktop only) */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="w-[104px] h-[104px] rounded-full p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center md:hover:bg-[#E8E9D9] md:transition-all"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/home/avatar-doug.png"
          alt="Contact"
          className="h-[56px] w-[56px] object-contain"
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop — click outside to close */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(243, 242, 230, 0.10)" }}
            onClick={close}
          />

          {/* Content panel — bottom-right anchored to trigger's position */}
          <div className="absolute bottom-0 right-0 z-50 flex flex-col items-end gap-3 min-w-[160px]">

            <a
              ref={firstPillRef}
              href="https://www.linkedin.com/in/dougslima/?locale=en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default border border-[#AFB4A7] hover:bg-[#E8E9D9] hover:border-transparent active:bg-[#C7FF04] active:border-transparent"
              style={pillShadow}
            >
              Linkedin
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/linkedin-logo.png" alt="" aria-hidden="true" className="h-[22px]" />
            </a>

            <a
              href="https://substack.com/@douglima"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default border border-[#AFB4A7] hover:bg-[#E8E9D9] hover:border-transparent active:bg-[#C7FF04] active:border-transparent"
              style={pillShadow}
            >
              Substack
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/substack-logo.png" alt="" aria-hidden="true" className="h-[22px]" />
            </a>

            <button
              onClick={copyEmail}
              className="w-fit h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default cursor-pointer border border-[#AFB4A7] hover:bg-[#E8E9D9] hover:border-transparent active:bg-[#C7FF04] active:border-transparent"
              style={pillShadow}
            >
              {copied ? "copied!" : "hello@douglima.work"}
              <EnvelopeSimple size={22} />
            </button>

            {/* Close — avatar-hi, overlays trigger exactly */}
            <button
              onClick={close}
              aria-label="Close contact menu"
              className="w-[104px] h-[104px] rounded-full flex items-center justify-center border-0 cursor-pointer"
              style={{ backgroundColor: "#C7FF04" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/avatar-doug-hi.png" alt="" aria-hidden="true" className="h-[56px] w-[56px] object-contain" />
            </button>

          </div>
        </>
      )}

    </div>
  );
}
