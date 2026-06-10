import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { getPrices } from "@/lib/api";
import { PriceItem } from "@/lib/types";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const today = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date());
  return {
    title: `قیمت دلار و طلا امروز — ${today}`,
    description: `نرخ زنده دلار، یورو، طلا، سکه در ایران امروز (${today}) — نرخ بازار آزاد، به‌روزرسانی هر ۵ دقیقه`,
    openGraph: {
      title: `قیمت دلار و طلا امروز — ${today} | پالس ایران`,
      description: `نرخ زنده دلار، یورو، طلا، سکه در ایران امروز — بازار آزاد`,
      type: "website",
      url: `${SITE_URL}/prices`,
    },
    alternates: { canonical: `${SITE_URL}/prices`, languages: { fa: `${SITE_URL}/prices`, "x-default": `${SITE_URL}/prices` } },
  };
}

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

function PricesJsonLd({ prices, priceMap }: { prices: PriceItem[]; priceMap: Record<string, PriceItem> }) {
  const fmt = (key: string) => priceMap[key]?.price?.toLocaleString("fa-IR");
  const dollar = fmt("price_dollar_rl");
  const gold = fmt("geram18");
  const sekeh = fmt("sekeb") ?? fmt("sekke");
  const eur = fmt("price_eur");
  const nim = fmt("nim");

  const today = new Date().toISOString().split("T")[0];

  const webPageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/prices`,
    name: "قیمت دلار و طلا امروز",
    description: "نرخ زنده دلار، یورو، طلا، سکه در ایران — بازار آزاد، به‌روزرسانی هر ۵ دقیقه",
    url: `${SITE_URL}/prices`,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "ItemList",
      name: "نرخ زنده ارز و طلا",
      itemListElement: prices
        .filter((p) => PRICE_META[p.key])
        .map((p, i) => {
          const meta = PRICE_META[p.key];
          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: meta.name,
              offers: {
                "@type": "Offer",
                priceCurrency: "IRR",
                price: String(p.price),
                priceValidUntil: today,
                availability: "https://schema.org/InStock",
                seller: { "@id": `${SITE_URL}/#organization` },
              },
            },
          };
        }),
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "قیمت دلار امروز در بازار آزاد ایران چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: dollar
            ? `نرخ دلار در بازار آزاد ایران امروز ${dollar} تومان است. این قیمت هر ۵ دقیقه یکبار در پالس ایران به‌روزرسانی می‌شود.`
            : "نرخ دلار در بازار آزاد ایران هر ۵ دقیقه در پالس ایران به‌روزرسانی می‌شود.",
        },
      },
      {
        "@type": "Question",
        name: "قیمت طلای ۱۸ عیار امروز چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: gold
            ? `قیمت طلای ۱۸ عیار امروز ${gold} تومان در هر گرم است. قیمت طلا بر اساس نرخ بازار آزاد ایران به‌روز می‌شود.`
            : "قیمت طلای ۱۸ عیار بر اساس نرخ بازار آزاد ایران هر ۵ دقیقه در پالس ایران به‌روزرسانی می‌شود.",
        },
      },
      {
        "@type": "Question",
        name: "قیمت سکه تمام بهار آزادی امروز چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: sekeh
            ? `قیمت سکه تمام بهار آزادی امروز ${sekeh} تومان است. نیم‌سکه${nim ? ` (${nim} تومان)` : ""} و ربع‌سکه نیز در همین صفحه نمایش داده می‌شوند.`
            : "قیمت سکه تمام بهار آزادی، نیم‌سکه و ربع‌سکه هر ۵ دقیقه در بخش طلا و سکه این صفحه به‌روز می‌شود.",
        },
      },
      {
        "@type": "Question",
        name: "قیمت یورو امروز در ایران چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: eur
            ? `نرخ یورو در بازار آزاد ایران امروز ${eur} تومان است. نرخ درهم، پوند و لیر ترکیه نیز در جدول ارزها موجود است.`
            : "نرخ یورو و سایر ارزها (درهم، پوند، لیر) بر اساس بازار آزاد ایران در این صفحه نمایش داده می‌شود.",
        },
      },
      {
        "@type": "Question",
        name: "آیا قیمت‌ها نرخ بازار آزاد است یا رسمی؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تمامی نرخ‌های ارز و طلا در پالس ایران بر اساس بازار آزاد (غیررسمی) است و شامل نرخ رسمی بانک مرکزی یا نرخ نیما نمی‌شود.",
        },
      },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageData) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqData) }} />
    </>
  );
}

const FAQ_ITEMS = [
  {
    q: "قیمت دلار امروز در بازار آزاد ایران چقدر است؟",
    a: "نرخ دلار در بازار آزاد ایران هر ۵ دقیقه یکبار در پالس ایران به‌روزرسانی می‌شود. آخرین قیمت را در جدول ارزها در بالای همین صفحه مشاهده کنید.",
  },
  {
    q: "قیمت طلا و سکه امروز در ایران چقدر است؟",
    a: "قیمت طلای ۱۸ عیار، مثقال طلا، سکه تمام بهار آزادی، نیم‌سکه و ربع‌سکه هر ۵ دقیقه در بخش «طلا و سکه» این صفحه به‌روز می‌شود.",
  },
  {
    q: "آیا قیمت‌های نمایش داده‌شده نرخ بازار آزاد است؟",
    a: "بله. تمامی نرخ‌های ارز و طلا در پالس ایران بر اساس بازار آزاد (غیررسمی) است و شامل نرخ رسمی بانک مرکزی یا نرخ نیما نمی‌شود.",
  },
  {
    q: "قیمت یورو و درهم امروز در ایران چقدر است؟",
    a: "نرخ یورو، درهم امارات، پوند انگلیس و لیر ترکیه در بخش «ارزها» همین صفحه هر ۵ دقیقه به‌روزرسانی می‌شود.",
  },
];

export default async function PricesPage() {
  const prices = await fetchPrices();
  const priceMap = Object.fromEntries(prices.map((p) => [p.key, p]));
  const currencies = CURRENCY_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];
  const gold = GOLD_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];

  return (
    <div className="cyber-grid" dir="rtl">
      <PricesJsonLd prices={prices} priceMap={priceMap} />
      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-4">
          {/* header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-on-surface-variant">هر ۵ دقیقه به‌روز می‌شود</span>
            <div className="flex items-center gap-2">
              <div role="heading" aria-level={1} className="text-lg font-bold text-on-surface">قیمت دلار و طلا امروز</div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mb-6 text-right">منبع: بازار آزاد ایران (غیررسمی) — شامل نرخ رسمی بانک مرکزی نیست</p>

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

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="text-base font-bold text-on-surface mb-4 text-right">سوالات متداول</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer text-sm font-medium text-on-surface text-right list-none">
                    {item.q}
                    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 text-on-surface-variant" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 pt-1 text-sm text-on-surface-variant leading-relaxed text-right">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-5xl mx-auto px-container-margin py-10">
          {/* page header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant">منبع: بازار آزاد ایران (غیررسمی) — شامل نرخ رسمی بانک مرکزی نیست</span>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-on-surface">قیمت دلار و طلا امروز</h1>
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

          {/* FAQ */}
          <section className="mt-12">
            <h2 className="text-lg font-bold text-on-surface mb-6 text-right border-r-4 border-secondary-fixed-dim pr-3">سوالات متداول درباره قیمت ارز و طلا</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-sm font-medium text-on-surface text-right list-none">
                    {item.q}
                    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 text-on-surface-variant" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 pt-1 text-sm text-on-surface-variant leading-relaxed text-right">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
