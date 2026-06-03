"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import Header from "../components/Header";
import NavSelector from "../components/NavSelector";
import Monogram from "../components/Monogram";
import BackToTopButton from "../components/BackToTopButton";
import ControlPill from "../components/ControlPill";
import { useSplitLayout } from "../hooks/useSplitLayout";
import { craftProjects, type Section } from "./data";
import ProjectCarousel from "./ProjectCarousel";
import ProjectSelector from "./ProjectSelector";
import SectionDropdown from "./SectionDropdown";
import PrevNextBar from "./PrevNextBar";
import { verifyPassword } from "./actions";

export default function Craft() {
  const [activeSection, setActiveSection] = useState<Section>("playground");
  const [activeProject, setActiveProject] = useState(craftProjects.playground[0].name);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [footerRevealed, setFooterRevealed] = useState(false);

  const { refs, state, scrollToTop } = useSplitLayout([activeProject]);
  const { rightColRef, leftContentRef, firstItemRef, lastItemRef } = refs;
  const { atEnd, paddingTop, paddingBottom, rightColLeft } = state;

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
    }
  }

  function handleNext() {
    const idx = currentProjects.findIndex((p) => p.name === activeProject);
    if (idx < currentProjects.length - 1) {
      setActiveProject(currentProjects[idx + 1].name);
      setFooterRevealed(false);
      window.scrollTo({ top: 0, behavior: "instant" });
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
    const onScroll = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
      setFooterRevealed(atBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden" style={{ backgroundColor: "#313621" }}>

        <div
          className="bg-bg-base rounded-b-[24px]"
          style={{
            position: "relative",
            zIndex: 30,
            boxShadow: "0px 16px 48px -8px rgba(12,12,13,0.50)",
            transform: footerRevealed ? "translateY(-104px)" : "translateY(0)",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >

          <Header />

          <div className="px-10 pt-[156px] pb-8 flex flex-col">

            <SectionDropdown
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />

            {!showPasswordGate && (
              <>
                {/* Project selector — horizontal scroll */}
                <div className="mt-6 -mx-10 px-10 overflow-x-auto pb-2">
                  <NavSelector
                    items={currentProjects.map((p) => ({
                      label: p.name,
                      active: p.name === activeProject,
                      onClick: () => setActiveProject(p.name),
                    }))}
                    gap={8}
                  />
                </div>

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
                <div className="mt-6 -mx-7 flex flex-col gap-3">
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
              <Monogram size="lg" />
            </div>

          </div>

          {/* Password gate — mobile */}
          {showPasswordGate && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              style={{ backgroundColor: "rgba(243, 242, 230, 0.25)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              <div className="flex flex-col items-center w-full">
                <h2 className="text-center" style={{ fontFamily: "var(--font-fenix-var)", fontSize: "24px", color: "#5F6A50" }}>
                  This section is protected by NDA
                </h2>
                <p className="text-center mt-2" style={{ fontFamily: "var(--font-fenix-var)", fontSize: "20px", color: "#5F6A50" }}>
                  please enter the password below:
                </p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="mt-4 w-full text-center rounded-lg border px-4 py-3 focus:ring-0 focus:outline-none"
                  style={{ backgroundColor: "#F0EEE5", borderColor: "#A6AA74", color: "#5F6A50", outline: "none", maxWidth: "280px" }}
                  autoFocus
                />
                {authError && (
                  <p className="mt-2 font-geist font-light text-[14px] text-text-muted">wrong password</p>
                )}
                <button
                  onClick={() => handleSectionChange("playground")}
                  className="mt-4 underline"
                  style={{ fontFamily: "var(--font-fenix-var)", fontSize: "20px", color: "#5F6A50" }}
                >
                  cancel
                </button>
              </div>
            </div>
          )}

        </div>{/* /card */}
      </div>

      {/* ── Back to top — mobile only ───────────────────────────────── */}
      {!showPasswordGate && footerRevealed && (
        <BackToTopButton paddingBottom={169} zIndex={40} />
      )}

      {/* ── Prev/Next bar — mobile only ─────────────────────────────── */}
      {!showPasswordGate && (
        <PrevNextBar onPrev={handlePrev} onNext={handleNext} />
      )}

      {/* ── Desktop layout ──────────────────────────────────────────── */}
      <div className="hidden md:block bg-bg-base h-dvh overflow-hidden relative">

        <ProjectCarousel
          project={currentProject}
          rightColRef={rightColRef}
          firstItemRef={firstItemRef}
          lastItemRef={lastItemRef}
          rightColLeft={rightColLeft}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
        />

        <div className="pointer-events-none relative z-10 px-[10.5rem] pt-20 pb-20 h-full flex flex-col">

          <div className="pointer-events-auto">
            <Header />
          </div>

          <div ref={leftContentRef} className="pointer-events-auto flex-1 min-h-0 w-fit flex flex-col justify-between">

            {/* Top — section switcher */}
            <div className="mt-8 flex flex-col gap-[20px]">
              <button
                onClick={() => handleSectionChange("playground")}
                className={`w-fit font-geist font-light text-[40px] leading-tight whitespace-nowrap text-left cursor-pointer border-0 bg-transparent p-0 flex items-center gap-[8px] ${
                  activeSection === "playground" ? "text-text-active" : "text-text-muted hover:text-text-default transition-colors"
                }`}
              >
                {activeSection === "playground" && <ArrowRight size={40} color="#3B4028" weight="regular" />}
                Playground
              </button>
              <button
                onClick={() => handleSectionChange("selected-works")}
                className={`w-fit font-geist font-light text-[40px] leading-tight whitespace-nowrap text-left cursor-pointer border-0 bg-transparent p-0 flex items-center gap-[8px] ${
                  activeSection === "selected-works" ? "text-text-active" : "text-text-muted hover:text-text-default transition-colors"
                }`}
              >
                {activeSection === "selected-works" && <ArrowRight size={40} color="#3B4028" weight="regular" />}
                Selected Works
              </button>
            </div>

            {/* Bottom — monogram */}
            <Monogram size="sm" />

          </div>

          <ProjectSelector
            projects={currentProjects}
            activeProject={activeProject}
            onSelect={setActiveProject}
          />

        </div>

        {/* Swipe / Back-to-top */}
        <div className="absolute bottom-[104px] right-[88px] z-20 pointer-events-auto">
          <ControlPill atEnd={atEnd} onScrollToTop={scrollToTop} />
        </div>

        {showPasswordGate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(243, 242, 230, 0.25)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-center" style={{ fontFamily: "var(--font-fenix-var)", fontSize: "32px", color: "#5F6A50" }}>
                This section is protected by NDA
              </h2>
              <p className="text-center mt-2" style={{ fontFamily: "var(--font-fenix-var)", fontSize: "24px", color: "#5F6A50" }}>
                please enter the password below:
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="mt-4 w-[200px] text-center rounded-lg border px-4 py-3 focus:ring-0 focus:outline-none"
                style={{ backgroundColor: "#F0EEE5", borderColor: "#A6AA74", color: "#5F6A50", outline: "none" }}
                autoFocus
              />
              {authError && (
                <p className="mt-2 font-geist font-light text-[14px] text-text-muted">wrong password</p>
              )}
              <button
                onClick={() => handleSectionChange("playground")}
                className="mt-4 underline"
                style={{ fontFamily: "var(--font-fenix-var)", fontSize: "24px", color: "#5F6A50" }}
              >
                cancel
              </button>
            </div>
          </div>
        )}

      </div>

    </>
  );
}
