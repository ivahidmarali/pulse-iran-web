export const revalidate = 3600;

import { articleUrl, generateSlug, SITE_URL } from "@/lib/utils";
import type { NewsItem, SourceInfo } from "@/lib/types";
import type { MetadataRoute } from "next";

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const PAGE_SIZE = 100;

const LEAN_SLUGS = [
  "osoulgarayan", "rasmi-dolati", "eslah-talab", "eslah-talab-mianeh",
  "mohafezeh-kar-mianeh", "liberal-gharbi", "liberal-amrikai", "chap-liberal",
  "mokhalef-jomhouri-eslami", "mohafezeh-kar-arabi", "mostaghel",
];

const TAG_SLUGS = [
  "siasi", "beinolmelal", "eqtesadi", "ejtemai", "varzeshi", "technology", "hashiye",
];

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

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    const res = await fetch(`${INTERNAL_API}/sources`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsItems: NewsItem[] = [];
  let sources: SourceInfo[] = [];
  try {
    [newsItems, sources] = await Promise.all([fetchAllArticles(), fetchSources()]);
  } catch {}

  // Deduplicate by item_id — keep the first (most recent) occurrence
  const seen = new Set<string>();
  const uniqueItems = newsItems.filter((item) => {
    if (seen.has(item.item_id)) return false;
    seen.add(item.item_id);
    return true;
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    // Dynamic feed pages — omit lastmod so Google uses its own crawl signal
    { url: SITE_URL, changeFrequency: "always" as const, priority: 1.0 },
    { url: `${SITE_URL}/prices`, changeFrequency: "always" as const, priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${SITE_URL}/archive`, changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${SITE_URL}/sources`, changeFrequency: "weekly" as const, priority: 0.6 },
    // Static content pages — use real last-edited dates
    { url: `${SITE_URL}/editorial`, changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/about/editorial-policy`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${SITE_URL}/corrections`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-05-29"), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-05-29"), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const leanRoutes: MetadataRoute.Sitemap = LEAN_SLUGS.map((slug) => ({
    url: `${SITE_URL}/lean/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = TAG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tag/${slug}`,
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  const sourceRoutes: MetadataRoute.Sitemap = sources.map((src) => ({
    url: `${SITE_URL}/source/${encodeURIComponent(generateSlug(src.name))}`,
    changeFrequency: "hourly" as const,
    priority: 0.5,
  }));

  // Use articleUrl() so sitemap URLs exactly match the canonical tags in metadata
  const articleRoutes: MetadataRoute.Sitemap = uniqueItems.map((item) => ({
    url: articleUrl(item.item_id, item.title),
    lastModified: item.posted_at ? new Date(item.posted_at) : now,
  }));

  return [...staticRoutes, ...leanRoutes, ...tagRoutes, ...sourceRoutes, ...articleRoutes];
}
