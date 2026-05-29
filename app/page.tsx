"use client";

import { useState } from "react";
import Header from "./components/Header";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@douglima.work");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-bg-base">
      {/* Mosaic background — z-0 */}
      <div className="absolute right-0 top-0 h-full w-[1272px] overflow-hidden z-0">
        <div className="flex flex-col animate-mosaic-scroll">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mosaic-home-bg.png"
            alt=""
            aria-hidden="true"
            className="w-full block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mosaic-home-bg.png"
            alt=""
            aria-hidden="true"
            className="w-full block"
          />
        </div>
      </div>

      {/* Header blur overlay — z-10 */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "280px",
          background:
            "linear-gradient(to bottom, #F9F9F2 0%, #F9F9F2 65%, rgba(249,249,242,0) 100%)",
        }}
      />

      {/* Main content — z-20 */}
      <div className="relative z-20 h-full flex flex-col pt-28 pb-20 px-[10.5rem]">
        <Header />

        {/* Tagline */}
        <div className="mt-8">
          <p className="font-geist font-light text-[40px] leading-tight text-text-default">
            Curious
            <br />
            Designer
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-auto flex items-end justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/dl-monogram.svg" alt="" aria-hidden="true" />

          <div className="flex items-end gap-6 font-fenix text-[18px]">
            <button
              onClick={copyEmail}
              className="p-0 leading-none bg-transparent border-0 text-text-default hover:text-text-active transition-colors cursor-pointer"
            >
              {copied ? "copied!" : "hello@douglima.work"}
            </button>

            <a
              href="https://substack.com/@douglima"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-end"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/substack-logo.png"
                alt="Substack"
                className="h-7 block"
              />
            </a>

            <a
              href="https://www.linkedin.com/in/dougslima/?locale=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-end"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/linkedin-logo.png"
                alt="LinkedIn"
                className="h-7 block"
              />
            </a>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/doug-pixelart.png"
              alt=""
              aria-hidden="true"
              className="h-10 block"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
