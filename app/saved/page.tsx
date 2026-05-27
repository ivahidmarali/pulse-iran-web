"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";

interface SavedNews {
  id: string;
  title: string;
  source: string;
  url: string;
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedNews[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("saved_news") || "[]");
    setItems(stored.reverse());
  }, []);

  const remove = (id: string) => {
    const updated = items.filter((n) => n.id !== id);
    setItems(updated);
    localStorage.setItem("saved_news", JSON.stringify([...updated].reverse()));
  };

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24 px-container-margin py-section-gap">
          <h1 className="text-title-md font-title-md text-secondary-fixed-dim mb-6 text-right">ذخیره‌شده‌ها</h1>
          {items.length === 0 ? (
            <p className="text-on-surface-variant text-sm text-right">هیچ خبری ذخیره نشده است.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-container-low rounded-xl p-4 border border-white/5 flex flex-col gap-2">
                  <Link href={`/article/${encodeURIComponent(item.id)}`}>
                    <p className="text-sm font-medium text-on-surface text-right line-clamp-3">{item.title}</p>
                    <p className="text-xs text-secondary-fixed-dim text-right mt-1">{item.source}</p>
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="self-start text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-3xl mx-auto px-container-margin py-section-gap">
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-8 text-right">ذخیره‌شده‌ها</h1>
          {items.length === 0 ? (
            <p className="text-on-surface-variant text-right">هیچ خبری ذخیره نشده است.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-container-low rounded-xl p-5 border border-white/5 flex items-start justify-between gap-4">
                  <Link href={`/article/${encodeURIComponent(item.id)}`} className="flex-1 group">
                    <p className="text-base font-medium text-on-surface group-hover:text-secondary-fixed-dim transition-colors text-right line-clamp-2">{item.title}</p>
                    <p className="text-sm text-secondary-fixed-dim text-right mt-1">{item.source}</p>
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="shrink-0 text-xs text-red-400 hover:text-red-300 transition-colors mt-1"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
