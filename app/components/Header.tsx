"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-start justify-between">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/doug-lima-lettering.svg" alt="doug_lima." />
      </Link>

      <nav>
        <div className="flex gap-6 font-fenix text-[20px]">
          <Link
            href="/craft"
            className={
              pathname === "/craft"
                ? "text-text-active underline decoration-text-active underline-offset-[3px]"
                : "text-text-default hover:text-text-active hover:underline hover:decoration-text-active hover:underline-offset-[3px] transition-colors"
            }
          >
            craft
          </Link>
          <Link
            href="/track"
            className={
              pathname === "/track"
                ? "text-text-active underline decoration-text-active underline-offset-[3px]"
                : "text-text-default hover:text-text-active hover:underline hover:decoration-text-active hover:underline-offset-[3px] transition-colors"
            }
          >
            track
          </Link>
        </div>
      </nav>
    </header>
  );
}
