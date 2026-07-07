// Single source of truth for "is this article worth asking Google to index?"
// Used by the article page (robots noindex), sitemap.ts, and news-sitemap.xml
// so the three never contradict each other: a URL is either indexable AND in
// the sitemaps, or noindexed AND absent from both.
//
// Context: the domain is young with little authority, and the bot publishes
// hundreds of short aggregated items per day. Submitting all of them trains
// Google to skip the whole site. We only submit the newsworthy subset —
// items with a real AI summary AND high importance — and noindex the rest
// (follow is kept so link equity still flows).

// Keywords that indicate spam/ad content — never index or list in sitemaps
const SPAM_PATTERNS = [
  /رایگان.{0,10}گیگ/,
  /شرط.بندی/,
  /کازینو/,
  /بت\.ایران/,
  /آدرس جدید/,
  /ثبت.نام.{0,10}بونوس/,
  /هزار تومن.{0,20}تست/,
];

export function isSpamTitle(title: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(title));
}

// Strip Markdown link syntax [text](url) → text and emoji characters
export function cleanTitle(title: string): string {
  return title
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Supplementary emoji (surrogate pairs: U+1F000–U+1FAFF, U+2600–U+27BF)
    .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, "")
    // BMP emoji ranges (misc symbols, dingbats, enclosed)
    .replace(/[☀-➿⬀-⯿　-〿]/g, "")
    // Variation selectors and combining enclosing keycap
    .replace(/[︀-️⃣]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const MIN_SUMMARY_WORDS = 20;

export interface ArticleQualitySignals {
  title: string;
  summary?: string;
  importance?: string;
}

export function isSubstantialArticle(item: ArticleQualitySignals): boolean {
  if (isSpamTitle(item.title)) return false;
  const summary = (item.summary ?? "").trim();
  if (!summary || summary === item.title.trim()) return false;
  if (summary.split(/\s+/).length < MIN_SUMMARY_WORDS) return false;
  return item.importance === "high";
}
