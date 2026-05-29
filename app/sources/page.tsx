import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import { getSources } from "@/lib/api";
import { SourceInfo } from "@/lib/types";
import { toPersianNum } from "@/lib/utils";

export const metadata: Metadata = {
  title: "منابع خبری",
  description: "فهرست منابع خبری پالس ایران — رسانه‌های داخلی و خارجی با گرایش سیاسی",
};

const LEAN_BAR: Record<string, string> = {
  "اصولگرا":               "bg-green-500",
  "اصلاح‌طلب":             "bg-blue-500",
  "اصلاح‌طلب میانه":       "bg-blue-400",
  "محافظه‌کار میانه":      "bg-yellow-500",
  "لیبرال غربی":           "bg-purple-500",
  "مخالف جمهوری اسلامی":  "bg-red-500",
  "لیبرال آمریکایی":      "bg-purple-400",
  "چپ لیبرال":             "bg-indigo-400",
  "محافظه‌کار عربی":       "bg-yellow-600",
  "مستقل":                 "bg-slate-400",
  "رسمی دولتی":            "bg-green-600",
};

const LEAN_TEXT: Record<string, string> = {
  "اصولگرا":               "text-green-400",
  "اصلاح‌طلب":             "text-blue-400",
  "اصلاح‌طلب میانه":       "text-blue-300",
  "محافظه‌کار میانه":      "text-yellow-400",
  "لیبرال غربی":           "text-purple-400",
  "مخالف جمهوری اسلامی":  "text-red-400",
  "لیبرال آمریکایی":      "text-purple-300",
  "چپ لیبرال":             "text-indigo-300",
  "محافظه‌کار عربی":       "text-yellow-500",
  "مستقل":                 "text-slate-400",
  "رسمی دولتی":            "text-green-500",
};

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    return await getSources();
  } catch {
    return [];
  }
}

function SourceCard({ src }: { src: SourceInfo }) {
  const barColor = LEAN_BAR[src.political_lean ?? ""] ?? "bg-white/10";
  const textColor = LEAN_TEXT[src.political_lean ?? ""] ?? "text-on-surface-variant";
  return (
    <Link
      href={`/categories?source=${encodeURIComponent(src.name)}`}
      className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all"
    >
      {/* lean color bar */}
      <div className={`w-1 h-10 rounded-full shrink-0 ${barColor} opacity-70`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{src.name}</p>
        {src.political_lean && (
          <p className={`text-[11px] mt-0.5 ${textColor}`}>{src.political_lean}</p>
        )}
      </div>
      <span className="text-xs text-secondary-fixed-dim font-bold tabular-nums shrink-0">
        {toPersianNum(src.count ?? 0)}
      </span>
    </Link>
  );
}

export default async function SourcesPage() {
  const sources = await fetchSources();

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24 px-container-margin pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-on-surface-variant">{toPersianNum(sources.length)} منبع فعال</span>
            <h1 className="text-base font-bold text-on-surface">منابع خبری</h1>
          </div>
          <div className="space-y-2">
            {sources.map((src) => <SourceCard key={src.name} src={src} />)}
          </div>
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-3xl mx-auto px-container-margin py-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm text-on-surface-variant">{toPersianNum(sources.length)} منبع فعال</span>
            <h1 className="text-xl font-bold text-on-surface">منابع خبری</h1>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sources.map((src) => <SourceCard key={src.name} src={src} />)}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
