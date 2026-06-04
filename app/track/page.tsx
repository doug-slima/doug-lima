"use client";

import { useRef } from "react";
import Header from "../components/Header";
import Monogram from "../components/Monogram";
import BlurOverlay from "../components/BlurOverlay";
import PageFooter, { FooterBackToTop } from "../components/PageFooter";
import TimelineBlock, { TimelineEntry } from "../components/TimelineBlock";
import TimelineItem from "../components/TimelineItem";
import { useFooterAnimation } from "../hooks/useFooterAnimation";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const contentDivRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { isFooterMounted } = useFooterAnimation({
    scrollRef,
    lastItemRef,
    contentDivRef,
    footerRef,
  });

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

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

          <div className="mt-6 -mx-2 flex flex-col">
            {timeline.map((entry, i) => (
              <TimelineItem key={i} entry={entry} />
            ))}
          </div>

          <Monogram size="lg" className="mt-12" />

        </div>
      </div>

      {/* ── Desktop layout ──────────────────────────────────────────── */}
      <div className="hidden md:block bg-bg-base h-dvh overflow-hidden relative">

        {/* BlurOverlay — fades content scrolling under the header */}
        <BlurOverlay height={280} solidUntil="80%" />

        {/* Footer before scroll container in DOM — z-index trick lets content pass over on exit */}
        {isFooterMounted && (
          <PageFooter
            ref={footerRef}
            scrollRef={scrollRef}
            right={<FooterBackToTop onClick={scrollToTop} />}
          />
        )}

        {/* content-module — full-screen scroll container */}
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
          <div ref={contentDivRef} className="px-[300px]" style={{ paddingTop: "280px" }}>
            <div className="flex flex-col">
              {timeline.map((entry, i) => {
                const isLast = i === timeline.length - 1;
                return (
                  <div key={i} ref={isLast ? lastItemRef : undefined} className="border-b border-[#DEDDCE] h-[280px] flex flex-col justify-center">
                    <TimelineBlock {...entry} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating header — same pattern as Craft */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]">
          <div className="pointer-events-auto">
            <Header
              menuNav={
                <p className="font-geist font-light text-[40px] leading-tight text-text-default whitespace-nowrap">
                  20 years across Design, Experiences and Technology.
                </p>
              }
            />
          </div>
        </div>

      </div>

    </>
  );
}
