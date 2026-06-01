import { SITE_URL } from "@/lib/utils";

export const revalidate = 300; // regenerate every 5 minutes

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

interface Item {
  item_id: string;
  title: string;
  posted_at: string;
}

export async function GET() {
  let items: Item[] = [];
  try {
    const res = await fetch(`${INTERNAL_API}/news?page=1&per_page=1000`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const cutoff = Date.now() - TWO_DAYS_MS;
      items = (data.items ?? []).filter(
        (i: Item) => i.title && new Date(i.posted_at).getTime() > cutoff
      );
    }
  } catch {
    // return empty sitemap on error rather than 500
  }

  // Deduplicate by item_id
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.item_id)) return false;
    seen.add(i.item_id);
    return true;
  });

  const urls = unique
    .map(
      (item) => `
  <url>
    <loc>${SITE_URL}/article/${encodeURIComponent(item.item_id)}</loc>
    <news:news>
      <news:publication>
        <news:name>پالس ایران</news:name>
        <news:language>fa</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.posted_at).toISOString()}</news:publication_date>
      <news:title><![CDATA[${item.title.replace(/]]>/g, "]]]]><![CDATA[>")}]]></news:title>
    </news:news>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
