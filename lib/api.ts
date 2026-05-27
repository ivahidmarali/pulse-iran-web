const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json();
}

export async function getNews(
  page = 1,
  perPage = 20,
  categories?: string[],
  source?: string,
) {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("per_page", String(perPage));
  if (categories?.length) {
    for (const cat of categories) q.append("category", cat);
  }
  if (source) q.set("source", source);
  return apiFetch<{
    items: import("./types").NewsItem[];
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
  }>(`/news?${q}`);
}

export async function getBreakingNews() {
  return apiFetch<import("./types").NewsItem[]>("/news/breaking");
}

export async function getNewsById(id: string) {
  return apiFetch<import("./types").NewsItem>(`/news/${id}`);
}

export async function searchNews(query: string, page = 1) {
  return apiFetch<import("./types").SearchResult>(
    `/news/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function getArchive(params: {
  date?: string;
  source?: string;
  page?: number;
}) {
  const q = new URLSearchParams();
  if (params.date) q.set("date", params.date);
  if (params.source) q.set("source", params.source);
  if (params.page) q.set("page", String(params.page));
  return apiFetch<{
    items: import("./types").NewsItem[];
    total: number;
    has_more: boolean;
  }>(`/news/archive?${q}`);
}

export async function getPrices() {
  return apiFetch<import("./types").PriceItem[]>("/prices");
}

export async function getSources() {
  return apiFetch<import("./types").SourceInfo[]>("/sources");
}

export async function getCategories() {
  return apiFetch<{ name: string; count: number }[]>("/categories");
}

export async function getAdminStats(token: string) {
  return apiFetch<import("./types").AdminStats>("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
}

export async function adminLogin(password: string) {
  const res = await fetch(`${BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json() as Promise<{ access_token: string }>;
}

export async function deletePost(itemId: string, token: string) {
  return apiFetch<{ ok: boolean }>(`/admin/posts/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });
}
