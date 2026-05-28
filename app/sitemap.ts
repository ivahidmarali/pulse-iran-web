export const dynamic = "force-dynamic";

import { generateSlug, SITE_URL } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";
import type { MetadataRoute } from "next";

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsItems: NewsItem[] = [];
  try {
    const res = await fetch(`${INTERNAL_API}/news?page=1&per_page=1000`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      newsItems = data.items ?? [];
    }
  } catch {}

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/prices`, changeFrequency: "always", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/archive`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${SITE_URL}/article/${encodeURIComponent(item.item_id)}/${generateSlug(item.title)}`,
    lastModified: item.posted_at ? new Date(item.posted_at) : new Date(),
    changeFrequency: "never",
    priority: item.importance === "high" ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
