export interface NewsItem {
  id: number;
  item_id: string;
  url_id?: string;
  source: string;
  political_lean?: string;
  title: string;
  posted_at: string;
  category?: string;
  is_breaking?: boolean;
  image_url?: string;
  summary?: string;
  web_summary?: string;
  link?: string;
  importance?: "high" | "medium" | "low";
  telegram_posted?: boolean;
  video_url?: string;
  source_count?: number;
  confirming_sources?: string;
  verification_status?: "verified" | "reviewing" | "unverified";
  telegram_url?: string;
}

export interface PriceItem {
  key: string;
  price: number;
  updated_at: string;
  change_pct?: number;
  trend?: "up" | "down" | "flat";
}

export interface SourceInfo {
  name: string;
  telegram_channel?: string;
  political_lean?: string;
  credibility?: number;
  max_per_day?: number;
  today_count?: number;
  count?: number;
}

export interface DailyStats {
  date: string;
  post_count: number;
}

export interface AdminStats {
  today_posts: number;
  total_posts: number;
  sources_active: number;
  source_breakdown: { source: string; count: number }[];
  daily_history: DailyStats[];
}

export interface PaginatedNews {
  items: NewsItem[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_more: boolean;
}

export interface Briefing {
  id: number;
  type: "morning" | "nightly";
  content: string;
  date: string;
  created_at: string;
}

export interface LatestBriefings {
  morning?: Briefing;
  nightly?: Briefing;
}

export interface SearchResult {
  items: NewsItem[];
  total: number;
  query: string;
}

export type Category =
  | "سیاست"
  | "اقتصاد"
  | "ورزش"
  | "تکنولوژی"
  | "فرهنگ"
  | "استان‌ها"
  | "بین‌الملل"
  | "اجتماعی";
