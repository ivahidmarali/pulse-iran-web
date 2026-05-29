"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TehranClock from "./TehranClock";

const GROUPS = ["سیاسی", "بین‌الملل", "اقتصادی", "اجتماعی", "ورزشی", "تکنولوژی", "حاشیه"];

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeGroup = searchParams.get("group");

  return (
    <nav className="flex items-center gap-1 flex-row-reverse justify-start">
      <Link
        href="/"
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          pathname === "/"
            ? "text-secondary-fixed-dim bg-secondary-fixed-dim/10"
            : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
        }`}
      >
        خانه
      </Link>
      {GROUPS.map((g) => {
        const isActive = pathname.startsWith("/categories") && activeGroup === g;
        return (
          <Link
            key={g}
            href={`/categories?group=${encodeURIComponent(g)}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "text-secondary-fixed-dim bg-secondary-fixed-dim/10"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            {g}
          </Link>
        );
      })}
    </nav>
  );
}

export default function TopBarDesktop({ stickyTop = "top-0" }: { stickyTop?: string }) {
  return (
    <header
      className={`w-full sticky ${stickyTop} z-50 bg-surface/90 backdrop-blur-xl border-b border-white/5 hidden md:grid md:grid-cols-3 items-center px-container-margin h-14`}
      dir="rtl"
    >
      {/* RIGHT — category nav */}
      <Suspense fallback={<nav className="flex gap-1" />}>
        <NavLinks />
      </Suspense>

      {/* CENTER — logo */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="text-xl font-black text-secondary-fixed-dim tracking-tight hover:opacity-80 transition-opacity"
        >
          پالس ایران
        </Link>
      </div>

      {/* LEFT — clock + search + about */}
      <div className="flex items-center gap-4 justify-start flex-row-reverse">
        <TehranClock />
        <Link
          href="/about"
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200"
        >
          درباره ما
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 w-44"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span>جستجو...</span>
        </Link>
      </div>
    </header>
  );
}
