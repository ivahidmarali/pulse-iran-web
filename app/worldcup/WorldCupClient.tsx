"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { articleHref } from "@/lib/utils";
import type { WCGroup } from "@/lib/api";
import type { NewsItem } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────

interface Match {
  id: number;
  team1: string; team2: string;
  team1_logo?: string | null; team2_logo?: string | null;
  score1: number | null; score2: number | null;
  minute: string; status: string; status_code: number;
  is_live: boolean; is_final: boolean;
  match_time: string; start_utc: string; has_details: boolean;
}
interface DateGroup { jalali_key: string; date_label: string; matches: Match[]; }
interface League { title: string; date_groups: DateGroup[]; }
interface LiveScoreData { leagues: League[]; ts: number; ok: boolean; }

interface Props {
  initialLiveData: LiveScoreData | null;
  initialStandings: { groups: WCGroup[]; ok: boolean } | null;
  initialNews: NewsItem[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const WC_END = new Date("2026-07-19T23:59:59Z");
const IRAN_KEYWORDS = ["ایران", "iran"];

// ── Helpers ────────────────────────────────────────────────────────────────

function isWCLeague(title: string) {
  const t = title.toLowerCase();
  return (t.includes("جام") && t.includes("جهانی")) || (t.includes("world") && t.includes("cup"));
}

function isIranMatch(m: Match) {
  const combined = `${m.team1} ${m.team2}`.toLowerCase();
  return IRAN_KEYWORDS.some((k) => combined.includes(k));
}

function formatTime(utc: string) {
  if (!utc) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(utc));
  } catch { return ""; }
}

function formatDate(utc: string) {
  if (!utc) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      month: "long", day: "numeric",
    }).format(new Date(utc));
  } catch { return ""; }
}

function toFa(n: number) { return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]); }

function relativePosted(posted: string) {
  const diff = Math.floor((Date.now() - new Date(posted + "Z").getTime()) / 60000);
  if (diff < 60) return `${toFa(diff)} دقیقه پیش`;
  if (diff < 1440) return `${toFa(Math.floor(diff / 60))} ساعت پیش`;
  return `${toFa(Math.floor(diff / 1440))} روز پیش`;
}

function TeamLogo({ logo, name, size = 28 }: { logo?: string | null; name: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <img src={logo} alt={name} width={size} height={size}
        className="object-contain rounded-full bg-white/5"
        onError={() => setErr(true)} />
    );
  }
  return (
    <div style={{ width: size, height: size }}
      className="rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-on-surface-variant shrink-0">
      {name.slice(0, 1)}
    </div>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────

function MatchCard({ match, highlight }: { match: Match; highlight?: boolean }) {
  const hasScore = match.score1 !== null && match.score2 !== null;
  const iranInvolved = isIranMatch(match);

  return (
    <div className={`rounded-xl p-3 border transition-all ${
      iranInvolved
        ? "bg-[#3cd7ff]/5 border-[#3cd7ff]/30"
        : highlight
        ? "bg-surface-container border-white/10"
        : "bg-surface-container/60 border-white/5"
    }`}>
      <div className="flex items-center justify-between gap-2">
        {/* Team 1 */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className={`text-sm font-bold text-right leading-tight ${iranInvolved && match.team1.toLowerCase().includes("ایران") ? "text-[#3cd7ff]" : "text-on-surface"}`}>
            {match.team1}
          </span>
          <TeamLogo logo={match.team1_logo} name={match.team1} />
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center min-w-[64px]">
          {hasScore ? (
            <div className="flex items-center gap-1.5">
              <span className={`text-xl font-black tabular-nums ${match.is_live ? "text-green-400" : "text-on-surface"}`}>
                {match.score1}
              </span>
              <span className="text-on-surface-variant">-</span>
              <span className={`text-xl font-black tabular-nums ${match.is_live ? "text-green-400" : "text-on-surface"}`}>
                {match.score2}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-on-surface-variant tabular-nums">
              {formatTime(match.start_utc) || match.match_time || "---"}
            </span>
          )}
          {match.is_live ? (
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              {match.minute || "زنده"}
            </span>
          ) : match.is_final ? (
            <span className="text-[10px] text-on-surface-variant/60 mt-0.5">پایان</span>
          ) : (
            <span className="text-[10px] text-on-surface-variant/50 mt-0.5">{formatDate(match.start_utc)}</span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-2 flex-1 justify-start">
          <TeamLogo logo={match.team2_logo} name={match.team2} />
          <span className={`text-sm font-bold text-left leading-tight ${iranInvolved && match.team2.toLowerCase().includes("ایران") ? "text-[#3cd7ff]" : "text-on-surface"}`}>
            {match.team2}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Group standings table ──────────────────────────────────────────────────

function StandingsTable({ group }: { group: WCGroup }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="text-[11px] text-on-surface-variant/60 border-b border-white/5">
            <th className="text-right pb-2 font-medium w-6">#</th>
            <th className="text-right pb-2 font-medium">تیم</th>
            <th className="text-center pb-2 font-medium w-8">بازی</th>
            <th className="text-center pb-2 font-medium w-8">برد</th>
            <th className="text-center pb-2 font-medium w-8">مساوی</th>
            <th className="text-center pb-2 font-medium w-8">باخت</th>
            <th className="text-center pb-2 font-medium w-12">گل</th>
            <th className="text-center pb-2 font-medium w-8">تفا</th>
            <th className="text-center pb-2 font-bold w-10 text-[#3cd7ff]">امتیاز</th>
          </tr>
        </thead>
        <tbody>
          {group.teams.map((t, i) => {
            const isIran = IRAN_KEYWORDS.some((k) => t.name.toLowerCase().includes(k));
            const isQualify = i < 2;
            return (
              <tr key={t.name} className={`border-b border-white/5 transition-colors ${
                isIran ? "bg-[#3cd7ff]/5" : ""
              }`}>
                <td className="py-2 pr-1">
                  <span className={`text-xs font-bold tabular-nums ${
                    isQualify ? "text-green-400" : "text-on-surface-variant/50"
                  }`}>{t.rank || i + 1}</span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <TeamLogo logo={t.logo} name={t.name} size={22} />
                    <span className={`text-sm ${isIran ? "font-bold text-[#3cd7ff]" : "text-on-surface"}`}>{t.name}</span>
                  </div>
                </td>
                <td className="py-2 text-center text-on-surface-variant tabular-nums">{t.played}</td>
                <td className="py-2 text-center text-green-400/80 tabular-nums">{t.won}</td>
                <td className="py-2 text-center text-on-surface-variant/60 tabular-nums">{t.drawn}</td>
                <td className="py-2 text-center text-red-400/70 tabular-nums">{t.lost}</td>
                <td className="py-2 text-center text-on-surface-variant/60 tabular-nums">{t.gf}:{t.ga}</td>
                <td className={`py-2 text-center tabular-nums ${t.gd > 0 ? "text-green-400/80" : t.gd < 0 ? "text-red-400/70" : "text-on-surface-variant/60"}`}>{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                <td className="py-2 text-center font-black text-on-surface tabular-nums">{t.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[10px] text-green-400/60 mt-1.5 text-right">🟢 صعود به مرحله بعد</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function WorldCupClient({ initialLiveData, initialStandings, initialNews }: Props) {
  const [liveData, setLiveData] = useState<LiveScoreData | null>(initialLiveData);
  const [standings, setStandings] = useState(initialStandings);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Derived WC data ──────────────────────────────────────────────────────
  const allWCMatches = useMemo<Match[]>(() => {
    if (!liveData?.leagues) return [];
    return liveData.leagues
      .filter((l) => isWCLeague(l.title))
      .flatMap((l) => l.date_groups.flatMap((dg) => dg.matches));
  }, [liveData]);

  const liveMatches = useMemo(() => allWCMatches.filter((m) => m.is_live), [allWCMatches]);
  const finalMatches = useMemo(() => allWCMatches.filter((m) => m.is_final).slice(-8), [allWCMatches]);
  const upcomingMatches = useMemo(() =>
    allWCMatches.filter((m) => !m.is_live && !m.is_final && m.start_utc).slice(0, 8),
    [allWCMatches]);

  const nextIranMatch = useMemo(() =>
    upcomingMatches.find(isIranMatch) || liveMatches.find(isIranMatch),
    [upcomingMatches, liveMatches]);

  const iranGroupKey = useMemo(() => {
    if (!standings?.groups) return -1;
    return standings.groups.findIndex((g) =>
      g.teams.some((t) => IRAN_KEYWORDS.some((k) => t.name.toLowerCase().includes(k)))
    );
  }, [standings]);

  // ── Countdown to WC end (or next Iran match) ─────────────────────────────
  useEffect(() => {
    const target = nextIranMatch?.start_utc
      ? new Date(nextIranMatch.start_utc)
      : WC_END;

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextIranMatch]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/livescore`, { cache: "no-store" });
      if (r.ok) setLiveData(await r.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchLive();
    pollRef.current = setInterval(fetchLive, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchLive]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/worldcup/standings`, { cache: "no-store" });
        if (r.ok) setStandings(await r.json());
      } catch {}
    })();
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/news?category=${encodeURIComponent("🏆")}&per_page=15`, { cache: "no-store" });
        if (r.ok) { const d = await r.json(); setNews(d.items ?? []); }
      } catch {}
    })();
  }, []);

  const groups = standings?.groups ?? [];
  const visibleGroup = groups[selectedGroup === -1 ? 0 : selectedGroup];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen pb-24 md:pb-8">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-background border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3cd7ff]/5 via-transparent to-[#3cd7ff]/5 pointer-events-none" />
        <div className="px-container-margin py-8 md:py-10 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                <span className="text-3xl">🏆</span>
                <h1 className="text-2xl md:text-3xl font-black text-on-surface leading-tight">
                  جام جهانی ۲۰۲۶
                </h1>
              </div>
              <p className="text-sm text-on-surface-variant">
                ایالات متحده · کانادا · مکزیک — ۱۱ ژوئن تا ۱۹ ژوئیه ۲۰۲۶
              </p>
              {nextIranMatch && (
                <p className="text-xs text-[#3cd7ff] mt-1 font-medium">
                  🇮🇷 ایران — {nextIranMatch.team1 === "ایران" ? nextIranMatch.team2 : nextIranMatch.team1} ·{" "}
                  {formatDate(nextIranMatch.start_utc)} ساعت {formatTime(nextIranMatch.start_utc)}
                </p>
              )}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3">
              {[
                { v: countdown.days, label: "روز" },
                { v: countdown.hours, label: "ساعت" },
                { v: countdown.mins, label: "دقیقه" },
                { v: countdown.secs, label: "ثانیه" },
              ].map(({ v, label }) => (
                <div key={label} className="flex flex-col items-center bg-surface-container rounded-xl px-3 py-2 min-w-[52px] border border-white/5">
                  <span className="text-xl md:text-2xl font-black text-[#3cd7ff] tabular-nums leading-none">
                    {String(v).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)])}
                  </span>
                  <span className="text-[10px] text-on-surface-variant mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-container-margin mt-6 space-y-8 max-w-screen-xl mx-auto">

        {/* ── Live matches ── */}
        {liveMatches.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              بازی‌های در جریان
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {liveMatches.map((m) => <MatchCard key={m.id} match={m} highlight />)}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ── Left: matches col ── */}
          <div className="md:col-span-2 space-y-8">

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="text-base">📅</span> بازی‌های آینده
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {upcomingMatches.slice(0, 8).map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            )}

            {/* Recent results */}
            {finalMatches.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="text-base">📋</span> نتایج اخیر
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {finalMatches.slice(-8).map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            )}

            {/* Group standings */}
            <section>
              <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="text-base">📊</span> جدول گروه‌ها
              </h2>

              {groups.length === 0 ? (
                <div className="bg-surface-container rounded-xl p-6 text-center text-on-surface-variant text-sm border border-white/5">
                  جدول‌ها پس از شروع رقابت‌ها نمایش داده می‌شود
                </div>
              ) : (
                <>
                  {/* Group tabs */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {groups.map((g, i) => (
                      <button key={g.title} onClick={() => setSelectedGroup(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                          selectedGroup === i
                            ? "bg-[#3cd7ff]/15 text-[#3cd7ff] border-[#3cd7ff]/30"
                            : "text-on-surface-variant border-white/5 hover:border-white/20"
                        } ${iranGroupKey === i ? "ring-1 ring-[#3cd7ff]/40" : ""}`}>
                        {g.title}
                        {iranGroupKey === i && <span className="mr-1">🇮🇷</span>}
                      </button>
                    ))}
                  </div>

                  {visibleGroup && (
                    <div className="bg-surface-container rounded-xl p-4 border border-white/5">
                      <h3 className="text-sm font-bold text-on-surface mb-3">{visibleGroup.title}</h3>
                      <StandingsTable group={visibleGroup} />
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ── Right: news ── */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="text-base">📰</span> اخبار جام جهانی
            </h2>

            {news.length === 0 ? (
              <p className="text-sm text-on-surface-variant/60">اخبار جدیدی یافت نشد</p>
            ) : (
              <div className="space-y-2">
                {news.map((item) => (
                  <Link key={item.item_id} href={articleHref(item.item_id, item.title)}
                    className="block bg-surface-container rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all group">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title}
                        className="w-full h-28 object-cover rounded-lg mb-2 opacity-90 group-hover:opacity-100 transition-opacity" />
                    )}
                    <p className="text-sm font-medium text-on-surface leading-relaxed line-clamp-3 group-hover:text-[#3cd7ff] transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-on-surface-variant/50">{item.source}</span>
                      <span className="text-[10px] text-on-surface-variant/40">{relativePosted(item.posted_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/?group=%D9%88%D8%B1%D8%B2%D8%B4%DB%8C"
              className="block text-center text-xs text-[#3cd7ff] py-2 hover:underline">
              همه اخبار ورزشی ←
            </Link>
          </div>
        </div>

        {/* ── Iran spotlight ── */}
        <section className="bg-gradient-to-r from-[#3cd7ff]/5 to-surface-container rounded-2xl p-5 border border-[#3cd7ff]/10">
          <h2 className="text-sm font-bold text-[#3cd7ff] mb-4 flex items-center gap-2">
            🇮🇷 تیم ملی ایران در جام جهانی
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-variant/60 mb-1">گروه G</p>
              <p className="text-sm text-on-surface">ایران — بلژیک — مصر — نیوزیلند</p>
            </div>
            <div className="space-y-2">
              {[...liveMatches, ...upcomingMatches, ...finalMatches]
                .filter(isIranMatch)
                .slice(0, 3)
                .map((m) => <MatchCard key={m.id} match={m} />)}
              {![...liveMatches, ...upcomingMatches, ...finalMatches].some(isIranMatch) && (
                <p className="text-xs text-on-surface-variant/50">بازی‌های ایران پس از شروع مسابقات نمایش داده می‌شود</p>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ (SEO) ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-on-surface">سوالات متداول جام جهانی ۲۰۲۶</h2>
          {[
            { q: "جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟", a: "جام جهانی ۲۰۲۶ به میزبانی مشترک ایالات متحده آمریکا، کانادا و مکزیک برگزار می‌شود. ۱۶ شهر میزبان از ۱۱ ژوئن تا ۱۹ ژوئیه ۲۰۲۶ صحنه رقابت‌ها خواهند بود." },
            { q: "ایران در کدام گروه جام جهانی ۲۰۲۶ است؟", a: "تیم ملی ایران در گروه G جام جهانی ۲۰۲۶ قرار دارد و رقبای آن بلژیک، مصر و نیوزیلند هستند." },
            { q: "جام جهانی ۲۰۲۶ چند تیم دارد؟", a: "برای اولین بار در تاریخ، ۴۸ تیم در جام جهانی ۲۰۲۶ شرکت می‌کنند. رقابت‌ها با ۱۲ گروه چهارتایی آغاز می‌شود." },
            { q: "کجا می‌توانم نتایج زنده جام جهانی را دنبال کنم؟", a: "می‌توانید نتایج زنده جام جهانی را در صفحه نتایج زنده پالس ایران دنبال کنید. اطلاعات هر ۳۰ ثانیه به‌روزرسانی می‌شود." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium text-on-surface cursor-pointer list-none flex items-center justify-between">
                {q}
                <span className="text-on-surface-variant group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-on-surface-variant leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

      </div>
    </div>
  );
}
