import { PriceItem } from "@/lib/types";

const LABELS: Record<string, string> = {
  // tgju keys
  price_dollar_rl: "دلار آمریکا",
  price_eur: "یورو",
  price_aed: "درهم امارات",
  price_gbp: "پوند انگلیس",
  price_try: "لیر ترکیه",
  sekeb: "سکه تمام بهار",
  nim: "نیم سکه",
  rob: "ربع سکه",
  mesghal: "مثقال طلا",
  geram18: "طلای ۱۸ عیار",
  // legacy keys
  usd: "دلار آمریکا",
  eur: "یورو",
  aed: "درهم امارات",
  gold_18: "طلای ۱۸ عیار",
  gold_coin: "سکه تمام بهار",
  usdt: "تتر",
};

const TREND_ICON: Record<string, string> = {
  up: "🔺",
  down: "🔻",
  flat: "◼",
};

export default function CurrencyRow({ item }: { item: PriceItem }) {
  const label = LABELS[item.key] ?? item.key;
  const price = item.price.toLocaleString("fa-IR");
  const trend = item.trend ?? "flat";
  const changePct = item.change_pct ?? 0;

  return (
    <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="text-left">
        <div className="text-sm font-bold">{price}</div>
        <div
          className={`text-[10px] flex items-center gap-1 justify-end ${
            trend === "up"
              ? "text-green-400"
              : trend === "down"
              ? "text-red-400"
              : "text-on-surface-variant"
          }`}
        >
          <span>{TREND_ICON[trend] ?? "◼"}</span>
          {changePct !== 0 && (
            <span>
              {changePct > 0 ? "+" : ""}
              {changePct.toFixed(1)}٪
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
