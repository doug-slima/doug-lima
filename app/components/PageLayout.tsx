"use client";

import Header from "./Header";
import PageFooter from "./PageFooter";

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
      <div className={`px-8 md:px-[72px] pb-10 md:pb-20 flex flex-col page-content-pt ${contentClassName}`}>
        <Header />
        {children}
        {footerContent !== undefined && (
          <PageFooter variant="static" right={footerContent} />
        )}
      </div>
    </div>
  );
}
