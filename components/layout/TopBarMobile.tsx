import Link from "next/link";

export default function TopBarMobile() {
  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-[0px_0px_12px_rgba(0,212,255,0.1)] sticky top-0 z-50 flex flex-row-reverse items-center justify-between px-container-margin w-full h-16 md:hidden">
      <Link href="/">
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-secondary-fixed-dim tracking-tighter">
          پالس ایران
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/search" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
