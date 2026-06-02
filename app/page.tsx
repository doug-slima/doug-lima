"use client";

import { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";
import PageLayout from "./components/PageLayout";
import BlurOverlay from "./components/BlurOverlay";

const pillStyle: React.CSSProperties = {
  backgroundColor: "#F6F3E6",
  border: "1px solid #D0D1B3",
  boxShadow: "32px 32px 84px rgba(12,12,13,0.12)",
};

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@douglima.work");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PageLayout
        outerClassName="relative h-screen overflow-hidden"
        contentClassName="relative z-20 h-full"
        backgroundLayers={
          <>
            {/* Mosaic background — z-0 */}
            <div className="absolute right-0 top-0 h-full w-full md:w-[1272px] overflow-hidden z-0">
              <div className="flex flex-col animate-mosaic-scroll">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/mosaic-home-bg.png" alt="" aria-hidden="true" className="w-full block" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/mosaic-home-bg.png" alt="" aria-hidden="true" className="w-full block" />
              </div>
            </div>

            {/* Header blur overlay — z-10 */}
            <BlurOverlay />
          </>
        }
        footerContent={
          <>
            {/* Mobile: avatar toggle */}
            <button
              onClick={() => setContactOpen(true)}
              className="block md:hidden w-[104px] h-[104px] p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/avatar-doug.png" alt="Contact" className="w-[104px] h-[104px] object-contain" />
            </button>

            {/* Desktop: full contact tag */}
            <div className="hidden md:flex items-center gap-4 pl-6 pr-5 h-[56px] rounded-full bg-[#F3F2E6] hover:bg-[#F6F3E6] hover:ring-1 hover:ring-[#DEDDCE] transition-colors">
              <button
                onClick={copyEmail}
                className="p-0 leading-none bg-transparent border-0 font-fenix text-[20px] text-text-default hover:text-text-active transition-colors cursor-pointer"
              >
                {copied ? "copied!" : "hello@douglima.work"}
              </button>

              <a href="https://substack.com/@douglima" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/substack-logo.png" alt="Substack" className="h-7 block" />
              </a>

              <a href="https://www.linkedin.com/in/dougslima/?locale=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/linkedin-logo.png" alt="LinkedIn" className="h-7 block" />
              </a>

              <div className="group/avatar relative inline-flex items-center h-8 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/avatar-doug.png" alt="" aria-hidden="true" className="h-full block group-hover/avatar:hidden" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/home/avatar-doug-hi.png" alt="" aria-hidden="true" className="h-full hidden group-hover/avatar:block" />
              </div>
            </div>
          </>
        }
      >
        {/* Tagline */}
        <div className="mt-0 md:mt-8">
          <p className="font-geist font-light text-[40px] leading-tight text-text-default">
            Curious
            <br />
            Designer
          </p>
        </div>
      </PageLayout>

      {/* Mobile contact overlay */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{ backgroundColor: "rgba(243, 242, 230, 0.25)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          onClick={() => setContactOpen(false)}
        >
          <div
            className="absolute bottom-10 right-10 flex flex-col items-end gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/dougslima/?locale=en"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default"
              style={pillStyle}
            >
              Linkedin
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/linkedin-logo.png" alt="" aria-hidden="true" className="h-[22px]" />
            </a>

            {/* Substack */}
            <a
              href="https://substack.com/@douglima"
              target="_blank"
              rel="noopener noreferrer"
              className="h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default"
              style={pillStyle}
            >
              Substack
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/substack-logo.png" alt="" aria-hidden="true" className="h-[22px]" />
            </a>

            {/* Email */}
            <button
              onClick={copyEmail}
              className="h-[56px] px-5 rounded-full flex items-center gap-3 font-fenix text-[18px] text-text-default border-0 cursor-pointer"
              style={pillStyle}
            >
              {copied ? "copied!" : "hello@douglima.work"}
              <EnvelopeSimple size={22} />
            </button>

            {/* Avatar — close button */}
            <button
              onClick={() => setContactOpen(false)}
              className="w-[104px] h-[104px] rounded-full flex items-center justify-center border-0 cursor-pointer"
              style={{ backgroundColor: "#C7FF04" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/home/avatar-doug-hi.png" alt="" aria-hidden="true" className="w-[104px] h-[104px] object-contain" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
