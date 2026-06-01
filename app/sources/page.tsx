import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { getSources } from "@/lib/api";
import { SourceInfo } from "@/lib/types";
import { toPersianNum } from "@/lib/utils";

export const metadata: Metadata = {
  title: "منابع خبری",
  description: "فهرست منابع خبری پالس ایران — رسانه‌های داخلی و خارجی با گرایش سیاسی",
};

const LEAN_META: Record<string, { bar: string; text: string; bg: string }> = {
  "اصولگرا":               { bar: "bg-green-500",   text: "text-green-400",   bg: "bg-green-500/10" },
  "رسمی دولتی":            { bar: "bg-green-600",   text: "text-green-500",   bg: "bg-green-600/10" },
  "اصلاح‌طلب":             { bar: "bg-blue-500",    text: "text-blue-400",    bg: "bg-blue-500/10" },
  "اصلاح‌طلب میانه":       { bar: "bg-blue-400",    text: "text-blue-300",    bg: "bg-blue-400/10" },
  "محافظه‌کار میانه":      { bar: "bg-yellow-500",  text: "text-yellow-400",  bg: "bg-yellow-500/10" },
  "لیبرال غربی":           { bar: "bg-purple-500",  text: "text-purple-400",  bg: "bg-purple-500/10" },
  "لیبرال آمریکایی":      { bar: "bg-purple-400",  text: "text-purple-300",  bg: "bg-purple-400/10" },
  "چپ لیبرال":             { bar: "bg-indigo-400",  text: "text-indigo-300",  bg: "bg-indigo-400/10" },
  "مخالف جمهوری اسلامی":  { bar: "bg-red-500",     text: "text-red-400",     bg: "bg-red-500/10" },
  "محافظه‌کار عربی":       { bar: "bg-yellow-600",  text: "text-yellow-500",  bg: "bg-yellow-600/10" },
  "مستقل":                 { bar: "bg-slate-400",   text: "text-slate-400",   bg: "bg-slate-400/10" },
};

// Preferred display order for lean groups
const LEAN_ORDER = [
  "رسمی دولتی", "اصولگرا", "محافظه‌کار میانه",
  "اصلاح‌طلب", "اصلاح‌طلب میانه", "مستقل",
  "لیبرال غربی", "لیبرال آمریکایی", "چپ لیبرال",
  "مخالف جمهوری اسلامی", "محافظه‌کار عربی",
];

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    return await getSources();
  } catch {
    return [];
  }
}

function SourceRow({ src }: { src: SourceInfo }) {
  const meta = LEAN_META[src.political_lean ?? ""];
  return (
    <Link
      href={`/categories?source=${encodeURIComponent(src.name)}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
    >
      <div className={`w-1.5 h-8 rounded-full shrink-0 ${meta?.bar ?? "bg-white/10"}`} />
      <span className="flex-1 text-sm font-medium text-on-surface">{src.name}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-secondary-fixed-dim tabular-nums font-bold">
          {toPersianNum(src.count ?? 0)}
        </span>
        <svg viewBox="0 0 16 16" className="w-3 h-3 text-on-surface-variant/40" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M10 4L6 8l4 4"/>
        </svg>
      </div>
    </Link>
  );
}

function CredibilityBar({ value }: { value?: number }) {
  if (value == null) return null;
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5" title={`اعتبار: ${pct}%`}>
      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9px] text-on-surface-variant tabular-nums">{toPersianNum(pct)}%</span>
    </div>
  );
}

function SourceCard({ src }: { src: SourceInfo }) {
  const meta = LEAN_META[src.political_lean ?? ""];
  return (
    <Link
      href={`/categories?source=${encodeURIComponent(src.name)}`}
      className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all"
    >
      <div className={`w-1 h-10 rounded-full shrink-0 ${meta?.bar ?? "bg-white/10"} opacity-70`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{src.name}</p>
        {src.political_lean && (
          <p className={`text-[11px] mt-0.5 ${meta?.text ?? "text-on-surface-variant"}`}>{src.political_lean}</p>
        )}
        <CredibilityBar value={src.credibility} />
      </div>
      <span className="text-xs text-secondary-fixed-dim font-bold tabular-nums shrink-0">
        {toPersianNum(src.count ?? 0)}
      </span>
    </Link>
  );
}

export default async function SourcesPage() {
  const sources = await fetchSources();

  // Group by political lean
  const grouped: Record<string, SourceInfo[]> = {};
  for (const src of sources) {
    const lean = src.political_lean || "سایر";
    if (!grouped[lean]) grouped[lean] = [];
    grouped[lean].push(src);
  }

  // Build ordered group list
  const orderedGroups: [string, SourceInfo[]][] = [];
  for (const lean of LEAN_ORDER) {
    if (grouped[lean]) orderedGroups.push([lean, grouped[lean]]);
  }
  if (grouped["سایر"]) orderedGroups.push(["سایر", grouped["سایر"]]);

  return (
    <div className="cyber-grid" dir="rtl">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <main className="pb-4 pt-4">
          {/* Page header */}
          <div className="flex items-center justify-between px-container-margin mb-5">
            <span className="text-xs text-on-surface-variant">{toPersianNum(sources.length)} منبع</span>
            <h1 className="text-base font-bold text-on-surface">منابع خبری</h1>
          </div>

          {/* Flat source list */}
          <div className="px-container-margin space-y-2">
            {sources.map((src) => {
              const meta = LEAN_META[src.political_lean ?? ""];
              return (
                <Link
                  key={src.name}
                  href={`/categories?source=${encodeURIComponent(src.name)}`}
                  className="flex items-center gap-3 p-4 bg-surface-container rounded-lg border border-white/5 hover:border-secondary-fixed-dim/30 transition-all"
                >
                  <div className={`w-1.5 h-8 rounded-full shrink-0 ${meta?.bar ?? "bg-white/10"}`} />
                  <span className="flex-1 text-sm font-medium text-on-surface">{src.name}</span>
                  <span className="text-xs text-secondary-fixed-dim tabular-nums font-bold shrink-0">
                    {toPersianNum(src.count ?? 0)}
                  </span>
                  <svg viewBox="0 0 16 16" className="w-3 h-3 text-on-surface-variant/40 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M10 4L6 8l4 4"/>
                  </svg>
                </Link>
              );
            })}
          </div>
        </main>
        <MobileFooter />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
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
