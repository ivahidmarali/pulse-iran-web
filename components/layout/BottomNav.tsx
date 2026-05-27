"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "خانه", emoji: "🏠" },
  { href: "/categories", label: "دسته‌بندی", emoji: "📂" },
  { href: "/prices", label: "نرخ ارز", emoji: "💰" },
  { href: "/search", label: "جستجو", emoji: "🔍" },
  { href: "/saved", label: "ذخیره‌ها", emoji: "🔖" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const items = JSON.parse(localStorage.getItem("saved_news") || "[]");
      setSavedCount(items.length);
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface-container border-t border-white/5 rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.5)] flex flex-row-reverse justify-around items-center px-4 py-2 md:hidden">
      {NAV.map(({ href, label, emoji }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all ${
              active ? "text-secondary-fixed-dim" : "text-on-surface-variant hover:text-secondary-fixed-dim"
            }`}
          >
            <span className="relative text-2xl leading-none">
              {emoji}
              {href === "/saved" && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {savedCount}
                </span>
              )}
            </span>
            <span className="text-label-sm font-label-sm">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
