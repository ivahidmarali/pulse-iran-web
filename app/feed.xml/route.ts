import { getNews } from "@/lib/api";
import { articleUrl, articleId, SITE_URL } from "@/lib/utils";

const CONTENT_NS = 'xmlns:content="http://purl.org/rss/1.0/modules/content/"';
const DC_NS = 'xmlns:dc="http://purl.org/dc/elements/1.1/"';

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  // 100 items ≈ several hours of coverage — 30 items spanned under an hour at
  // peak publish rate, so aggregators polling hourly missed most articles
  const data = await getNews(1, 100);
  const items = data.items ?? [];

  const rssItems = items
    .map((item) => {
      const link = articleUrl(articleId(item), item.title);
      const pubDate = new Date(item.posted_at).toUTCString();
      const description = item.summary && item.summary.length > 30
        ? escapeXml(item.summary)
        : escapeXml(item.title);
      const fullBody =
        item.web_summary && item.web_summary.length > (item.summary?.length ?? 0)
          ? item.web_summary
          : item.summary && item.summary.length > 30
            ? item.summary
            : item.title;
      // Use summary's first sentence as title when the raw title is a long Telegram message body
      const rssTitle = (() => {
        if (item.title.length <= 100) return item.title;
        if (item.summary && item.summary.length > 20) {
          const m = item.summary.match(/^.{20,90}[.!؟\n]/);
          if (m) return m[0].trim().replace(/[.!؟]$/, "");
          return item.summary.slice(0, 80).trim() + "…";
        }
        const cut = item.title.lastIndexOf(" ", 80);
        return (cut > 20 ? item.title.slice(0, cut) : item.title.slice(0, 80)) + "…";
      })();
      return `    <item>
      <title>${escapeXml(rssTitle)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>تحریریه پالس ایران</dc:creator>
      <description>${description}</description>
      <content:encoded><![CDATA[${fullBody}${item.link ? `\n\nمنبع: ${item.source} — ${item.link}` : ""}]]></content:encoded>
      <source url="${SITE_URL}">${escapeXml(item.source)}</source>
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ""}
      ${item.political_lean ? `<category>${escapeXml(item.political_lean)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" ${CONTENT_NS} ${DC_NS}>
  <channel>
    <title>پالس ایران — اخبار فوری ایران و جهان</title>
    <link>${SITE_URL}</link>
    <description>اخبار فوری ایران و جهان، بی‌طرف از همه منابع</description>
    <language>fa</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
