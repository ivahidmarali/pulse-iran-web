export const revalidate = 3600;

import { articleUrl, SITE_URL } from "@/lib/utils";
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

  // Deduplicate by item_id — keep the first (most recent) occurrence
  const seen = new Set<string>();
  const uniqueItems = newsItems.filter((item) => {
    if (seen.has(item.item_id)) return false;
    seen.add(item.item_id);
    return true;
  });

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/prices`, lastModified: now },
    { url: `${SITE_URL}/categories`, lastModified: now },
    { url: `${SITE_URL}/archive`, lastModified: now },
    { url: `${SITE_URL}/search`, lastModified: now },
    { url: `${SITE_URL}/sources`, lastModified: now },
    { url: `${SITE_URL}/about`, lastModified: new Date("2026-05-29") },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-05-29") },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-05-29") },
  ];

  // Use articleUrl() so sitemap URLs exactly match the canonical tags in metadata
  const articleRoutes: MetadataRoute.Sitemap = uniqueItems.map((item) => ({
    url: articleUrl(item.item_id, item.title),
    lastModified: item.posted_at ? new Date(item.posted_at) : now,
  }));

  return [...staticRoutes, ...articleRoutes];
}
