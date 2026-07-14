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
      "🇷🇺🇺🇦 روسیه و اوکراین",
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
  "تکنولوژی":  {
    emoji: "💻",
    categories: [
      "💻 تکنولوژی",
      "📱 موبایل و گجت",
      "🤖 هوش مصنوعی",
    ],
  },
  "حاشیه":     {
    emoji: "👀",
    categories: [
      "👀 حاشیه و جنجال",
      "🎭 فرهنگ و هنر",
      "📰 خبر",
      "🚨 خبر فوری",
    ],
  },
};

/** Group name → clean /tag/ page slug. Used so canonicals and breadcrumbs
 * point at the permanent tag pages instead of ?group= parameterized URLs. */
export const GROUP_TAG_SLUGS: Record<string, string> = {
  "سیاسی": "siasi",
  "بین‌الملل": "beinolmelal",
  "اقتصادی": "eqtesadi",
  "اجتماعی": "ejtemai",
  "ورزشی": "varzeshi",
  "تکنولوژی": "technology",
  "حاشیه": "hashiye",
};

/** Extract the emoji prefix (everything before the first space) for LIKE matching.
 * Handles both "💻 تکنولوژی" (old) and "💻تکنولوژی" (new compact) — both become "💻".
 */
function emojiPrefix(cat: string): string {
  const spaceIdx = cat.indexOf(" ");
  return spaceIdx > 0 ? cat.slice(0, spaceIdx) : cat;
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
