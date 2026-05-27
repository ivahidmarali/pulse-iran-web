export interface NewsItem {
  id: number;
  item_id: string;
  source: string;
  political_lean?: string;
  title: string;
  posted_at: string;
  category?: string;
  is_breaking?: boolean;
  image_url?: string;
  summary?: string;
  link?: string;
  importance?: "high" | "medium" | "low";
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
  has_more: boolean;
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
