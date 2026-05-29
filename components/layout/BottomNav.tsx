"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "خانه",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "جستجو",
    icon: (_active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/prices",
    label: "نرخ ارز",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M14.5 8H9.5a2 2 0 000 4h5a2 2 0 010 4H9"/>
        <path d="M12 6v2m0 8v2"/>
      </svg>
    ),
  },
  {
    href: "/categories",
    label: "دسته\u200cبندی",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: "/sources",
    label: "منابع",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path d="M4 22h14a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v4"/>
        <path d="M14 2v4a2 2 0 002 2h4"/>
        <path d="M2 15h10M2 19h6"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface-container border-t border-white/10 flex flex-row-reverse justify-around items-center px-2 py-3 md:hidden safe-area-pb">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              active ? "text-secondary-fixed-dim" : "text-on-surface-variant"
            }`}
          >
            <span className="relative">
              {item.icon(active)}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
