"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUp, CaretRight, CaretDown } from "@phosphor-icons/react";
import Header from "../components/Header";
import StickyHeader from "../components/StickyHeader";
import NavSelector from "../components/NavSelector";
import { useSplitLayout } from "../hooks/useSplitLayout";
import { craftProjects, type Section } from "./data";
import ProjectCarousel from "./ProjectCarousel";
import ProjectSelector from "./ProjectSelector";
import { verifyPassword } from "./actions";

export default function Craft() {
  const [activeSection, setActiveSection] = useState<Section>("playground");
  const [activeProject, setActiveProject] = useState(craftProjects.playground[0].name);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const sectionDropdownRef = useRef<HTMLDivElement>(null);

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
    if (!sectionDropdownOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(e.target as Node)) {
        setSectionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [sectionDropdownOpen]);

  return (
    <>

      {/* ── Mobile layout ───────────────────────────────────────────── */}
      <div className="block md:hidden bg-bg-base min-h-screen">

        <StickyHeader />

        <div className="px-10 pt-[88px] pb-10 flex flex-col">

          {/* Section dropdown */}
          <div ref={sectionDropdownRef} className="mt-0 relative z-20">
            {/* Trigger — sempre no DOM para segurar o espaço de layout */}
            <button
              onClick={() => setSectionDropdownOpen(true)}
              className={`flex items-center gap-2 font-geist font-light text-[24px] leading-tight text-text-active bg-transparent border-0 p-0 cursor-pointer ${sectionDropdownOpen ? "invisible" : ""}`}
            >
              {activeSection === "playground" ? "Playground" : "Selected Works"}
              <CaretRight size={20} color="#3B4028" />
            </button>

            {/* Open: container absoluto com offset negativo que compensa o padding,
                mantendo o texto exatamente na mesma posição do trigger */}
            {sectionDropdownOpen && (
              <div
                className="absolute w-fit rounded-xl flex flex-col z-30"
                style={{
                  top: -20,
                  left: -20,
                  backgroundColor: "#F6F3E6",
                  border: "1px solid #AFB4A7",
                }}
              >
                <button
                  onClick={() => setSectionDropdownOpen(false)}
                  className="flex items-center gap-2 font-geist font-light text-[24px] leading-tight text-text-active bg-transparent border-0 cursor-pointer text-left"
                  style={{ padding: "20px 20px 8px 20px" }}
                >
                  {activeSection === "playground" ? "Playground" : "Selected Works"}
                  <CaretDown size={20} color="#3B4028" />
                </button>
                <button
                  onClick={() => {
                    handleSectionChange(activeSection === "playground" ? "selected-works" : "playground");
                    setSectionDropdownOpen(false);
                  }}
                  className="font-geist font-light text-[24px] leading-tight bg-transparent border-0 cursor-pointer text-left"
                  style={{ padding: "4px 20px 20px 20px", color: "#A6AA74" }}
                >
                  {activeSection === "playground" ? "Selected Works" : "Playground"}
                </button>
              </div>
            )}
          </div>

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
              <div className="mt-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="font-geist font-semibold text-[20px] leading-tight text-text-default">{currentProject.label}</p>
                  <p className="font-geist font-light text-[20px] leading-tight text-text-default">{currentProject.name}</p>
                </div>
                <div className="w-[120px] h-[56px] flex items-center justify-end">
                  {currentProject.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentProject.logo} alt={currentProject.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-surface-tag rounded-lg" />
                  )}
                </div>
              </div>

              {/* Images stacked */}
              <div className="mt-6 flex flex-col gap-4">
                {currentProject.images.map((src, i) => {
                  const isLast = i === currentProject.images.length - 1;
                  const hug = isLast && currentProject.hugLast;
                  return (
                    <div
                      key={i}
                      className={`w-full rounded-lg overflow-hidden bg-surface-tag flex items-center justify-center ${
                        hug ? "h-auto" : "h-[220px]"
                      }`}
                    >
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-geist font-light text-[18px] text-text-muted opacity-40">
                          {currentProject.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/home/dl-monogram.svg" alt="" aria-hidden="true" className="w-[104px] mt-12" />

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
      </div>

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

          {/* Top — menu botões */}
          <div className="mt-8 flex flex-col gap-[20px]">
            <button
              onClick={() => handleSectionChange("playground")}
              className={`w-fit font-geist font-light text-[40px] leading-tight whitespace-nowrap text-left cursor-pointer border-0 bg-transparent p-0 flex items-center gap-[8px] ${
                activeSection === "playground" ? "text-text-active" : "text-text-muted hover:text-text-default transition-colors"
              }`}
            >
              {activeSection === "playground" && (
                <ArrowRight size={40} color="#3B4028" weight="regular" />
              )}
              Playground
            </button>
            <button
              onClick={() => handleSectionChange("selected-works")}
              className={`w-fit font-geist font-light text-[40px] leading-tight whitespace-nowrap text-left cursor-pointer border-0 bg-transparent p-0 flex items-center gap-[8px] ${
                activeSection === "selected-works" ? "text-text-active" : "text-text-muted hover:text-text-default transition-colors"
              }`}
            >
              {activeSection === "selected-works" && (
                <ArrowRight size={40} color="#3B4028" weight="regular" />
              )}
              Selected Works
            </button>
          </div>

          {/* Bottom — monogram */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/home/dl-monogram.svg" alt="" aria-hidden="true" className="w-[88px]" />

        </div>

        <ProjectSelector
          projects={currentProjects}
          activeProject={activeProject}
          onSelect={setActiveProject}
        />

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
              <p className="mt-2 font-geist font-light text-[14px] text-text-muted">
                wrong password
              </p>
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
