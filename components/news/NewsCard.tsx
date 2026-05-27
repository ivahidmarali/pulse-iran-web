import Link from "next/link";
import { NewsItem } from "@/lib/types";

interface Props {
  item: NewsItem;
  variant?: "default" | "horizontal" | "compact" | "hero";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  const days = Math.floor(hrs / 24);
  return `${days} روز پیش`;
}

// Category emoji prefix — return the first "word" (emoji) before the first space
function catEmoji(category?: string): string {
  if (!category) return "";
  const spaceIdx = category.indexOf(" ");
  return spaceIdx > 0 ? category.slice(0, spaceIdx) : category;
}

// Border color per category (covers all 28 DB categories)
function categoryBorder(category?: string): string {
  if (!category) return "border-white/5";
  // Breaking
  if (category.includes("خبر فوری")) return "border-red-500";
  // Political
  if (category.includes("سیاست داخلی")) return "border-blue-500";
  if (category.includes("ایران و آمریکا")) return "border-cyan-400";
  if (category.includes("ترامپ")) return "border-yellow-400";
  if (category.includes("خامنه‌ای")) return "border-amber-500";
  if (category.includes("پزشکیان")) return "border-teal-400";
  if (category.includes("قالیباف")) return "border-slate-400";
  if (category.includes("اصلاح‌طلب")) return "border-blue-400";
  if (category.includes("اصولگرا")) return "border-green-500";
  // International
  if (category.includes("جنگ و بحران") || category.includes("خبر جنگ")) return "border-orange-500";
  if (category.includes("اسرائیل") || category.includes("غزه") || category.includes("خاورمیانه")) return "border-orange-400";
  if (category.includes("روسیه") || category.includes("اوکراین")) return "border-gray-400";
  if (category.includes("عربستان")) return "border-green-400";
  if (category.includes("ترکیه")) return "border-red-400";
  if (category.includes("چین")) return "border-red-600";
  // Economic
  if (category.includes("دلار") || category.includes("ارز")) return "border-green-500";
  if (category.includes("تحریم")) return "border-red-400";
  if (category.includes("بورس")) return "border-emerald-400";
  if (category.includes("مسکن")) return "border-amber-400";
  if (category.includes("نفت") || category.includes("انرژی")) return "border-yellow-600";
  if (category.includes("اقتصاد")) return "border-green-500";
  // Social
  if (category.includes("اینترنت") || category.includes("فضای مجازی") || category.includes("فیلتر")) return "border-violet-400";
  if (category.includes("اعتراض")) return "border-purple-500";
  if (category.includes("حوادث") || category.includes("زلزله")) return "border-red-400";
  if (category.includes("هسته‌ای")) return "border-yellow-300";
  // Sports
  if (category.includes("فوتبال")) return "border-emerald-500";
  if (category.includes("جام جهانی")) return "border-yellow-500";
  if (category.includes("ورزش جهانی")) return "border-sky-400";
  // Misc
  if (category.includes("حاشیه") || category.includes("جنجال")) return "border-pink-400";
  if (category.includes("فرهنگ") || category.includes("هنر")) return "border-indigo-400";
  return "border-white/5";
}

export default function NewsCard({ item, variant = "default" }: Props) {
  const href = `/article/${encodeURIComponent(item.item_id)}`;
  const ago = timeAgo(item.posted_at);
  const emoji = catEmoji(item.category);
  const border = categoryBorder(item.category);

  if (variant === "hero") {
    return (
      <Link href={href} className="block relative group overflow-hidden rounded-xl bg-surface-container-high aspect-[16/9] pulse-glow">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
        <div className="absolute bottom-0 p-6 z-20 space-y-3">
          {item.is_breaking && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">🚨 فوری</span>
          )}
          {emoji && !item.is_breaking && (
            <span className="bg-surface-container/80 px-3 py-1 rounded-full text-xs font-bold">{item.category}</span>
          )}
          <h1 className="font-bold text-[20px] leading-snug text-on-surface line-clamp-3">{item.title}</h1>
          <div className="flex items-center gap-3 text-on-surface-variant text-label-sm">
            <span>{item.source}</span>
            {item.political_lean && <span className="text-outline/70 text-[10px]">{item.political_lean}</span>}
            <span>•</span>
            <span>{ago}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={`flex gap-4 p-4 bg-surface-container-low rounded-lg items-start border-r-[3px] ${border} border-t border-b border-l border-white/5 hover:bg-surface-variant/30 transition-colors`}
      >
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            {item.is_breaking && (
              <span className="text-[10px] text-red-400 font-bold">🚨 فوری</span>
            )}
            {emoji && !item.is_breaking && (
              <span className="text-[11px] text-secondary-fixed-dim/70 font-medium">{emoji}</span>
            )}
          </div>
          <h4 className="font-bold text-[18px] leading-snug line-clamp-2">{item.title}</h4>
          <div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
            <span>{item.source}</span>
            {item.political_lean && (
              <>
                <span>·</span>
                <span className="text-outline/60">{item.political_lean}</span>
              </>
            )}
            <span>·</span>
            <span>{ago}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className={`flex gap-3 group cursor-pointer py-2 border-r-2 ${border} pr-2`}>
        <div className="flex-1">
          {emoji && <span className="text-[11px] text-outline mr-1">{emoji}</span>}
          <p className="text-[16px] font-semibold leading-relaxed group-hover:text-secondary-fixed-dim transition-colors line-clamp-2">{item.title}</p>
          <div className="flex items-center gap-2 text-outline text-[11px] mt-1">
            <span>{item.source}</span>
            {item.political_lean && (
              <>
                <span>·</span>
                <span>{item.political_lean}</span>
              </>
            )}
            <span>·</span>
            <span>{ago}</span>
          </div>
        </div>
      </Link>
    );
  }

  // default card
  return (
    <Link
      href={href}
      className={`bg-surface-container-low rounded-lg overflow-hidden flex flex-col border-t-2 ${border} border-x border-b border-white/5 hover:border-secondary-fixed-dim/30 transition-all group`}
    >
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center text-xs text-on-surface-variant">
          <span>{ago}</span>
          {item.category && (
            <span className="text-secondary-fixed-dim/70 text-[11px] font-medium">{emoji}</span>
          )}
        </div>
        <h3 className="font-bold text-[17px] text-on-surface leading-snug line-clamp-3 group-hover:text-secondary-fixed-dim transition-colors">{item.title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-outline">
          <span>{item.source}</span>
          {item.political_lean && (
            <>
              <span>·</span>
              <span className="text-outline/60">{item.political_lean}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
