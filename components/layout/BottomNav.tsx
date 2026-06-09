"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WC_END = new Date("2026-07-19T23:59:59Z");

type NavItem = {
  href: string;
  label: string;
  isWC?: boolean;
  icon: (active: boolean) => ReactNode;
};

const STATIC_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "خانه",
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: "/search",
    label: "جستجو",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/prices",
    label: "نرخ ارز",
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M14.5 8H9.5a2 2 0 000 4h5a2 2 0 010 4H9"/>
        <path d="M12 6v2m0 8v2"/>
      </svg>
    ),
  },
];

const WC_ITEM: NavItem = {
  href: "/جام-جهانی",
  label: "جام جهانی",
  isWC: true,
  icon: () => <span className="text-2xl leading-none">🏆</span>,
};

const CATEGORIES_ITEM: NavItem = {
  href: "/categories",
  label: "دسته‌بندی",
  icon: (active) => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
};

const LIVESCORE_ITEM: NavItem = {
  href: "/livescore",
  label: "نتایج زنده",
  icon: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="14" rx="1.5"/>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();
  const isWCSeason = new Date() <= WC_END;
  const fourthItem = isWCSeason ? WC_ITEM : CATEGORIES_ITEM;
  const navItems: NavItem[] = [...STATIC_ITEMS, fourthItem, LIVESCORE_ITEM];

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
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] rounded-xl transition-all ${
              item.isWC
                ? active
                  ? "text-amber-400"
                  : "text-amber-400/70 hover:text-amber-400"
                : active
                ? "text-secondary-fixed-dim"
                : "text-on-surface-variant"
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
