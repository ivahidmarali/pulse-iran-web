import { cookies } from "next/headers";
import ArticleForm from "./ArticleForm";

export default async function AdminNewArticlePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value ?? "";
  return <ArticleForm token={token} />;
}
