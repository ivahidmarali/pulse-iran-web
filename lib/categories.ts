export type CategoryGroup = {
  emoji: string;
  categories: string[]; // exact DB strings
};

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  "همه":       { emoji: "", categories: [] },
  "سیاسی":     {
    emoji: "🏛",
    categories: [
      "🏛 سیاست داخلی",
      "🎙 ترامپ",
      "🇮🇷🇺🇸 ایران و آمریکا",
      "🔵 اصلاح‌طلبان",
      "🔴 اصولگرایان",
    ],
  },
  "بین‌الملل": {
    emoji: "🌍",
    categories: [
      "⚔️ جنگ و بحران",
      "💥 اسرائیل و غزه",
      "🪖 روسیه و اوکراین",
      "🇸🇦 عربستان",
      "🇹🇷 ترکیه",
      "🇨🇳 چین",
    ],
  },
  "اقتصادی":   {
    emoji: "💰",
    categories: [
      "💵 دلار و ارز",
      "🚫 تحریم",
      "📈 بورس",
      "🏠 مسکن",
      "🛢 نفت و انرژی",
    ],
  },
  "اجتماعی":   {
    emoji: "👥",
    categories: [
      "🌐 اینترنت و فضای مجازی",
      "✊ اعتراضات",
      "🚨 حوادث",
      "☢️ هسته‌ای",
    ],
  },
  "ورزشی":     {
    emoji: "⚽️",
    categories: [
      "⚽️ فوتبال ایران",
      "🏆 جام جهانی",
      "🥇 ورزش جهانی",
    ],
  },
  "حاشیه":     {
    emoji: "👀",
    categories: [
      "👀 حاشیه و جنجال",
      "🎭 فرهنگ و هنر",
    ],
  },
};

/** Return the full category string for exact LIKE prefix matching. */
function emojiPrefix(cat: string): string {
  return cat;
}

/**
 * Returns emoji prefixes to pass to getNews() for LIKE-based category matching.
 * e.g. "🌐 اینترنت" → ["🌐"] → API uses WHERE category LIKE '🌐%'
 */
export function getCategoryFilter(cat?: string, group?: string): string[] {
  if (cat) return [emojiPrefix(cat)];
  if (group && group !== "همه") {
    return (CATEGORY_GROUPS[group]?.categories ?? []).map(emojiPrefix);
  }
  return [];
}

/** Returns which group name is active given current URL params. */
export function getActiveGroup(cat?: string, group?: string): string {
  if (!cat && !group) return "همه";
  if (group) return group;
  if (cat) {
    for (const [groupName, g] of Object.entries(CATEGORY_GROUPS)) {
      if (g.categories.includes(cat)) return groupName;
    }
  }
  return "همه";
}
