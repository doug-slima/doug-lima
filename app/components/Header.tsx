"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavSelector from "./NavSelector";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-start justify-between py-6 md:py-0">
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
          gap={0}
        />
      </nav>
    </header>
  );
}
