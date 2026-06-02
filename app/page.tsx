"use client";

import { useState } from "react";
import PageLayout from "./components/PageLayout";
import BlurOverlay from "./components/BlurOverlay";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@douglima.work");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout
      outerClassName="relative h-screen overflow-hidden"
      contentClassName="relative z-20 h-full"
      backgroundLayers={
        <>
          {/* Mosaic background — z-0 */}
          <div className="absolute right-0 top-0 h-full w-full md:w-[1272px] overflow-hidden z-0">
            <div className="flex flex-col animate-mosaic-scroll">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/home/mosaic-home-bg.png"
                alt=""
                aria-hidden="true"
                className="w-full block"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/home/mosaic-home-bg.png"
                alt=""
                aria-hidden="true"
                className="w-full block"
              />
            </div>
          </div>

          {/* Header blur overlay — z-10 */}
          <BlurOverlay />
        </>
      }
      footerContent={
        <div className="flex items-center gap-4 pl-6 pr-5 h-[56px] rounded-full bg-[#F3F2E6] hover:bg-[#F6F3E6] hover:ring-1 hover:ring-[#DEDDCE] transition-colors">
          <button
            onClick={copyEmail}
            className="p-0 leading-none bg-transparent border-0 font-fenix text-[16px] md:text-[20px] text-text-default hover:text-text-active transition-colors cursor-pointer"
          >
            {copied ? "copied!" : "hello@douglima.work"}
          </button>

          <a
            href="https://substack.com/@douglima"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home/substack-logo.png"
              alt="Substack"
              className="h-7 block"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/dougslima/?locale=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home/linkedin-logo.png"
              alt="LinkedIn"
              className="h-7 block"
            />
          </a>

          <div className="group/avatar relative inline-flex items-center h-8 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home/avatar-doug.png"
              alt=""
              aria-hidden="true"
              className="h-full block group-hover/avatar:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home/avatar-doug-hi.png"
              alt=""
              aria-hidden="true"
              className="h-full hidden group-hover/avatar:block"
            />
          </div>
        </div>
      }
    >
      {/* Tagline */}
      <div className="mt-8">
        <p className="font-geist font-light text-[40px] leading-tight text-text-default">
          Curious
          <br />
          Designer
        </p>
      </div>
    </PageLayout>
  );
}
