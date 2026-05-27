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

  const clearAll = () => {
    localStorage.removeItem("saved_news");
    setItems([]);
  };

  const ItemList = () => (
    <>
      {items.length === 0 ? (
        <p className="text-on-surface-variant text-sm text-right">هنوز خبری ذخیره نکرده‌اید</p>
      ) : (
        <>
          <p className="text-on-surface-variant text-sm text-right mb-4">{items.length} خبر ذخیره شده</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="relative bg-surface-container-low rounded-xl p-4 border border-white/5">
                <Link href={`/article/${encodeURIComponent(item.id)}`}>
                  <p className="text-sm font-medium text-on-surface text-right line-clamp-3 pl-12">{item.title}</p>
                  <p className="text-xs text-secondary-fixed-dim text-right mt-1">{item.source}</p>
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  className="absolute top-3 left-3 text-xs text-red-400 bg-gray-900/80 px-2 py-1 rounded hover:text-red-300 transition-colors"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="w-full mt-4 py-2 bg-gray-800 text-red-400 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            پاک کردن همه
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24 px-container-margin py-section-gap">
          <h1 className="text-title-md font-title-md text-secondary-fixed-dim mb-6 text-right">🔖 خبرهای ذخیره‌شده</h1>
          <ItemList />
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-2xl mx-auto px-container-margin py-section-gap">
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-8 text-right">🔖 خبرهای ذخیره‌شده</h1>
          <ItemList />
        </main>
        <Footer />
      </div>
    </div>
  );
}
