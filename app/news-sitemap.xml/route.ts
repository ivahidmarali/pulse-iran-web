import { articleUrl, SITE_URL } from "@/lib/utils";

export const revalidate = 300; // regenerate every 5 minutes

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const MAX_PER_PAGE = 100; // API hard limit (le=100)
const INDEXNOW_KEY = "palsiran2026indexnow";

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
  let items: Item[] = [];
  try {
    const res = await fetch(`${INTERNAL_API}/news?page=1&per_page=${MAX_PER_PAGE}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const cutoff = Date.now() - THREE_DAYS_MS;
      items = (data.items ?? []).filter(
        (i: Item) =>
          i.title &&
          new Date(i.posted_at).getTime() > cutoff &&
          !isSpam(i.title) &&
          !EXCLUDED_SOURCES.has(i.source ?? "")
      );
    }
  } catch {
    // return empty sitemap on error rather than 500
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

  // Ping IndexNow with new article URLs (fire-and-forget, don't block response)
  if (articleUrls.length > 0) {
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "palsiran.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: articleUrls.slice(0, 10000),
      }),
    }).catch(() => { /* ignore indexnow errors */ });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
