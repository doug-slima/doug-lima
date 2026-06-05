"use client";

import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Header from "../components/Header";
import NavSelector from "../components/NavSelector";
import Monogram from "../components/Monogram";
import BackToTopButton from "../components/BackToTopButton";
import BlurOverlay from "../components/BlurOverlay";
import PageFooter, { FooterBackToTop } from "../components/PageFooter";
import { craftProjects, type Section } from "./data";
import SectionDropdown from "./SectionDropdown";
import PrevNextBar from "./PrevNextBar";
import PasswordGate from "./PasswordGate";
import { verifyPassword } from "./actions";
import { useScrollParallax } from "../hooks/useScrollParallax";

export default function Craft() {
  const [activeSection, setActiveSection] = useState<Section>("playground");
  const [activeProject, setActiveProject] = useState(craftProjects.playground[0].name);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [footerRevealed, setFooterRevealed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showPasswordGate = activeSection === "selected-works" && !isAuthenticated;
  const currentProjects = craftProjects[activeSection];
  const currentProject = currentProjects.find((p) => p.name === activeProject) ?? currentProjects[0];

  function handleSectionChange(section: Section) {
    if (section !== "selected-works") setIsAuthenticated(false);
    setActiveSection(section);
    setActiveProject(craftProjects[section][0].name);
  }

  function handlePrev() {
    const idx = currentProjects.findIndex((p) => p.name === activeProject);
    if (idx > 0) {
      setActiveProject(currentProjects[idx - 1].name);
      setFooterRevealed(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  function handleNext() {
    const idx = currentProjects.findIndex((p) => p.name === activeProject);
    if (idx < currentProjects.length - 1) {
      setActiveProject(currentProjects[idx + 1].name);
      setFooterRevealed(false);
      window.scrollTo({ top: 0, behavior: "instant" });
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  async function handleSubmit() {
    if (!password || loading) return;
    setLoading(true);
    setAuthError(false);
    const ok = await verifyPassword(password);
    setLoading(false);
    if (ok) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      setAuthError(true);
      setPassword("");
    }
  }

  useEffect(() => {
    if (!showPasswordGate) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleSectionChange("playground");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPasswordGate]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterRevealed(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useScrollParallax({
    elementRef: footerRef,
    scrollRef,
    factor: 0.4,
    resetKey: `${activeProject}-${showPasswordGate}`,
  });

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden" style={{ backgroundColor: "#313621", paddingBottom: "104px" }}>

        {/* Header — Variant A: Block 1 only (fixed). Block 2 lives in the card and scrolls. */}
        <Header />

        <div
          className="bg-bg-base rounded-b-[24px] card-reveal"
          style={{
            position: "relative",
            zIndex: 30,
            boxShadow: "0px 16px 48px -8px rgba(12,12,13,0.50)",
            transform: footerRevealed ? "translateY(-104px)" : "translateY(0)",
          }}
        >

          <div className="px-8 pb-8 flex flex-col" style={{ paddingTop: "var(--header-h)" }}>

            {/* Block 2 — scrolls with content */}
            <SectionDropdown
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
            <div className="mt-3 -mx-8 px-8 overflow-x-auto">
              <NavSelector
                items={currentProjects.map((p) => ({
                  label: p.name,
                  active: p.name === activeProject,
                  onClick: () => setActiveProject(p.name),
                }))}
                gap={8}
                textSize="text-[18px]"
              />
            </div>

            {!showPasswordGate && (
              <>
                {/* Info block */}
                <div className="mt-6 flex items-center justify-between" style={{ height: "120px" }}>
                  <div className="flex flex-col">
                    <p className="font-geist font-semibold text-[20px] leading-tight text-text-default">{currentProject.label}</p>
                    <p className="font-geist font-light text-[20px] leading-tight text-text-default">{currentProject.name}</p>
                  </div>
                  <div className="w-[220px] flex items-center justify-end">
                    {currentProject.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentProject.logo} alt={currentProject.name} className="h-[56px] w-auto object-contain" />
                    ) : (
                      <div className="w-full h-[56px] bg-surface-tag rounded-lg" />
                    )}
                  </div>
                </div>

                {/* Images stacked */}
                <div className="mt-6 -mx-5 flex flex-col gap-3">
                  {currentProject.images.map((src, i) => (
                    <div key={i} className="w-full overflow-hidden">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-full h-auto block" />
                      ) : (
                        <span className="font-geist font-light text-[18px] text-text-muted opacity-40">
                          {currentProject.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8">
              <Monogram widthClass="w-[123px]" />
            </div>

          </div>

          {showPasswordGate && (
            <PasswordGate
              value={password}
              onChange={setPassword}
              onSubmit={handleSubmit}
              onCancel={() => handleSectionChange("playground")}
              error={authError}
            />
          )}

        </div>{/* /card */}

        {/* Sentinel — sibling of card, unaffected by card transform.
            Positioned 104px above card bottom so IO fires before browser
            chrome (nav bar) hides the last pixels of the document. */}
        <div ref={sentinelRef} style={{ marginTop: "-104px", height: "1px" }} />

      </div>

      {/* ── Back to top — mobile only ───────────────────────────────── */}
      {!showPasswordGate && footerRevealed && (
        <BackToTopButton paddingBottom={180} zIndex={40} />
      )}

      {/* ── Prev/Next bar — mobile only ─────────────────────────────── */}
      {!showPasswordGate && (
        <PrevNextBar onPrev={handlePrev} onNext={handleNext} />
      )}

      {/* ── Desktop layout ──────────────────────────────────────────── */}
      <div className="hidden md:block bg-bg-base h-dvh overflow-hidden relative">

        {/* BlurOverlay — fades content that scrolls under the header */}
        <BlurOverlay height={280} solidUntil="80%" />

        {/* content-module — full-screen scroll container */}
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" style={{ isolation: "isolate" }}>
          {/* z-10 keeps carousel images above the footer so they visually slide over it on exit */}
          <div className="relative z-10 px-[10.5rem]" style={{ paddingTop: "200px" }}>

            {!showPasswordGate && (
              <>
                {/* Info block */}
                <div className="h-[240px] px-[200px] flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="font-geist font-semibold text-[24px] leading-tight text-text-default">
                      {currentProject.label}
                    </p>
                    <p className="font-geist font-light text-[24px] leading-tight text-text-default">
                      {currentProject.name}
                    </p>
                  </div>
                  <div className="w-[400px] h-full flex items-center justify-end">
                    {currentProject.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentProject.logo}
                        alt={currentProject.name}
                        className="h-[80px] w-auto object-contain"
                      />
                    ) : (
                      <div className="w-full h-[80px] bg-surface-tag rounded-lg" />
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="mt-[80px] flex flex-col gap-[80px]">
                  {currentProject.images.map((src, i) => (
                    <div key={i} className="w-full overflow-hidden">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-full h-auto block" />
                      ) : (
                        <div className="h-[527px] flex items-center justify-center">
                          <span className="font-geist font-light text-[24px] text-text-muted opacity-40">
                            {currentProject.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </>
            )}

          </div>

          {/* Footer — in-flow, z-auto so carousel (z-10 above) slides over it on exit */}
          {!showPasswordGate && (
            <PageFooter
              ref={footerRef}
              variant="inline"
              center={
                <div
                  className="h-[56px] w-[296px] px-5 rounded-full flex items-center justify-between gap-6"
                  style={{ backgroundColor: "#121210" }}
                >
                  <button
                    onClick={handlePrev}
                    aria-label="Previous project"
                    className="flex items-center gap-2 font-geist font-light text-[18px] cursor-pointer border-0 bg-transparent text-[#FAFAF5] hover:text-[#C7FF04]"
                  >
                    <CaretLeft size={18} /> Prev
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next project"
                    className="flex items-center gap-2 font-geist font-light text-[18px] cursor-pointer border-0 bg-transparent text-[#FAFAF5] hover:text-[#C7FF04]"
                  >
                    Next <CaretRight size={18} />
                  </button>
                </div>
              }
              right={<FooterBackToTop onClick={scrollToTop} />}
            />
          )}

        </div>

        {/* Header — floats above content-module */}
        <div className="pointer-events-none absolute top-0 inset-x-0 z-10 px-[72px] pt-[72px]">
          <div className="pointer-events-auto">
            <Header
              block2={
                <>
                  <SectionDropdown
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                  <NavSelector
                    items={currentProjects.map((p) => ({
                      label: p.name,
                      active: p.name === activeProject,
                      onClick: () => setActiveProject(p.name),
                    }))}
                    gap={8}
                    textSize="text-[18px]"
                  />
                </>
              }
            />
          </div>
        </div>

        {showPasswordGate && (
          <PasswordGate
            value={password}
            onChange={setPassword}
            onSubmit={handleSubmit}
            onCancel={() => handleSectionChange("playground")}
            error={authError}
          />
        )}

      </div>

    </>
  );
}
