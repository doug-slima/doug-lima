"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSelector from "./NavSelector";

function LogoAndNav() {
  const pathname = usePathname();
  return (
    <>
      <Link href="/" className="group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering.svg" alt="doug_lima." className="h-[32px] w-auto block group-hover:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering-hover.svg" alt="" aria-hidden="true" className="h-[32px] w-auto hidden group-hover:block" />
      </Link>
      <nav>
        <NavSelector
          items={[
            { label: "craft", href: "/craft", active: pathname === "/craft" },
            { label: "track", href: "/track", active: pathname === "/track" },
          ]}
          gap={8}
        />
      </nav>
    </>
  );
}

export default function Header() {
  return (
    <>
      {/* Mobile: fixed at top with background + gradient fade */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto bg-bg-base px-10 pt-10">
          <header className="flex items-start justify-between py-6">
            <LogoAndNav />
          </header>
        </div>
        <div style={{ height: "24px", background: "linear-gradient(to bottom, #F9F9F2 0%, rgba(249,249,242,0) 100%)" }} />
      </div>

      {/* Desktop: in-flow, positioned by the page layout */}
      <header className="hidden md:flex items-start justify-between">
        <LogoAndNav />
      </header>
    </>
  );
}
