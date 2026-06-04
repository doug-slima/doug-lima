"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSelector from "./NavSelector";

interface HeaderProps {
  menuNav?: React.ReactNode;
}

function PageNav() {
  const pathname = usePathname();
  return (
    <>
      <Link href="/" className="group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering.svg" alt="doug_lima." className="h-[40px] w-auto block group-hover:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering-hover.svg" alt="" aria-hidden="true" className="h-[40px] w-auto hidden group-hover:block" />
      </Link>
      <nav>
        <NavSelector
          items={[
            { label: "Craft", href: "/craft", active: pathname === "/craft" },
            { label: "Track", href: "/track", active: pathname === "/track" },
          ]}
          gap={12}
          pillHeight="h-[40px]"
        />
      </nav>
    </>
  );
}

export default function Header({ menuNav }: HeaderProps) {
  return (
    <>
      {/* Mobile: fixed at top with background + gradient fade */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="pointer-events-auto bg-bg-base px-10 pt-10">
          <header className="flex items-start justify-between py-6">
            <PageNav />
          </header>
        </div>
        <div style={{ height: "24px", background: "linear-gradient(to bottom, #F9F9F2 0%, rgba(249,249,242,0) 100%)" }} />
      </div>

      {/* Desktop: in-flow, positioned by the page layout */}
      <div className="hidden md:block">
        <header className="flex items-center justify-between">
          <PageNav />
        </header>
        {menuNav && (
          <div className="pt-6 pb-2 flex items-start gap-6">
            {menuNav}
          </div>
        )}
      </div>
    </>
  );
}
