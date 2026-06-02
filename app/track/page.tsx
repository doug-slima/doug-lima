"use client";

import { ArrowUp } from "@phosphor-icons/react";
import Header from "../components/Header";
import StickyHeader from "../components/StickyHeader";
import ScrollColumn from "../components/ScrollColumn";
import TimelineBlock, { TimelineEntry } from "../components/TimelineBlock";
import { useSplitLayout } from "../hooks/useSplitLayout";

const timeline: TimelineEntry[] = [
  {
    year: "2026",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "AI Augmented Design", style: "bold" },
      { text: "ESPM/SP", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/espm-logo.png", alt: "ESPM São Paulo" },
  },
  {
    year: "2024",
    lines: [{ text: "Founding Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/klauvi-logo.png", alt: "Klauvi" },
  },
  {
    year: "2022",
    lines: [{ text: "Design Expert", style: "light" }],
    logo: { src: "/assets/companies-page-track/mercado-livre-logo.png", alt: "Mercado Livre" },
  },
  {
    year: "2021",
    lines: [{ text: "Design Manager", style: "light" }],
    logo: { src: "/assets/companies-page-track/olist-logo.png", alt: "Olist" },
  },
  {
    year: "2020",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "Base/Exploratory Research", style: "bold" },
      { text: "Aprender Design", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/aprender-design-logo.png", alt: "Aprender Design" },
  },
  {
    year: "2019",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/hash-logo.png", alt: "Hash" },
  },
  {
    year: "2019",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "Future Studies", style: "bold" },
      { text: "IED/SP", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/ied-logo.png", alt: "IED São Paulo" },
  },
  {
    year: "2018",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/kyvo-logo.png", alt: "Kyvo" },
  },
  {
    year: "2018",
    lines: [{ text: "UX Researcher", style: "light" }],
    logo: { src: "/assets/companies-page-track/ifood-logo.png", alt: "iFood" },
  },
  {
    year: "2017",
    lines: [
      { text: "Service Designer", style: "light" },
      { text: "& Researcher", style: "light" },
    ],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2014",
    lines: [
      { text: "Master's Degree in", style: "light" },
      { text: "Technology & Society", style: "bold" },
      { text: "Unifei/MG", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/unifei-logo.png", alt: "Unifei" },
  },
  {
    year: "2012",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/itau-logo.png", alt: "Itaú" },
  },
  {
    year: "2011",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
];

export default function Track() {
  const { refs, state, scrollToTop } = useSplitLayout();
  const { rightColRef, leftContentRef, firstItemRef, lastItemRef } = refs;
  const { atEnd, paddingTop, paddingBottom, rightColLeft } = state;

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden bg-bg-base min-h-screen">

        <StickyHeader />

        <div className="px-10 pt-[120px] pb-10 flex flex-col">

          <div className="mt-0">
            <p className="font-geist font-light text-[28px] leading-tight text-text-default">
              20 years across<br />
              Design, Experiences<br />
              and Technology.
            </p>
          </div>

          <p className="mt-8 font-fenix text-[20px] text-text-default">a few steps:</p>

          <div className="mt-6 flex flex-col">
            {timeline.map((entry, i) => (
              <div key={i} className="flex flex-row items-center gap-4 py-4 border-b border-[#DEDDCE]">
                <span className="font-geist font-semibold text-[18px] text-text-default flex-shrink-0 w-[40px]">
                  {entry.year}
                </span>
                <div className="flex-1 flex flex-col min-w-0">
                  {entry.lines.map((line, j) => {
                    const cls =
                      line.style === "bold"
                        ? "font-geist font-semibold text-[18px] text-text-default"
                        : line.style === "serif"
                        ? "font-fenix text-[18px] text-text-default"
                        : "font-geist font-light text-[18px] text-text-default";
                    return <span key={j} className={cls}>{line.text}</span>;
                  })}
                </div>
                <div className="flex-shrink-0 w-[72px] flex items-center justify-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.logo.src} alt={entry.logo.alt} className="max-h-[36px] max-w-full object-contain" />
                </div>
              </div>
            ))}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/home/dl-monogram.svg" alt="" aria-hidden="true" className="w-[104px] mt-12" />

        </div>
      </div>

      {/* ── Desktop layout ──────────────────────────────────────────── */}
    <div className="hidden md:block bg-bg-base h-dvh overflow-hidden relative">

      <ScrollColumn
        ref={rightColRef}
        className="absolute inset-y-0 right-0 z-0"
        style={{ left: `${rightColLeft}px` }}
      >
        <div
          className="flex flex-col gap-[344px] pr-[10.5rem]"
          style={{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}
        >
          {timeline.map((entry, i) =>
            i === 0 ? (
              <div key={0} ref={firstItemRef}>
                <TimelineBlock {...entry} />
              </div>
            ) : i === timeline.length - 1 ? (
              <div key={i} ref={lastItemRef}>
                <TimelineBlock {...entry} />
              </div>
            ) : (
              <TimelineBlock key={i} {...entry} />
            )
          )}
        </div>
      </ScrollColumn>

      {/*
        Header + left column — normal flow, z-10 above the right column.
        pointer-events-none on the wrapper so the right column remains scrollable
        through the transparent area; interactive children restore pointer events.
      */}
      <div className="pointer-events-none relative z-10 px-[10.5rem] pt-20 pb-20 h-full flex flex-col">

        <div className="pointer-events-auto">
          <Header />
        </div>

        <div ref={leftContentRef} className="pointer-events-auto flex-1 min-h-0 w-fit flex flex-col justify-between">

          {/* Top — bio */}
          <div className="mt-8">
            <p className="font-geist font-light text-[40px] leading-tight text-text-default whitespace-nowrap">
              20 years across<br />
              Design, Experiences<br />
              and Technology.
            </p>
          </div>

          {/* Bottom — monogram */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/home/dl-monogram.svg" alt="" aria-hidden="true" className="w-[88px]" />

        </div>

        {/* "a few steps:" — pixel-perfect at 50vh, aligned with first and last timeline blocks */}
        <p className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 font-fenix text-[24px] text-text-default">
          a few steps:
        </p>

      </div>

      {/* Swipe / Back-to-top — bottom right, centro alinhado com centro do monograma */}
      <div className="absolute bottom-[104px] right-[88px] z-20 pointer-events-auto">
        {atEnd ? (
          <button
            onClick={scrollToTop}
            className="h-[56px] pl-6 pr-5 gap-2 rounded-full bg-[#A6AA74]/20 hover:bg-[#F6F3E6] hover:ring-1 hover:ring-[#DEDDCE] font-fenix text-[20px] text-[#3B4028] cursor-pointer flex items-center border-0 transition-all"
          >
            back to top <ArrowUp size={20} />
          </button>
        ) : (
          <div className="h-[56px] px-6 rounded-full bg-[#A6AA74]/20 font-fenix text-[20px] text-[#3B4028] cursor-default flex items-center">
            swipe-up to see more
          </div>
        )}
      </div>

    </div>

    </>
  );
}
