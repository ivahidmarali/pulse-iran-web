"use client";
import Link from "next/link";

const GROUPS = ["سیاسی", "بین‌الملل", "اقتصادی", "اجتماعی", "ورزشی", "تکنولوژی", "حاشیه"];

export default function TopBarDesktop() {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 shadow-sm hidden md:grid md:grid-cols-3 items-center px-container-margin py-4" dir="rtl">
      {/* RIGHT — category nav */}
      <nav className="flex items-center gap-5 flex-row-reverse justify-start">
        {GROUPS.map((g) => (
          <Link
            key={g}
            href={`/categories?group=${encodeURIComponent(g)}`}
            className="text-on-surface-variant hover:text-secondary-fixed-dim font-title-md text-title-md transition-colors duration-200 whitespace-nowrap"
          >
            {g}
          </Link>
        ))}
      </nav>

      {/* CENTER — logo */}
      <div className="flex justify-center">
        <Link href="/" className="text-display-lg font-black text-secondary-fixed-dim tracking-tighter">
          پالس ایران
        </Link>
      </div>

      {/* LEFT — search + about */}
      <div className="flex items-center gap-4 justify-start flex-row-reverse">
        <Link href="/about" className="text-on-surface-variant hover:text-secondary-fixed-dim font-title-md text-title-md transition-colors duration-200">
          درباره ما
        </Link>
        <Link href="/search" className="relative">
          <input
            readOnly
            dir="rtl"
            className="bg-surface-container-high border-none rounded-full px-6 py-2 pr-10 text-sm focus:ring-2 focus:ring-secondary-fixed-dim w-48 cursor-pointer"
            placeholder="جستجو..."
          />
          <span className="absolute right-3 top-2 text-on-surface-variant">🔍</span>
        </Link>
      </div>
    </header>
  );
}
