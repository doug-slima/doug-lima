"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Monogram from "../components/Monogram";
import BackToTopButton from "../components/BackToTopButton";
import ControlPill from "../components/ControlPill";
import ScrollColumn from "../components/ScrollColumn";
import TimelineBlock, { TimelineEntry } from "../components/TimelineBlock";
import TimelineItem from "../components/TimelineItem";
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
    lines: [{ text: "Founding Designer", style: "bold" }, { text: "Klauvi", style: "serif" }],
    logo: { src: "/assets/companies-page-track/klauvi-logo.png", alt: "Klauvi" },
  },
  {
    year: "2022",
    lines: [{ text: "Design Expert", style: "bold" }, { text: "Mercado Livre", style: "serif" }],
    logo: { src: "/assets/companies-page-track/mercado-livre-logo.png", alt: "Mercado Livre" },
  },
  {
    year: "2021",
    lines: [{ text: "Design Manager", style: "bold" }, { text: "Olist", style: "serif" }],
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
    lines: [{ text: "Design Lead", style: "bold" }, { text: "Hash", style: "serif" }],
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
    lines: [{ text: "Design Lead", style: "bold" }, { text: "Kyvo", style: "serif" }],
    logo: { src: "/assets/companies-page-track/kyvo-logo.png", alt: "Kyvo" },
  },
  {
    year: "2018",
    lines: [{ text: "UX Researcher", style: "bold" }, { text: "iFood", style: "serif" }],
    logo: { src: "/assets/companies-page-track/ifood-logo.png", alt: "iFood" },
  },
  {
    year: "2017",
    lines: [{ text: "Service Designer", style: "bold" }, { text: "Livework", style: "serif" }],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
  {
    year: "2014",
    lines: [
      { text: "Master's Degree in", style: "bold" },
      { text: "Technology & Society", style: "bold" },
      { text: "Unifei/MG", style: "serif" },
    ],
    logo: { src: "/assets/companies-page-track/unifei-logo.png", alt: "Unifei" },
  },
  {
    year: "2012",
    lines: [{ text: "Service Designer", style: "bold" }, { text: "Itaú", style: "serif" }],
    logo: { src: "/assets/companies-page-track/itau-logo.png", alt: "Itaú" },
  },
  {
    year: "2011",
    lines: [{ text: "Service Designer", style: "bold" }, { text: "Livework", style: "serif" }],
    logo: { src: "/assets/companies-page-track/livework-logo.png", alt: "Livework" },
  },
];

export default function Track() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setAtBottom(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { refs, state, scrollToTop } = useSplitLayout();
  const { rightColRef, leftContentRef, firstItemRef, lastItemRef } = refs;
  const { atEnd, paddingTop, paddingBottom, rightColLeft } = state;

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden bg-bg-base min-h-screen">

        <Header />

        <div className="px-10 pt-[144px] pb-10 flex flex-col">

          <p className="font-geist font-light text-[28px] leading-tight text-text-default">
            20 years across<br />
            Design, Experiences<br />
            and Technology.
          </p>

          <p className="mt-8 font-fenix text-[20px] text-text-default">a few steps:</p>

          <div className="mt-6 -mx-2 flex flex-col">
            {timeline.map((entry, i) => (
              <TimelineItem key={i} entry={entry} />
            ))}
          </div>

          <Monogram size="lg" className="mt-12" />

        </div>
      </div>

      {/* ── Back to top — mobile only ───────────────────────────────── */}
      {atBottom && <BackToTopButton paddingBottom={73} />}

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

        <div className="pointer-events-none relative z-10 px-[10.5rem] pt-20 pb-20 h-full flex flex-col">

          <div className="pointer-events-auto">
            <Header />
          </div>

          <div ref={leftContentRef} className="pointer-events-auto flex-1 min-h-0 w-fit flex flex-col justify-between">

            <div className="mt-8">
              <p className="font-geist font-light text-[40px] leading-tight text-text-default whitespace-nowrap">
                20 years across<br />
                Design, Experiences<br />
                and Technology.
              </p>
            </div>

            <Monogram size="sm" />

          </div>

          <p className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 font-fenix text-[24px] text-text-default">
            a few steps:
          </p>

        </div>

        {/* Swipe / Back-to-top */}
        <div className="absolute bottom-[104px] right-[88px] z-20 pointer-events-auto">
          <ControlPill atEnd={atEnd} onScrollToTop={scrollToTop} />
        </div>

      </div>

    </>
  );
}
