import { articleUrl, SITE_URL } from "@/lib/utils";

export const revalidate = 300; // regenerate every 5 minutes

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const MAX_PER_PAGE = 100; // API hard limit (le=100)
const MAX_NEWS_ARTICLES = 1000; // Google News sitemap cap
const MAX_PAGES = Math.ceil(MAX_NEWS_ARTICLES / MAX_PER_PAGE);
const INDEXNOW_KEY = "palsiran2026indexnow";

// Module-level: persists across ISR regenerations within the same process.
// Ensures we only submit articles published after the previous ping.
let lastIndexNowPingTs = 0;

// Keywords that indicate spam/ad content — exclude from news sitemap
const SPAM_PATTERNS = [
  /رایگان.{0,10}گیگ/,
  /شرط.بندی/,
  /کازینو/,
  /بت\.ایران/,
  /آدرس جدید/,
  /ثبت.نام.{0,10}بونوس/,
  /هزار تومن.{0,20}تست/,
];

function isSpam(title: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(title));
}

// Strip Markdown link syntax [text](url) → text and emoji characters
function cleanTitle(title: string): string {
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

interface Item {
  item_id: string;
  title: string;
  posted_at: string;
  source?: string;
}

const EXCLUDED_SOURCES = new Set(["chekhabarre"]);

export async function GET() {
  const items: Item[] = [];
  const cutoff = Date.now() - TWO_DAYS_MS;
  try {
    // Paginate until we hit MAX_NEWS_ARTICLES, run out of items, or cross the
    // 2-day cutoff (API returns newest first, so an old item ends the scan).
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(
        `${INTERNAL_API}/news?page=${page}&per_page=${MAX_PER_PAGE}`,
        { cache: "no-store" }
      );
      if (!res.ok) break;
      const data = await res.json();
      const batch: Item[] = data.items ?? [];
      if (batch.length === 0) break;

      let oldestSeenAcrossCutoff = false;
      for (const i of batch) {
        const ts = new Date(i.posted_at).getTime();
        if (ts <= cutoff) {
          oldestSeenAcrossCutoff = true;
          continue;
        }
        if (!i.title) continue;
        if (isSpam(i.title)) continue;
        if (EXCLUDED_SOURCES.has(i.source ?? "")) continue;
        items.push(i);
        if (items.length >= MAX_NEWS_ARTICLES) break;
      }
      if (items.length >= MAX_NEWS_ARTICLES) break;
      if (oldestSeenAcrossCutoff) break;
      if (!data.has_more || batch.length < MAX_PER_PAGE) break;
    }
  } catch {
    // return whatever we have on error rather than 500
  }

  // Deduplicate by item_id, then by normalized title (keep first occurrence)
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const unique = items.filter((i) => {
    if (seenIds.has(i.item_id)) return false;
    seenIds.add(i.item_id);
    const normalizedTitle = cleanTitle(i.title).slice(0, 40);
    if (seenTitles.has(normalizedTitle)) return false;
    seenTitles.add(normalizedTitle);
    return true;
  });

  const articleUrls = unique.map((item) => articleUrl(item.item_id, item.title));

  const urls = unique
    .map(
      (item, i) => {
        const cleanedTitle = cleanTitle(item.title).replace(/]]>/g, "]]]]><![CDATA[>");
        return `
  <url>
    <loc>${articleUrls[i]}</loc>
    <news:news>
      <news:publication>
        <news:name>پالس ایران</news:name>
        <news:language>fa</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.posted_at).toISOString()}</news:publication_date>
      <news:title><![CDATA[${cleanedTitle}]]></news:title>
    </news:news>
  </url>`;
      }
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  // Ping IndexNow only with articles published since the last ping (fire-and-forget).
  const newSinceLastPing = unique.filter(
    (item) => new Date(item.posted_at).getTime() > lastIndexNowPingTs
  );
  const newUrls = newSinceLastPing.map((item) => articleUrl(item.item_id, item.title));
  if (newUrls.length > 0) {
    const pingTs = Date.now();
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "palsiran.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: newUrls.slice(0, 10000),
      }),
    })
      .then(() => { lastIndexNowPingTs = pingTs; })
      .catch(() => { /* ignore indexnow errors */ });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
