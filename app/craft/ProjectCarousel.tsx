import { type Ref } from "react";
import ScrollColumn from "../components/ScrollColumn";
import type { Project } from "./data";

interface Props {
  project: Project;
  rightColRef: Ref<HTMLDivElement>;
  firstItemRef: Ref<HTMLDivElement>;
  lastItemRef: Ref<HTMLDivElement>;
  rightColLeft: number;
  paddingTop: number;
  paddingBottom: number;
  blurHeight?: number;
  blurSolidUntil?: string;
}

export default function ProjectCarousel({
  project,
  rightColRef,
  firstItemRef,
  lastItemRef,
  rightColLeft,
  paddingTop,
  paddingBottom,
  blurHeight,
  blurSolidUntil,
}: Props) {
  return (
    <ScrollColumn
      ref={rightColRef}
      className="absolute inset-y-0 right-0 z-0"
      style={{ left: `${rightColLeft}px` }}
      blurHeight={blurHeight}
      blurSolidUntil={blurSolidUntil}
    >
      <div
        className="flex flex-col gap-[80px] pr-[10.5rem]"
        style={{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}
      >
        {/* Info block — firstItemRef, centro em 50vh */}
        <div ref={firstItemRef} className="h-[144px] flex items-center justify-between">
          <div className="flex flex-col">
            <p className="font-geist font-semibold text-[24px] leading-tight text-text-default">
              {project.label}
            </p>
            <p className="font-geist font-light text-[24px] leading-tight text-text-default">
              {project.name}
            </p>
          </div>
          <div className="w-[400px] h-full flex items-center justify-end">
            {project.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.logo}
                alt={project.name}
                className="h-[56px] w-auto object-contain"
              />
            ) : (
              <div className="w-full h-[80px] bg-surface-tag rounded-lg" />
            )}
          </div>
        </div>

        {/* lastItemRef fallback quando não há imagens */}
        {project.images.length === 0 && <div ref={lastItemRef} />}

        {/* Image displays */}
        {project.images.map((src, i) => {
          const isLast = i === project.images.length - 1;
          const hug = isLast && project.hugLast;
          return (
            <div
              key={i}
              ref={isLast ? lastItemRef : undefined}
              className={`w-full rounded-lg overflow-hidden bg-surface-tag flex items-center justify-center ${
                hug ? "h-auto" : "h-[527px]"
              }`}
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-geist font-light text-[24px] text-text-muted opacity-40">
                  {project.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </ScrollColumn>
  );
}
