import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import { getPrices } from "@/lib/api";
import { PriceItem } from "@/lib/types";

async function fetchPrices(): Promise<PriceItem[]> {
  try {
    return await getPrices();
  } catch {
    return [];
  }
}

const PRICE_LABELS: Record<string, { name: string; category: string }> = {
  price_dollar_rl: { name: "💵 دلار آمریکا",              category: "ارزها" },
  price_eur:       { name: "💶 یورو",                     category: "ارزها" },
  price_aed:       { name: "🇦🇪 درهم امارات",             category: "ارزها" },
  price_gbp:       { name: "💷 پوند انگلیس",              category: "ارزها" },
  price_try:       { name: "🇹🇷 لیر ترکیه",              category: "ارزها" },
  geram18:         { name: "⚖️ طلای ۱۸ عیار (گرم)",      category: "طلا و سکه" },
  mesghal:         { name: "⚖️ مثقال طلا",               category: "طلا و سکه" },
  sekeb:           { name: "🪙 سکه تمام بهار آزادی",      category: "طلا و سکه" },
  sekke:           { name: "🪙 سکه تمام بهار آزادی",      category: "طلا و سکه" },
  nim:             { name: "🪙 نیم سکه",                  category: "طلا و سکه" },
  rob:             { name: "🪙 ربع سکه",                  category: "طلا و سکه" },
};

const CURRENCY_KEYS = ["price_dollar_rl", "price_eur", "price_aed", "price_gbp", "price_try"];
const GOLD_KEYS     = ["sekeb", "sekke", "nim", "rob", "mesghal", "geram18"];

function PriceCard({ item }: { item: PriceItem }) {
  const info = PRICE_LABELS[item.key] ?? { name: item.key, category: "" };
  const trend = item.trend ?? "flat";
  const changePct = item.change_pct ?? 0;
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
      <p className="text-secondary-fixed-dim font-medium text-right">{info.name}</p>
      <p className="text-[28px] font-black text-on-surface text-right">
        {item.price.toLocaleString("fa-IR")}
        <span className="text-label-sm text-on-surface-variant font-normal mr-1">تومان</span>
      </p>
      {changePct !== 0 && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
          <span>{trend === "up" ? "🔺" : "🔻"}</span>
          <span>{Math.abs(changePct).toFixed(1)}٪ {trend === "up" ? "افزایش" : "کاهش"}</span>
        </div>
      )}
    </div>
  );
}

function PriceRow({ item }: { item: PriceItem }) {
  const info = PRICE_LABELS[item.key] ?? { name: item.key, category: "" };
  const trend = item.trend ?? "flat";
  const changePct = item.change_pct ?? 0;
  return (
    <div className="flex flex-row-reverse justify-between items-center p-4 border-b border-white/5">
      <p className="text-secondary-fixed-dim font-medium text-right">{info.name}</p>
      <div className="text-left">
        <p className="text-on-surface font-bold">{item.price.toLocaleString("fa-IR")} تومان</p>
        {changePct !== 0 && (
          <p className={`text-xs mt-0.5 ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-on-surface-variant"}`}>
            {trend === "up" ? "🔺" : trend === "down" ? "🔻" : "◼"} {Math.abs(changePct).toFixed(1)}٪
          </p>
        )}
      </div>
    </div>
  );
}

export default async function PricesPage() {
  const prices = await fetchPrices();
  const priceMap = Object.fromEntries(prices.map((p) => [p.key, p]));
  const currencies = CURRENCY_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];
  const gold = GOLD_KEYS.map((k) => priceMap[k]).filter(Boolean) as PriceItem[];
  const others = prices.filter((p) => !CURRENCY_KEYS.includes(p.key) && !GOLD_KEYS.includes(p.key));

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24 px-container-margin py-section-gap">
          <div className="flex flex-row-reverse items-center gap-2 mb-section-gap">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
            <h1 className="text-title-md font-title-md text-secondary-fixed-dim">قیمت‌های زنده</h1>
          </div>

          {/* Currency section */}
          <section className="mb-section-gap">
            <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4 text-right">💱 ارزها</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              {currencies.map((p) => <PriceRow key={p.key} item={p} />)}
              {currencies.length === 0 && <p className="p-4 text-on-surface-variant text-sm">داده‌ای موجود نیست</p>}
            </div>
          </section>

          {/* Gold section */}
          <section className="mb-section-gap">
            <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4 text-right">🪙 طلا و سکه</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              {gold.map((p) => <PriceRow key={p.key} item={p} />)}
              {gold.length === 0 && <p className="p-4 text-on-surface-variant text-sm">داده‌ای موجود نیست</p>}
            </div>
          </section>

          {others.length > 0 && (
            <section>
              <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4 text-right">سایر</h2>
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                {others.map((p) => <PriceRow key={p.key} item={p} />)}
              </div>
            </section>
          )}
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-7xl mx-auto px-container-margin py-section-gap">
          <div className="flex flex-row-reverse items-center gap-3 mb-section-gap">
            <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim animate-pulse" />
            <h1 className="text-headline-lg font-headline-lg text-on-surface">قیمت‌های لحظه‌ای</h1>
          </div>
          <div className="grid grid-cols-12 gap-gutter">
            <section className="col-span-8 space-y-section-gap">
              <div>
                <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4 text-right">💱 ارزها</h2>
                <div className="grid grid-cols-2 gap-4">
                  {currencies.map((p) => <PriceCard key={p.key} item={p} />)}
                  {currencies.length === 0 && <p className="col-span-2 text-on-surface-variant">داده‌ای موجود نیست</p>}
                </div>
              </div>
              <div>
                <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4 text-right">🪙 طلا و سکه</h2>
                <div className="grid grid-cols-3 gap-4">
                  {gold.map((p) => <PriceCard key={p.key} item={p} />)}
                  {gold.length === 0 && <p className="col-span-3 text-on-surface-variant">داده‌ای موجود نیست</p>}
                </div>
              </div>
            </section>
            <aside className="col-span-4">
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <h3 className="text-title-md font-title-md text-secondary-fixed-dim p-4 border-b border-white/5 text-right">همه قیمت‌ها</h3>
                {prices.map((p) => <PriceRow key={p.key} item={p} />)}
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
