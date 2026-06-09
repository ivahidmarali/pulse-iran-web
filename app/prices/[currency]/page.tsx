import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { getPrices } from "@/lib/api";
import { PriceItem } from "@/lib/types";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const revalidate = 300;

type CurrencySlug = "dollar" | "euro" | "gold" | "coin";

const CURRENCY_CONFIG: Record<CurrencySlug, {
  title: string;
  titleFa: string;
  description: string;
  keys: string[];
  unit: string;
  faq: { q: string; a: string }[];
}> = {
  dollar: {
    title: "نرخ دلار امروز",
    titleFa: "دلار آمریکا",
    description: "نرخ زنده دلار آمریکا در بازار آزاد ایران امروز — به‌روزرسانی هر ۵ دقیقه",
    keys: ["price_dollar_rl"],
    unit: "تومان",
    faq: [
      { q: "نرخ دلار آمریکا الان چقدر است؟", a: "قیمت لحظه‌ای دلار آمریکا در بالای این صفحه نمایش داده می‌شود و هر ۵ دقیقه یک‌بار به‌روز می‌شود." },
      { q: "قیمت دلار بازار آزاد چه تفاوتی با نرخ رسمی دارد؟", a: "نرخ بازار آزاد (نرخ مبادله‌ای) معمولاً بالاتر از نرخ رسمی بانک مرکزی است. پالس ایران نرخ بازار آزاد را نمایش می‌دهد." },
      { q: "چرا نرخ دلار در ایران تغییر می‌کند؟", a: "نرخ دلار در ایران تحت تأثیر تحریم‌ها، سیاست‌های بانک مرکزی، تقاضای ارز، و اخبار سیاسی و اقتصادی تغییر می‌کند." },
    ],
  },
  euro: {
    title: "نرخ یورو امروز",
    titleFa: "یورو",
    description: "نرخ زنده یورو در بازار آزاد ایران امروز — به‌روزرسانی هر ۵ دقیقه",
    keys: ["price_eur"],
    unit: "تومان",
    faq: [
      { q: "نرخ یورو الان چقدر است؟", a: "قیمت لحظه‌ای یورو در بالای این صفحه نمایش داده می‌شود و هر ۵ دقیقه به‌روز می‌شود." },
      { q: "یورو گران‌تر از دلار است؟", a: "بله، در بازار ایران یورو معمولاً گران‌تر از دلار آمریکاست، زیرا ارزش یورو در برابر دلار در بازارهای جهانی بالاتر است." },
      { q: "آیا نرخ یورو با دلار همزمان تغییر می‌کند؟", a: "معمولاً بله — هر دو تحت تأثیر عوامل مشترکی مثل اخبار تحریم و سیاست بانک مرکزی قرار می‌گیرند، اما نسبت بین آن‌ها نوسان دارد." },
    ],
  },
  gold: {
    title: "قیمت طلا امروز",
    titleFa: "طلا",
    description: "قیمت زنده طلای ۱۸ عیار و مثقال طلا در بازار ایران امروز — به‌روزرسانی هر ۵ دقیقه",
    keys: ["geram18", "mesghal"],
    unit: "تومان",
    faq: [
      { q: "قیمت طلای ۱۸ عیار امروز چقدر است؟", a: "قیمت لحظه‌ای طلای ۱۸ عیار در بالای این صفحه نمایش داده می‌شود و هر ۵ دقیقه به‌روز می‌شود." },
      { q: "تفاوت مثقال و گرم طلا چیست؟", a: "یک مثقال طلا برابر ۴.۶۰۸ گرم است. در ایران هم مثقال و هم گرم برای قیمت‌گذاری طلا استفاده می‌شود." },
      { q: "چرا قیمت طلا در ایران با قیمت جهانی فرق دارد؟", a: "قیمت طلا در ایران تحت تأثیر قیمت جهانی اونس طلا (به دلار) و همچنین نرخ ارز داخلی است. تغییر هر کدام بر قیمت طلا اثر می‌گذارد." },
    ],
  },
  coin: {
    title: "قیمت سکه امروز",
    titleFa: "سکه",
    description: "قیمت زنده سکه تمام بهار آزادی، نیم سکه، و ربع سکه در بازار ایران امروز",
    keys: ["sekeb", "sekke", "nim", "rob"],
    unit: "تومان",
    faq: [
      { q: "قیمت سکه تمام بهار امروز چقدر است؟", a: "قیمت لحظه‌ای سکه تمام بهار آزادی در بالای این صفحه نمایش داده می‌شود و هر ۵ دقیقه به‌روز می‌شود." },
      { q: "سکه بهار آزادی چه وزنی دارد؟", a: "سکه تمام بهار آزادی حاوی ۸.۱۳۳ گرم طلای خالص (۹۰۰ عیار) است." },
      { q: "نیم سکه و ربع سکه چه تفاوتی با سکه تمام دارند؟", a: "نیم سکه نصف و ربع سکه یک‌چهارم سکه تمام از نظر وزن طلاست. قیمت آن‌ها معمولاً با احتساب حق ضرب کمی متفاوت است." },
    ],
  },
};

const PRICE_META: Record<string, { name: string; symbol: string }> = {
  price_dollar_rl: { name: "دلار آمریکا", symbol: "$" },
  price_eur:       { name: "یورو",        symbol: "€" },
  geram18:         { name: "طلای ۱۸ عیار (گرم)", symbol: "Au" },
  mesghal:         { name: "مثقال طلا",   symbol: "Au" },
  sekeb:           { name: "سکه تمام بهار آزادی", symbol: "⬡" },
  sekke:           { name: "سکه تمام بهار",       symbol: "⬡" },
  nim:             { name: "نیم سکه",     symbol: "½⬡" },
  rob:             { name: "ربع سکه",     symbol: "¼⬡" },
};

function isCurrencySlug(s: string): s is CurrencySlug {
  return s in CURRENCY_CONFIG;
}

export function generateStaticParams() {
  return (Object.keys(CURRENCY_CONFIG) as CurrencySlug[]).map((s) => ({ currency: s }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ currency: string }>;
}): Promise<Metadata> {
  const { currency } = await params;
  if (!isCurrencySlug(currency)) return { title: "صفحه یافت نشد" };
  const cfg = CURRENCY_CONFIG[currency];
  const canonical = `${SITE_URL}/prices/${currency}`;
  const today = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date());
  return {
    title: `${cfg.title} — ${today} | پالس ایران`,
    description: cfg.description,
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    openGraph: {
      title: `${cfg.title} | پالس ایران`,
      description: cfg.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function CurrencyPage({
  params,
}: {
  params: Promise<{ currency: string }>;
}) {
  const { currency } = await params;
  if (!isCurrencySlug(currency)) notFound();

  const cfg = CURRENCY_CONFIG[currency];
  const canonical = `${SITE_URL}/prices/${currency}`;

  let allPrices: PriceItem[] = [];
  try {
    allPrices = await getPrices();
  } catch {
    // render with empty data
  }

  const items = allPrices.filter((p) => cfg.keys.includes(p.key));
  const today = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    name: cfg.title,
    description: cfg.description,
    url: canonical,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: items.length > 0 ? {
      "@type": "ItemList",
      name: cfg.title,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: PRICE_META[item.key]?.name ?? item.key,
          offers: {
            "@type": "Offer",
            priceCurrency: "IRR",
            price: item.price * 10,
            priceValidUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            availability: "https://schema.org/InStock",
          },
        },
      })),
    } : undefined,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL } },
      { "@type": "ListItem", position: 2, name: "قیمت‌ها", item: { "@id": `${SITE_URL}/prices` } },
      { "@type": "ListItem", position: 3, name: cfg.title },
    ],
  };

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <main className="max-w-2xl mx-auto px-container-margin py-8 md:py-12" dir="rtl">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
          <span>/</span>
          <Link href="/prices" className="hover:text-secondary-fixed-dim">قیمت‌ها</Link>
          <span>/</span>
          <span className="text-on-surface">{cfg.titleFa}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black text-on-surface mb-1">{cfg.title}</h1>
        <p className="text-sm text-on-surface-variant mb-8">{today} — بازار آزاد ایران</p>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-surface-container p-8 text-center text-on-surface-variant text-sm">
            داده‌ای در دسترس نیست — لطفاً دقایقی دیگر مراجعه کنید
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-10">
            {items.map((item) => {
              const meta = PRICE_META[item.key] ?? { name: item.key, symbol: "?" };
              const up = item.trend === "up";
              const down = item.trend === "down";
              return (
                <div
                  key={item.key}
                  className={`rounded-2xl bg-surface-container border p-6 ${up ? "border-emerald-500/20" : down ? "border-red-500/20" : "border-white/5"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim font-black">
                      {meta.symbol}
                    </div>
                    <span className="text-sm text-on-surface-variant">{meta.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-on-surface tabular-nums">
                      {item.price.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-sm text-on-surface-variant mr-2">{cfg.unit}</span>
                  </div>
                  {(item.change_pct ?? 0) !== 0 && (
                    <div className={`mt-2 text-sm font-bold tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
                      {up ? "▲" : "▼"} {Math.abs(item.change_pct ?? 0).toFixed(1)}٪ نسبت به دیروز
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl bg-surface-container border border-white/5 p-5 mb-10">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            قیمت‌ها از بازار آزاد ایران جمع‌آوری می‌شوند و هر ۵ دقیقه به‌روز می‌شوند.
            این قیمت‌ها جنبه اطلاع‌رسانی دارند و مشاوره مالی نیستند.{" "}
            <Link href="/prices" className="text-secondary-fixed-dim hover:underline">
              مشاهده همه قیمت‌ها ←
            </Link>
          </p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-on-surface mb-4">سوالات متداول</h2>
          <div className="flex flex-col gap-3">
            {cfg.faq.map((f) => (
              <div key={f.q} className="rounded-xl bg-surface-container p-4">
                <p className="font-bold text-on-surface text-sm mb-1">{f.q}</p>
                <p className="text-sm text-on-surface-variant">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="hidden md:block"><Footer /></div>
      <MobileFooter />
    </div>
  );
}
