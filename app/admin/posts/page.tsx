import { cookies } from "next/headers";
import { getNews } from "@/lib/api";
import PostList from "./PostList";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1", 10);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value ?? "";

  let items: { item_id: string; title: string; source: string; posted_at: string; is_breaking?: boolean }[] = [];
  let has_more = false;
  try {
    const data = await getNews(page, 50);
    items = data.items;
    has_more = data.has_more;
  } catch {}

  return <PostList initialItems={items} token={token} page={page} hasMore={has_more} />;
}
