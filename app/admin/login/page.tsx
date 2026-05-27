"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("رمز اشتباه است");
      const data = await res.json();
      document.cookie = `admin_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-secondary-fixed-dim text-[48px]">pulse_alert</span>
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-secondary-fixed-dim mt-2">پالس ایران</h1>
          <p className="text-on-surface-variant text-sm mt-1">پنل مدیریت</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-label-sm font-label-sm text-on-surface-variant block mb-2">رمز ورود</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-fixed-dim transition-colors"
              placeholder="رمز مدیریت را وارد کنید"
              required
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary-container text-on-secondary-container rounded-lg py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
