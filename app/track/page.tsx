"use client";

import Header from "../components/Header";
import ScrollColumn from "../components/ScrollColumn";
import TimelineBlock, { TimelineEntry } from "../components/TimelineBlock";
import { useSplitLayout } from "../hooks/useSplitLayout";

const timeline: TimelineEntry[] = [
  {
    year: "2011",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2012",
    lines: [{ text: "Service Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/itau-logo.png", alt: "Itaú" },
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
    year: "2017",
    lines: [
      { text: "Service Designer", style: "light" },
      { text: "& Researcher", style: "light" },
    ],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2018",
    lines: [{ text: "UX Researcher", style: "light" }],
    logo: { src: "/assets/companies-page-track/ifood-logo.png", alt: "iFood" },
  },
  {
    year: "2018",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/kyvo-logo.png", alt: "Kyvo" },
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
    year: "2019",
    lines: [{ text: "Design Lead", style: "light" }],
    logo: { src: "/assets/companies-page-track/hash-logo.png", alt: "Hash" },
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
    year: "2021",
    lines: [{ text: "Design Manager", style: "light" }],
    logo: { src: "/assets/companies-page-track/olist-logo.png", alt: "Olist" },
  },
  {
    year: "2022",
    lines: [{ text: "Design Expert", style: "light" }],
    logo: { src: "/assets/companies-page-track/mercado-livre-logo.png", alt: "Mercado Livre" },
  },
  {
    year: "2024",
    lines: [{ text: "Founding Designer", style: "light" }],
    logo: { src: "/assets/companies-page-track/klauvi-logo.png", alt: "Klauvi" },
  },
  {
    year: "2026",
    lines: [
      { text: "Teacher", style: "light" },
      { text: "AI Augmented Design", style: "bold" },
      { text: "ESPM/SP", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/espm-logo.png", alt: "ESPM São Paulo" },
  },
];

export default function Track() {
  const { refs, state, scrollToTop } = useSplitLayout();
  const { rightColRef, leftContentRef, firstItemRef, lastItemRef } = refs;
  const { atEnd, paddingTop, paddingBottom, rightColLeft } = state;

  return (
    <div className="bg-bg-base h-screen overflow-hidden relative">

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

          {/* Bottom — tag + monogram */}
          <div className="flex flex-col gap-[40px]">

            {atEnd ? (
              <button
                onClick={scrollToTop}
                className="w-fit h-[40px] px-[18px] py-0 bg-surface-tag rounded-full font-geist text-[14px] text-text-default cursor-pointer flex items-center gap-[6px] border-0"
              >
                <span className="font-semibold">back</span>
                <span className="font-light">to top</span>
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
                  <path d="M8 13V1M4 5L8 1L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <div className="w-fit h-[40px] px-[18px] bg-surface-tag rounded-full font-geist text-[14px] text-text-default cursor-default flex items-center">
                <span className="font-semibold">swipe-up</span>
                <span className="font-light">&nbsp;to see more</span>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/home/dl-monogram.svg" alt="" aria-hidden="true" className="w-[88px]" />

          </div>
        </div>

        {/* "a few steps:" — pixel-perfect at 50vh, aligned with first and last timeline blocks */}
        <p className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 font-fenix text-[20px] text-text-default">
          a few steps:
        </p>

      </div>

    </div>
  );
}
