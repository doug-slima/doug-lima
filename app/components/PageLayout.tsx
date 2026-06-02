"use client";

import Header from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Extra classes for the outermost div (e.g. "relative h-screen overflow-hidden"). */
  outerClassName?: string;
  /** Extra classes for the content div. Base: px-[10.5rem] pt-28 pb-20 flex flex-col. */
  contentClassName?: string;
  /**
   * Absolute-positioned layers rendered between the outer div and the content div.
   * Used by the home page for the mosaic background and blur overlay.
   * The outer div is always set to `position: relative` when this is provided.
   */
  backgroundLayers?: React.ReactNode;
  /**
   * When provided, renders a footer at the bottom of the content div:
   *   <footer mt-auto flex items-end justify-between>
   *     <img dl-monogram.svg w-[88px] />
   *     {footerContent}
   *   </footer>
   *
   * Omit entirely (leave undefined) for pages that place the monogram themselves
   * (e.g. the track page, where the monogram lives inside the sticky left column).
   */
  footerContent?: React.ReactNode;
}

export default function PageLayout({
  children,
  outerClassName = "",
  contentClassName = "",
  backgroundLayers,
  footerContent,
}: PageLayoutProps) {
  return (
    <div className={`bg-bg-base ${outerClassName}`}>
      {backgroundLayers}
      <div className={`px-5 md:px-[10.5rem] pt-10 md:pt-20 pb-10 md:pb-20 flex flex-col ${contentClassName}`}>
        <Header />
        {children}
        {footerContent !== undefined && (
          <footer className="mt-auto flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/home/dl-monogram.svg"
              alt=""
              aria-hidden="true"
              className="w-[64px] md:w-[88px]"
            />
            {footerContent}
          </footer>
        )}
      </div>
    </div>
  );
}
