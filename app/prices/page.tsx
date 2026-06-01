import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { getPrices } from "@/lib/api";
import { PriceItem } from "@/lib/types";
import { SITE_URL } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "نرخ ارز و طلا",
  description: "نرخ زنده دلار، یورو، طلا، سکه و ارزهای دیجیتال در ایران — به‌روزرسانی لحظه‌ای",
  keywords: ["نرخ دلار", "قیمت طلا", "قیمت سکه", "نرخ ارز", "بیت کوین", "ایران"],
  openGraph: { type: "website", url: `${SITE_URL}/prices` },
  alternates: { canonical: `${SITE_URL}/prices`, languages: { fa: `${SITE_URL}/prices`, "x-default": `${SITE_URL}/prices` } },
};

async function fetchPrices(): Promise<PriceItem[]> {
  try {
    return await getPrices();
  } catch {
    return [];
  }
}

const PRICE_META: Record<string, { name: string; symbol: string; category: string }> = {
  price_dollar_rl: { name: "دلار آمریکا",         symbol: "$",  category: "ارزها" },
  price_eur:       { name: "یورو",                 symbol: "€",  category: "ارزها" },
  price_aed:       { name: "درهم امارات",          symbol: "د",  category: "ارزها" },
  price_gbp:       { name: "پوند انگلیس",          symbol: "£",  category: "ارزها" },
  price_try:       { name: "لیر ترکیه",            symbol: "₺",  category: "ارزها" },
  geram18:         { name: "طلای ۱۸ عیار (گرم)",   symbol: "Au", category: "طلا و سکه" },
  mesghal:         { name: "مثقال طلا",            symbol: "Au", category: "طلا و سکه" },
  sekeb:           { name: "سکه تمام بهار",        symbol: "⬡",  category: "طلا و سکه" },
  sekke:           { name: "سکه تمام بهار",        symbol: "⬡",  category: "طلا و سکه" },
  nim:             { name: "نیم سکه",              symbol: "½⬡", category: "طلا و سکه" },
  rob:             { name: "ربع سکه",              symbol: "¼⬡", category: "طلا و سکه" },
};

const CURRENCY_KEYS = ["price_dollar_rl", "price_eur", "price_aed", "price_gbp", "price_try"];
const GOLD_KEYS     = ["sekeb", "sekke", "nim", "rob", "geram18", "mesghal"];

function TrendArrow({ trend, changePct }: { trend: string; changePct: number }) {
  if (!changePct || trend === "flat") return null;
  const up = trend === "up";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor">
        {up
          ? <path d="M6 2l4 5H2l4-5z"/>
          : <path d="M6 10L2 5h8l-4 5z"/>}
      </svg>
      {Math.abs(changePct).toFixed(1)}٪
    </span>
  );
}

function PriceCard({ item }: { item: PriceItem }) {
  const meta = PRICE_META[item.key] ?? { name: item.key, symbol: "?", category: "" };
  const trend = item.trend ?? "flat";
  const changePct = item.change_pct ?? 0;
  const up = trend === "up";
  const down = trend === "down";

  return (
    <div className={`relative rounded-2xl p-5 flex flex-col gap-3 bg-surface-container border transition-all ${
      up ? "border-emerald-500/20" : down ? "border-red-500/20" : "border-white/5"
    }`}>
      <div className="flex items-start justify-between">
        <TrendArrow trend={trend} changePct={changePct} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-on-surface-variant">{meta.name}</span>
          <div className="w-9 h-9 rounded-xl bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim font-black text-sm shrink-0">
            {meta.symbol}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-on-surface tabular-nums">
          {item.price.toLocaleString("fa-IR")}
        </span>
        <span className="text-xs text-on-surface-variant mr-1">تومان</span>
      </div>
    </div>
  );
}

function PriceRow({ item }: { item: PriceItem }) {
  const meta = PRICE_META[item.key] ?? { name: item.key, symbol: "?", category: "" };
  const trend = item.trend ?? "flat";
  const changePct = item.change_pct ?? 0;
  const up = trend === "up";
  const down = trend === "down";

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0">
      {/* symbol badge */}
      <div className="w-10 h-10 rounded-xl bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim font-black text-sm shrink-0">
        {meta.symbol}
      </div>
      {/* name */}
      <div className="flex-1 text-right">
        <p className="text-sm font-medium text-on-surface">{meta.name}</p>
      </div>
      {/* price + trend */}
      <div className="text-left shrink-0">
        <p className="text-sm font-bold tabular-nums text-on-surface">
          {item.price.toLocaleString("fa-IR")}
          <span className="text-[10px] text-on-surface-variant font-normal mr-1">ت</span>
        </p>
        {changePct !== 0 && (
          <p className={`text-[11px] font-bold tabular-nums text-left mt-0.5 ${up ? "text-emerald-400" : down ? "text-red-400" : "text-on-surface-variant"}`}>
            {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}٪
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      <h2 className="text-base font-bold text-on-surface">{title}</h2>
      <span className="w-8 h-8 rounded-lg bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim">
        {icon}
      </span>
    </div>
  );
}

const CurrencyIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="10" cy="10" r="8"/>
    <path d="M12 7H8.5a1.5 1.5 0 000 3h3a1.5 1.5 0 010 3H8"/>
    <path d="M10 5.5v1M10 13.5v1"/>
  </svg>
);

const GoldIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="10,2 13,7 19,8 14.5,12.5 16,19 10,16 4,19 5.5,12.5 1,8 7,7"/>
  </svg>
);

function PricesJsonLd({ prices }: { prices: PriceItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "نرخ زنده ارز و طلا در ایران",
    description: "نرخ لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال در بازار ایران",
    url: "https://palsiran.com/prices",
    temporalCoverage: new Date().toISOString().split("T")[0],
    dateModified: new Date().toISOString(),
    publisher: { "@id": "https://palsiran.com/#organization" },
    variableMeasured: prices.map((p) => {
      const meta = PRICE_META[p.key];
      return {
        "@type": "PropertyValue",
        name: meta?.name ?? p.key,
        value: p.price,
        unitText: "IRR",
      };
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function PricesPage() {
  const prices = await fetchPrices();
  const priceMap = Object.fromEntries(prices.map((p) => [p.key, p]));
  const currencies = CURRENCY_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];
  const gold = GOLD_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];

  return (
    <div className="cyber-grid" dir="rtl">
      <PricesJsonLd prices={prices} />
      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-4">
          {/* header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] text-on-surface-variant">هر ۵ دقیقه به‌روز می‌شود</span>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-on-surface">نرخ ارز و طلا</h1>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </div>

          {/* currencies */}
          <section className="mb-8">
            <SectionHeader title="ارزها" icon={<CurrencyIcon />} />
            <div className="bg-surface-container rounded-2xl overflow-hidden border border-white/5">
              {currencies.map((p) => <PriceRow key={p.key} item={p} />)}
              {currencies.length === 0 && (
                <p className="p-4 text-on-surface-variant text-sm text-center">داده‌ای موجود نیست</p>
              )}
            </div>
          </section>

          {/* gold */}
          <section>
            <SectionHeader title="طلا و سکه" icon={<GoldIcon />} />
            <div className="bg-surface-container rounded-2xl overflow-hidden border border-white/5">
              {gold.map((p) => <PriceRow key={p.key} item={p} />)}
              {gold.length === 0 && (
                <p className="p-4 text-on-surface-variant text-sm text-center">داده‌ای موجود نیست</p>
              )}
            </div>
          </section>
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-5xl mx-auto px-container-margin py-10">
          {/* page header */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-xs text-on-surface-variant">هر ۵ دقیقه به‌روز می‌شود</span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-on-surface">نرخ ارز و طلا</h1>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
          </div>

          {/* currencies */}
          <section className="mb-10">
            <SectionHeader title="ارزها" icon={<CurrencyIcon />} />
            <div className="grid grid-cols-3 gap-4">
              {currencies.map((p) => <PriceCard key={p.key} item={p} />)}
            </div>
          </section>

          {/* gold */}
          <section>
            <SectionHeader title="طلا و سکه" icon={<GoldIcon />} />
            <div className="grid grid-cols-3 gap-4">
              {gold.map((p) => <PriceCard key={p.key} item={p} />)}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
