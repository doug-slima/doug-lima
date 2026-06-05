"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSelector from "./NavSelector";

/**
 * Header — two-block architecture
 *
 * Variant A (default): Block 1 only — logo + page selectors (Craft / Track)
 * Variant B (block2 prop): Block 1 + Block 2 — page-specific dropdown + project selectors
 *
 * Mobile:  fixed top-0, Block 2 stacks vertically (flex-col)
 * Desktop: in-flow, Block 2 lays out horizontally (flex-row, items-center)
 *
 * The same `block2` JSX renders in both contexts — sub-components handle
 * their own responsive adaptations via Tailwind breakpoint classes.
 */
interface HeaderProps {
  block2?: React.ReactNode;
}

function PageNav() {
  const pathname = usePathname();
  return (
    <>
      <Link href="/" className="group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering.svg" alt="doug_lima." className="h-[clamp(28px,7.5vw,32px)] md:h-[40px] w-auto block group-hover:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering-hover.svg" alt="" aria-hidden="true" className="h-[clamp(28px,7.5vw,32px)] md:h-[40px] w-auto hidden group-hover:block" />
      </Link>
      <nav>
        <NavSelector
          items={[
            { label: "Craft", href: "/craft", active: pathname === "/craft" },
            { label: "Track", href: "/track", active: pathname === "/track" },
          ]}
          gap={12}
          pillHeight="h-[clamp(28px,7.5vw,32px)] md:h-[40px]"
          textSize="text-[18px] md:text-[24px]"
        />
      </nav>
    </>
  );
}

export default function Header({ block2 }: HeaderProps) {
  return (
    <>
      {/* Mobile: fixed at top with background + gradient fade */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto bg-bg-base px-8 pt-[44px]">
          <header className="flex items-start justify-between pb-3">
            <PageNav />
          </header>
          {block2 && (
            <div className="pt-6 pb-4 flex flex-col gap-3">
              {block2}
            </div>
          )}
        </div>
        <div style={{ height: "24px", background: "linear-gradient(to bottom, #F9F9F2 0%, rgba(249,249,242,0) 100%)" }} />
      </div>

      {/* Desktop: in-flow, positioned by the page layout */}
      <div className="hidden md:block">
        <header className="flex items-center justify-between">
          <PageNav />
        </header>
        {block2 && (
          <div className="pt-6 flex items-center gap-6">
            {block2}
          </div>
        )}
      </div>
    </>
  );
}
