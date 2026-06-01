import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/lib/types";
import { articleHref } from "@/lib/utils";

const LEAN_BADGE: Record<string, string> = {
  "اصولگرا": "text-green-400 bg-green-500/15 border-green-500/20",
  "اصلاح‌طلب": "text-blue-400 bg-blue-500/15 border-blue-500/20",
  "لیبرال غربی": "text-red-400 bg-red-500/15 border-red-500/20",
  "مستقل": "text-gray-400 bg-gray-500/15 border-gray-500/20",
  "رسمی دولتی": "text-yellow-400 bg-yellow-500/15 border-yellow-500/20",
  "مخالف جمهوری اسلامی": "text-orange-400 bg-orange-500/15 border-orange-500/20",
};

interface Props {
  item: NewsItem;
  variant?: "default" | "horizontal" | "compact" | "hero";
  priority?: boolean;
}

function toPersianNum(n: number): string {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
}

function timeAgo(dateStr: string): string {
  // Ensure UTC parsing — append Z if no timezone info present
  const normalized = /[Zz]|[+-]\d{2}:\d{2}$/.test(dateStr) ? dateStr : dateStr + 'Z';
  const diffMs = Date.now() - new Date(normalized).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${toPersianNum(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${toPersianNum(diffHours)} ساعت پیش`;
  if (diffDays === 1) return 'دیروز';
  return `${toPersianNum(diffDays)} روز پیش`;
}

// Category emoji prefix — return the first "word" (emoji) before the first space
function catEmoji(category?: string): string {
  if (!category) return "";
  const spaceIdx = category.indexOf(" ");
  return spaceIdx > 0 ? category.slice(0, spaceIdx) : category;
}

// Verification badge text + color
function verificationBadge(status?: string, count?: number): { text: string; cls: string } | null {
  if (!status || status === "unverified" || !count || count < 2) return null;
  if (status === "verified") return { text: `${toPersianNum(count)} منبع`, cls: "text-green-400 bg-green-500/15" };
  if (status === "reviewing") return { text: `${toPersianNum(count)} منبع`, cls: "text-yellow-400 bg-yellow-500/15" };
  return null;
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

export default function NewsCard({ item, variant = "default", priority = false }: Props) {
  const href = articleHref(item.item_id, item.title);
  const ago = timeAgo(item.posted_at);
  const emoji = catEmoji(item.category);
  const border = categoryBorder(item.category);
  const vBadge = verificationBadge(item.verification_status, item.source_count);

  if (variant === "hero") {
    return (
      <Link href={href} className="block relative group overflow-hidden rounded-xl bg-surface-container-high aspect-[16/9] pulse-glow">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-background flex items-center justify-center">
            <span className="text-7xl opacity-20">{catEmoji(item.category)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
        {item.video_url && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current"><path d="M8 5v14l11-7z"/></svg>
            <span className="text-[10px] text-white font-bold">ویدئو</span>
          </div>
        )}
        <div className="absolute bottom-0 p-6 z-20 space-y-3">
          {item.is_breaking && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">🚨 فوری</span>
          )}
          {!item.is_breaking && item.importance === "high" && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">مهم</span>
          )}
          {emoji && !item.is_breaking && item.importance !== "high" && (
            <span className="bg-surface-container/80 px-3 py-1 rounded-full text-xs font-bold">{item.category}</span>
          )}
          <h1 className="font-bold text-[20px] leading-snug text-on-surface line-clamp-3">{item.title}</h1>
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm flex-wrap">
            <span className="font-medium">{item.source}</span>
            {item.political_lean && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${LEAN_BADGE[item.political_lean] ?? "text-outline/70 bg-transparent border-white/10"}`}>
                {item.political_lean}
              </span>
            )}
            <span>•</span>
            <span>{ago}</span>
            {vBadge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${vBadge.cls}`}>
                {vBadge.text}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={`flex gap-4 p-4 bg-surface-container-low rounded-lg items-start border-r-[3px] ${border} border-t border-b border-l border-white/5 hover:bg-surface-variant/30 transition-colors min-h-[88px]`}
      >
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            {item.is_breaking && (
              <span className="text-[10px] text-red-400 font-bold">🚨 فوری</span>
            )}
            {!item.is_breaking && item.importance === "high" && (
              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">مهم</span>
            )}
            {item.video_url && (
              <span className="text-[10px] text-secondary-fixed-dim/80 font-bold flex items-center gap-0.5">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current inline"><path d="M8 5v14l11-7z"/></svg>ویدئو
              </span>
            )}
            {emoji && !item.is_breaking && item.importance !== "high" && (
              <span className="text-[11px] text-secondary-fixed-dim/70 font-medium">{emoji}</span>
            )}
          </div>
          <h4 className="font-bold text-[18px] leading-snug line-clamp-2">{item.title}</h4>
          {item.summary && (
            <p className="text-[12px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">{item.summary}</p>
          )}
          <div className="flex items-center gap-2 text-on-surface-variant text-[12px] flex-wrap">
            <span className="font-medium text-on-surface-variant/90">منبع: {item.source}</span>
            {item.political_lean && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${LEAN_BADGE[item.political_lean] ?? "text-outline/70 bg-transparent border-white/10"}`}>
                {item.political_lean}
              </span>
            )}
            <span>·</span>
            <span>{ago}</span>
            {vBadge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${vBadge.cls}`}>
                {vBadge.text}
              </span>
            )}
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
          <div className="flex items-center gap-2 text-outline text-[11px] mt-1 flex-wrap">
            <span>{item.source}</span>
            {item.political_lean && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${LEAN_BADGE[item.political_lean] ?? "text-outline/70 bg-transparent border-white/10"}`}>
                {item.political_lean}
              </span>
            )}
            <span>·</span>
            <span>{ago}</span>
            {vBadge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${vBadge.cls}`}>
                {vBadge.text}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // default card
  return (
    <Link
      href={href}
      className={`bg-surface-container-low rounded-lg overflow-hidden flex flex-col border-t-2 ${border} border-x border-b border-white/5 hover:border-secondary-fixed-dim/30 transition-all group min-h-[120px]`}
    >
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center text-xs text-on-surface-variant">
          <span>{ago}</span>
          {item.category && (
            <span className="text-secondary-fixed-dim/70 text-[11px] font-medium">{emoji}</span>
          )}
        </div>
        <h3 className="font-bold text-[17px] text-on-surface leading-snug line-clamp-3 group-hover:text-secondary-fixed-dim transition-colors">{item.title}</h3>
        {item.summary && (
          <p className="text-[12px] text-on-surface-variant/80 line-clamp-2 leading-relaxed">{item.summary}</p>
        )}
        <div className="flex items-center gap-2 text-[11px] text-outline flex-wrap">
          <span className="font-medium text-on-surface-variant/80">منبع: {item.source}</span>
          {item.political_lean && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${LEAN_BADGE[item.political_lean] ?? "text-outline/70 bg-transparent border-white/10"}`}>
              {item.political_lean}
            </span>
          )}
          {vBadge && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${vBadge.cls}`}>
              {vBadge.text}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
