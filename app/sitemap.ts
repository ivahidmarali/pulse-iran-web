import { getNews } from "@/lib/api";
import { generateSlug, SITE_URL } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export default async function sitemap() {
  let newsItems: NewsItem[] = [];
  try {
    const data = await getNews(1, 1000);
    newsItems = data.items;
  } catch {}

  const staticRoutes = [
    { url: SITE_URL, changeFrequency: "hourly" as const, priority: 1 },
    { url: `${SITE_URL}/prices`, changeFrequency: "always" as const, priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${SITE_URL}/archive`, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const articleRoutes = newsItems.map((item) => ({
    url: `${SITE_URL}/article/${encodeURIComponent(item.item_id)}/${generateSlug(item.title)}`,
    lastModified: item.posted_at,
    changeFrequency: "never" as const,
    priority: item.is_breaking ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
