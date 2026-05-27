import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // middleware-style check — redirect to login if no token
  if (!token?.value) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen cyber-grid">
      {/* Admin top bar */}
      <header className="bg-surface-container border-b border-white/5 sticky top-0 z-50 flex flex-row-reverse items-center justify-between px-6 h-14">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-[22px]">pulse_alert</span>
          <span className="text-secondary-fixed-dim font-bold">پالس ایران — ادمین</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">داشبورد</Link>
          <Link href="/admin/sources" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">منابع</Link>
          <Link href="/admin/posts" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">پست‌ها</Link>
          <Link href="/" className="text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
