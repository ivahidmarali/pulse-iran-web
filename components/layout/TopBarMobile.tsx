import Link from "next/link";
import TehranClock from "./TehranClock";

export default function TopBarMobile() {
  return (
    <header className="bg-background border-b border-white/5 shadow-[0px_0px_12px_rgba(0,212,255,0.1)] sticky top-0 z-50 flex flex-row-reverse items-center justify-between px-container-margin w-full h-16 md:hidden">
      {/* Right: logo */}
      <Link href="/" aria-label="پالس ایران — صفحه اصلی">
        <span className="text-headline-lg-mobile font-headline-lg-mobile text-secondary-fixed-dim tracking-tighter">
          پالس ایران
        </span>
      </Link>

      {/* Left: Tehran clock + search + bookmark */}
      <div className="flex items-center gap-3">
        <TehranClock />
        <Link href="/search" aria-label="جستجو" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </Link>
        <Link href="/saved" aria-label="اخبار ذخیره‌شده" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
