export const revalidate = 3600;

import { generateSlug, SITE_URL } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";
import type { MetadataRoute } from "next";

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const PAGE_SIZE = 100;

async function fetchAllArticles(): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${INTERNAL_API}/news?page=${page}&per_page=${PAGE_SIZE}`,
      { cache: "no-store" }
    );
    if (!res.ok) break;
    const data = await res.json();
    const batch: NewsItem[] = data.items ?? [];
    items.push(...batch);
    if (!data.has_more || batch.length < PAGE_SIZE) break;
    page++;
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsItems: NewsItem[] = [];
  try {
    newsItems = await fetchAllArticles();
  } catch {}

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/prices`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/archive`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/sources`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${SITE_URL}/article/${encodeURIComponent(item.item_id)}/${generateSlug(item.title)}`,
    lastModified: item.posted_at ? new Date(item.posted_at) : new Date(),
    changeFrequency: "weekly",
    priority: item.importance === "high" ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
