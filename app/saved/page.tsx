"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { articleHref } from "@/lib/utils";

interface SavedNews {
  id: string;
  title: string;
  source: string;
  url: string;
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/30">
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-on-surface">هنوز خبری ذخیره نکرده‌اید</p>
        <p className="text-xs text-on-surface-variant mt-1">آیکون ذخیره را در صفحه هر خبر بزنید</p>
      </div>
      <Link
        href="/"
        className="mt-2 px-5 py-2 bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/30 text-secondary-fixed-dim rounded-full text-sm font-medium"
      >
        مرور اخبار
      </Link>
    </div>
  );
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedNews[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("saved_news") || "[]");
    setItems(stored.reverse());
    setLoaded(true);
  }, []);

  const remove = (id: string) => {
    const updated = items.filter((n) => n.id !== id);
    setItems(updated);
    localStorage.setItem("saved_news", JSON.stringify([...updated].reverse()));
  };

  const clearAll = () => {
    localStorage.removeItem("saved_news");
    setItems([]);
  };

  const content = (
    <div dir="rtl">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          {loaded && items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
            >
              پاک کردن همه
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loaded && items.length > 0 && (
            <span className="text-xs text-on-surface-variant">{items.length} خبر</span>
          )}
          <h1 className="text-base font-bold text-on-surface">ذخیره‌شده‌ها</h1>
          <span className="text-secondary-fixed-dim"><BookmarkIcon filled /></span>
        </div>
      </div>

      {!loaded ? null : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-surface-container rounded-2xl border border-white/5 group"
            >
              <Link
                href={articleHref(item.id, item.title)}
                className="flex-1 min-w-0"
              >
                <p className="text-xs text-secondary-fixed-dim font-medium mb-1">{item.source}</p>
                <p className="text-sm font-semibold text-on-surface leading-relaxed line-clamp-3">
                  {item.title}
                </p>
              </Link>
              <button
                onClick={() => remove(item.id)}
                className="shrink-0 mt-0.5 text-on-surface-variant hover:text-red-400 transition-colors"
                title="حذف"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen cyber-grid">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24 px-container-margin pt-6">
          {content}
        </main>
        <MobileFooter />
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-2xl mx-auto px-container-margin py-10">
          {content}
        </main>
        <Footer />
      </div>
    </div>
  );
}
