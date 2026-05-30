"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import Header from "../components/Header";
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

  return (
    <div className="bg-bg-base h-screen overflow-hidden relative">

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

        <ProjectSelector
          projects={currentProjects}
          activeProject={activeProject}
          onSelect={setActiveProject}
        />

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
  );
}
