"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Monogram from "../components/Monogram";
import BlurOverlay from "../components/BlurOverlay";
import BackToTopButton from "../components/BackToTopButton";
import PageFooter, { FooterBackToTop } from "../components/PageFooter";
import TimelineBlock, { TimelineEntry } from "../components/TimelineBlock";
import TimelineItem from "../components/TimelineItem";
import { useScrollParallax } from "../hooks/useScrollParallax";

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
  const [footerRevealed, setFooterRevealed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      setFooterRevealed(atBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  useScrollParallax({ elementRef: footerRef, scrollRef, factor: 0.4 });

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden bg-bg-base min-h-screen">

        <Header />

        <div className="px-8 pb-10 flex flex-col" style={{ paddingTop: "var(--header-h)" }}>

          <p className="font-geist font-light text-[clamp(28px,7.5vw,32px)] leading-tight text-text-default">
            20 years across<br />
            Design, Experiences<br />
            and Technology.
          </p>

          <div className="mt-6 flex flex-col">
            {timeline.map((entry, i) => (
              <TimelineItem key={i} entry={entry} />
            ))}
          </div>

          <Monogram widthClass="w-[123px]" className="mt-12" />

        </div>
      </div>

      {footerRevealed && <BackToTopButton paddingBottom={73} />}

      {/* ── Desktop layout ──────────────────────────────────────────── */}
      <div className="hidden md:block bg-bg-base h-dvh overflow-hidden relative">

        {/* BlurOverlay — fades content scrolling under the header */}
        <BlurOverlay />

        {/* content-module — full-screen scroll container */}
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" style={{ isolation: "isolate" }}>
          {/* z-10 keeps timeline above the footer so it slides over it on exit */}
          <div className="relative z-10 px-[300px]" style={{ paddingTop: "160px" }}>
            <p className="font-geist font-light text-[40px] leading-tight text-text-default mb-[80px]">
              20 years across Design,<br />Experiences and Technology.
            </p>
            <div className="flex flex-col">
              {timeline.map((entry, i) => (
                <div key={i} className="border-b border-[#DEDDCE] h-[280px] flex flex-col justify-center">
                  <TimelineBlock {...entry} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer — in-flow below timeline, z-auto so timeline slides over it on exit */}
          <PageFooter
            ref={footerRef}
            variant="inline"
            right={<FooterBackToTop onClick={scrollToTop} />}
          />
        </div>

        {/* Floating header */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]">
          <div className="pointer-events-auto">
            <Header />
          </div>
        </div>

      </div>

    </>
  );
}
