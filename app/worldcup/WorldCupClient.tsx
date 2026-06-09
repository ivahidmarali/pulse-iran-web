"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { articleHref } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

// ── Hard-coded WC 2026 data ────────────────────────────────────────────────

const WC_START_UTC = new Date("2026-06-11T19:00:00Z"); // Opening match

// Iran's confirmed match schedule (Tehran time shown, UTC stored)
const IRAN_SCHEDULE = [
  { id: "ir1", opponent: "نیوزیلند", opponentEn: "New Zealand", flag: "🇳🇿", utc: "2026-06-16T01:00:00Z", venue: "لس آنجلس", group: "گروه G" },
  { id: "ir2", opponent: "بلژیک",    opponentEn: "Belgium",     flag: "🇧🇪", utc: "2026-06-21T19:00:00Z", venue: "لس آنجلس", group: "گروه G" },
  { id: "ir3", opponent: "مصر",      opponentEn: "Egypt",       flag: "🇪🇬", utc: "2026-06-27T03:00:00Z", venue: "سیاتل",    group: "گروه G" },
];

const WC_GROUPS = [
  { id: "A", name: "گروه A", teams: [{ name: "مکزیک", flag: "🇲🇽" }, { name: "کره جنوبی", flag: "🇰🇷" }, { name: "جمهوری چک", flag: "🇨🇿" }, { name: "آفریقای جنوبی", flag: "🇿🇦" }] },
  { id: "B", name: "گروه B", teams: [{ name: "کانادا", flag: "🇨🇦" }, { name: "قطر", flag: "🇶🇦" }, { name: "سوئیس", flag: "🇨🇭" }, { name: "بوسنی", flag: "🇧🇦" }] },
  { id: "C", name: "گروه C", teams: [{ name: "برزیل", flag: "🇧🇷" }, { name: "اسکاتلند", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, { name: "مراکش", flag: "🇲🇦" }, { name: "هائیتی", flag: "🇭🇹" }] },
  { id: "D", name: "گروه D", teams: [{ name: "ایالات متحده", flag: "🇺🇸" }, { name: "استرالیا", flag: "🇦🇺" }, { name: "پاراگوئه", flag: "🇵🇾" }, { name: "ترکیه", flag: "🇹🇷" }] },
  { id: "E", name: "گروه E", teams: [{ name: "آلمان", flag: "🇩🇪" }, { name: "اکوادور", flag: "🇪🇨" }, { name: "ساحل عاج", flag: "🇨🇮" }, { name: "کوراسائو", flag: "🇨🇼" }] },
  { id: "F", name: "گروه F", teams: [{ name: "هلند", flag: "🇳🇱" }, { name: "ژاپن", flag: "🇯🇵" }, { name: "سوئد", flag: "🇸🇪" }, { name: "تونس", flag: "🇹🇳" }] },
  { id: "G", name: "گروه G", teams: [{ name: "ایران", flag: "🇮🇷" }, { name: "بلژیک", flag: "🇧🇪" }, { name: "مصر", flag: "🇪🇬" }, { name: "نیوزیلند", flag: "🇳🇿" }] },
  { id: "H", name: "گروه H", teams: [{ name: "اسپانیا", flag: "🇪🇸" }, { name: "اروگوئه", flag: "🇺🇾" }, { name: "عربستان", flag: "🇸🇦" }, { name: "کیپ ورد", flag: "🇨🇻" }] },
  { id: "I", name: "گروه I", teams: [{ name: "فرانسه", flag: "🇫🇷" }, { name: "عراق", flag: "🇮🇶" }, { name: "سنگال", flag: "🇸🇳" }, { name: "نروژ", flag: "🇳🇴" }] },
  { id: "J", name: "گروه J", teams: [{ name: "آرژانتین", flag: "🇦🇷" }, { name: "اتریش", flag: "🇦🇹" }, { name: "اردن", flag: "🇯🇴" }, { name: "الجزایر", flag: "🇩🇿" }] },
  { id: "K", name: "گروه K", teams: [{ name: "پرتغال", flag: "🇵🇹" }, { name: "ازبکستان", flag: "🇺🇿" }, { name: "کنگو", flag: "🇨🇩" }, { name: "کلمبیا", flag: "🇨🇴" }] },
  { id: "L", name: "گروه L", teams: [{ name: "انگلستان", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "پاناما", flag: "🇵🇦" }, { name: "غنا", flag: "🇬🇭" }, { name: "کرواسی", flag: "🇭🇷" }] },
];

const IRAN_GROUP = WC_GROUPS.find((g) => g.id === "G")!;

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
interface League { title: string; date_groups: { jalali_key: string; date_label: string; matches: Match[] }[]; }
interface LiveScoreData { leagues: League[]; ts: number; ok: boolean; }

interface StandingTeam {
  rank: number; name: string; logo: string;
  played: number; won: number; drawn: number; lost: number;
  gf: number; ga: number; gd: number; points: number;
}
interface StandingsGroup { title: string; teams: StandingTeam[]; }

interface Props {
  initialLiveData: LiveScoreData | null;
  initialStandings: { groups: StandingsGroup[]; ok: boolean } | null;
  initialNews: NewsItem[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const TEHRAN_OFFSET_MS = (3 * 60 + 30) * 60 * 1000;

function isWCLeague(t: string) { const s = t.toLowerCase(); return (s.includes("جام") && s.includes("جهانی")) || (s.includes("world") && s.includes("cup")); }
function isIranTeam(n: string) { return n === "ایران" || n.toLowerCase() === "iran"; }
function isIranMatch(m: Match) { return isIranTeam(m.team1) || isIranTeam(m.team2); }

function tehranTimeStr(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit" }).format(new Date(utc)); } catch { return ""; }
}
function tehranDateStr(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", month: "long", day: "numeric" }).format(new Date(utc)); } catch { return ""; }
}
function tehranDateFull(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", weekday: "long", month: "long", day: "numeric" }).format(new Date(utc)); } catch { return ""; }
}
function relPosted(p: string) {
  const d = Math.floor((Date.now() - new Date(p + "Z").getTime()) / 60000);
  const fa = (n: number) => String(n).replace(/\d/g, (c) => "۰۱۲۳۴۵۶۷۸۹"[+c]);
  if (d < 60) return `${fa(d)} دقیقه پیش`;
  if (d < 1440) return `${fa(Math.floor(d / 60))} ساعت پیش`;
  return `${fa(Math.floor(d / 1440))} روز پیش`;
}

// ── Small components ───────────────────────────────────────────────────────

function TeamFlag({ flag, name, size = 32 }: { flag?: string | null; name: string; size?: number }) {
  if (flag && !flag.startsWith("http")) return <span style={{ fontSize: size * 0.8 }} className="leading-none select-none">{flag}</span>;
  if (flag?.startsWith("http")) {
    return <img src={flag} alt={name} width={size} height={size} className="object-contain rounded-sm" />;
  }
  return <div style={{ width: size, height: size }} className="rounded bg-white/10 flex items-center justify-center text-[10px] text-on-surface-variant">{name.slice(0, 1)}</div>;
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────

function MatchCard({ m, compact = false }: { m: Match; compact?: boolean }) {
  const iran = isIranMatch(m);
  const hasScore = m.score1 !== null && m.score2 !== null;

  return (
    <div className={`rounded-xl border transition-all ${iran ? "bg-[#3cd7ff]/5 border-[#3cd7ff]/20" : "bg-surface-container border-white/5"} ${compact ? "p-2.5" : "p-3.5"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <span className={`text-sm font-bold text-right truncate ${isIranTeam(m.team1) ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.team1}</span>
          {m.team1_logo ? <img src={m.team1_logo} alt="" width={22} height={22} className="object-contain rounded-full bg-white/5 shrink-0" /> : null}
        </div>
        <div className="flex flex-col items-center shrink-0 min-w-[60px]">
          {hasScore ? (
            <div className="flex items-center gap-1">
              <span className={`text-xl font-black tabular-nums ${m.is_live ? "text-green-400" : ""}`}>{m.score1}</span>
              <span className="text-on-surface-variant text-sm">-</span>
              <span className={`text-xl font-black tabular-nums ${m.is_live ? "text-green-400" : ""}`}>{m.score2}</span>
            </div>
          ) : (
            <span className="text-sm font-bold text-on-surface-variant tabular-nums">{tehranTimeStr(m.start_utc) || m.match_time || "--:--"}</span>
          )}
          {m.is_live ? (
            <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold mt-0.5"><LiveDot />{m.minute || "زنده"}</span>
          ) : m.is_final ? (
            <span className="text-[10px] text-on-surface-variant/50 mt-0.5">پایان</span>
          ) : (
            <span className="text-[10px] text-on-surface-variant/40 mt-0.5">{tehranDateStr(m.start_utc)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
          {m.team2_logo ? <img src={m.team2_logo} alt="" width={22} height={22} className="object-contain rounded-full bg-white/5 shrink-0" /> : null}
          <span className={`text-sm font-bold text-left truncate ${isIranTeam(m.team2) ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.team2}</span>
        </div>
      </div>
    </div>
  );
}

// ── Group standings table ──────────────────────────────────────────────────

function StandingsTable({ teams, liveData }: { teams: StandingTeam[]; liveData?: StandingTeam[] }) {
  const rows = liveData?.length ? liveData : teams.map((t, i) => ({ ...t, rank: i + 1, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" dir="rtl">
        <thead>
          <tr className="text-on-surface-variant/50 border-b border-white/5">
            <th className="text-right pb-2 font-medium w-5">#</th>
            <th className="text-right pb-2 font-medium">تیم</th>
            <th className="text-center pb-2 w-7">ب</th>
            <th className="text-center pb-2 w-7">Br</th>
            <th className="text-center pb-2 w-7">M</th>
            <th className="text-center pb-2 w-7">Ba</th>
            <th className="text-center pb-2 w-10">گل</th>
            <th className="text-center pb-2 w-7">T</th>
            <th className="text-center pb-2 w-8 text-[#3cd7ff] font-bold">Am</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => {
            const iran = IRAN_KEYWORDS.some((k) => t.name.toLowerCase().includes(k));
            return (
              <tr key={t.name} className={`border-b border-white/5 ${iran ? "bg-[#3cd7ff]/5" : ""}`}>
                <td className="py-1.5 pr-1"><span className={`font-bold ${i < 2 ? "text-green-400" : "text-on-surface-variant/40"}`}>{i + 1}</span></td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <TeamFlag flag={WC_GROUPS.flatMap(g => g.teams).find(tm => tm.name === t.name)?.flag || t.logo} name={t.name} size={18} />
                    <span className={iran ? "font-bold text-[#3cd7ff]" : ""}>{t.name}</span>
                  </div>
                </td>
                <td className="py-1.5 text-center text-on-surface-variant tabular-nums">{t.played}</td>
                <td className="py-1.5 text-center text-green-400/70 tabular-nums">{t.won}</td>
                <td className="py-1.5 text-center text-on-surface-variant/50 tabular-nums">{t.drawn}</td>
                <td className="py-1.5 text-center text-red-400/60 tabular-nums">{t.lost}</td>
                <td className="py-1.5 text-center text-on-surface-variant/50 tabular-nums">{t.gf}:{t.ga}</td>
                <td className={`py-1.5 text-center tabular-nums ${t.gd > 0 ? "text-green-400/70" : t.gd < 0 ? "text-red-400/60" : "text-on-surface-variant/40"}`}>{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                <td className="py-1.5 text-center font-black text-on-surface tabular-nums">{t.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-2 h-2 rounded-sm bg-green-400/50" />
        <span className="text-[10px] text-on-surface-variant/40">صعود به مرحله حذفی</span>
      </div>
    </div>
  );
}

const IRAN_KEYWORDS = ["ایران", "iran"];

// ── Bracket section ────────────────────────────────────────────────────────

const BRACKET_STAGES = [
  { label: "یک شانزدهم", rounds: 16 },
  { label: "یک هشتم", rounds: 8 },
  { label: "یک چهارم", rounds: 4 },
  { label: "نیمه‌نهایی", rounds: 2 },
  { label: "فینال", rounds: 1 },
];

function BracketSection() {
  return (
    <section>
      <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
        <span>🏆</span> نمودار مرحله حذفی
      </h2>
      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-2" dir="ltr">
          {BRACKET_STAGES.map((stage) => (
            <div key={stage.label} className="flex flex-col gap-2">
              <div className="text-[10px] text-on-surface-variant/60 text-center font-bold mb-1 px-2">{stage.label}</div>
              {Array.from({ length: stage.rounds }).map((_, i) => (
                <div key={i} className="w-28 h-9 rounded-lg bg-surface-container border border-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-on-surface-variant/30 text-center px-2 leading-tight">در انتظار نتایج</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-on-surface-variant/40 mt-2 text-center">نتایج پس از پایان مرحله گروهی تکمیل می‌شود</p>
    </section>
  );
}

// ── News section ───────────────────────────────────────────────────────────

function NewsSection({ news }: { news: NewsItem[] }) {
  const hero = news.find((n) => n.image_url) ?? news[0];
  const rest = news.filter((n) => n.item_id !== hero?.item_id).slice(0, 6);

  return (
    <section>
      <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2"><span>📰</span> اخبار جام جهانی</span>
        <Link href="/?group=%D9%88%D8%B1%D8%B2%D8%B4%DB%8C" className="text-[11px] text-[#3cd7ff]">همه ←</Link>
      </h2>
      {news.length === 0 ? (
        <p className="text-sm text-on-surface-variant/40 text-center py-8">اخبار جدیدی یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hero news */}
          {hero && (
            <Link href={articleHref(hero.item_id, hero.title)}
              className="md:col-span-2 lg:col-span-2 group rounded-2xl overflow-hidden border border-white/5 bg-surface-container hover:border-white/15 transition-all block">
              {hero.image_url && (
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img src={hero.image_url} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-base leading-snug line-clamp-2">{hero.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-white/60 text-[11px]">{hero.source}</span>
                      <span className="text-white/40 text-[11px]">{relPosted(hero.posted_at)}</span>
                    </div>
                  </div>
                </div>
              )}
              {!hero.image_url && (
                <div className="p-4">
                  <p className="font-bold text-base text-on-surface line-clamp-3 group-hover:text-[#3cd7ff] transition-colors">{hero.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-on-surface-variant/50 text-[11px]">{hero.source}</span>
                    <span className="text-on-surface-variant/30 text-[11px]">{relPosted(hero.posted_at)}</span>
                  </div>
                </div>
              )}
            </Link>
          )}

          {/* Sub news */}
          <div className="space-y-2">
            {rest.slice(0, 4).map((item) => (
              <Link key={item.item_id} href={articleHref(item.item_id, item.title)}
                className="flex gap-3 p-2.5 rounded-xl bg-surface-container border border-white/5 hover:border-white/15 transition-all group">
                {item.image_url && (
                  <img src={item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-on-surface line-clamp-3 group-hover:text-[#3cd7ff] transition-colors leading-relaxed">{item.title}</p>
                  <span className="text-[10px] text-on-surface-variant/40 mt-1 block">{relPosted(item.posted_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Remaining news grid */}
      {rest.length > 4 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {rest.slice(4).map((item) => (
            <Link key={item.item_id} href={articleHref(item.item_id, item.title)}
              className="rounded-xl overflow-hidden border border-white/5 bg-surface-container hover:border-white/15 transition-all group block">
              {item.image_url && <img src={item.image_url} alt="" className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
              <div className="p-2.5">
                <p className="text-[11px] font-medium text-on-surface line-clamp-2 group-hover:text-[#3cd7ff] transition-colors">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function WorldCupClient({ initialLiveData, initialStandings, initialNews }: Props) {
  const [liveData, setLiveData] = useState<LiveScoreData | null>(initialLiveData);
  const [standings, setStandings] = useState(initialStandings);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selGroup, setSelGroup] = useState(6); // default to G (Iran's group)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── WC match data from livescore ─────────────────────────────────────────
  const allWCMatches = useMemo<Match[]>(() => {
    if (!liveData?.leagues) return [];
    return liveData.leagues.filter((l) => isWCLeague(l.title)).flatMap((l) => l.date_groups.flatMap((dg) => dg.matches));
  }, [liveData]);

  const liveWCMatches = useMemo(() => allWCMatches.filter((m) => m.is_live), [allWCMatches]);
  const recentMatches = useMemo(() => allWCMatches.filter((m) => m.is_final).slice(-8), [allWCMatches]);
  const upcomingMatches = useMemo(() => allWCMatches.filter((m) => !m.is_live && !m.is_final).slice(0, 12), [allWCMatches]);
  const liveIranMatch = useMemo(() => liveWCMatches.find(isIranMatch), [liveWCMatches]);

  // ── Standings for selected group ─────────────────────────────────────────
  const liveGroupMap = useMemo(() => {
    const map: Record<string, StandingTeam[]> = {};
    for (const g of standings?.groups ?? []) map[g.title] = g.teams;
    return map;
  }, [standings]);

  const selectedGroupData = WC_GROUPS[selGroup];
  const selectedLiveStandings = liveGroupMap[selectedGroupData?.name] ?? [];

  // Group G standings for Iran spotlight
  const iranGroupLive = liveGroupMap["گروه G"] ?? [];

  // ── Countdown to Iran's first match ─────────────────────────────────────
  useEffect(() => {
    // Count down to Iran's first upcoming match, or WC start if all Iran matches are in future
    const now = Date.now();
    const nextIranUTC = IRAN_SCHEDULE.find((m) => new Date(m.utc).getTime() > now)?.utc;
    const target = new Date(nextIranUTC ?? WC_START_UTC);

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
  }, []);

  // ── Polling ───────────────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    try { const r = await fetch(`${API_BASE}/livescore`, { cache: "no-store" }); if (r.ok) setLiveData(await r.json()); } catch {}
  }, []);

  useEffect(() => {
    fetchLive();
    pollRef.current = setInterval(fetchLive, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchLive]);

  useEffect(() => {
    (async () => { try { const r = await fetch(`${API_BASE}/worldcup/standings`, { cache: "no-store" }); if (r.ok) setStandings(await r.json()); } catch {} })();
    (async () => { try { const r = await fetch(`${API_BASE}/news?category=${encodeURIComponent("🏆")}&per_page=15`, { cache: "no-store" }); if (r.ok) { const d = await r.json(); setNews(d.items ?? []); } } catch {} })();
  }, []);

  const fa = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

  // Countdown label: Iran's next match or WC start
  const now = Date.now();
  const nextIranMatch = IRAN_SCHEDULE.find((m) => new Date(m.utc).getTime() > now);
  const wcStarted = now >= WC_START_UTC.getTime();

  return (
    <div dir="rtl" className="min-h-screen pb-24 md:pb-8">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#07192e] to-background">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 0%, #3cd7ff 0%, transparent 70%)" }} />
        <div className="px-container-margin py-8 md:py-12 relative">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">

            {/* Title + subtitle */}
            <div className="text-center md:text-right flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-end mb-3">
                <span className="text-5xl md:text-6xl">🏆</span>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-on-surface leading-tight">جام جهانی ۲۰۲۶</h1>
                  <p className="text-sm text-on-surface-variant mt-1">USA · Canada · Mexico</p>
                </div>
              </div>
              {liveIranMatch ? (
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 mt-2">
                  <LiveDot />
                  <span className="text-sm font-bold text-green-400">ایران در حال بازی</span>
                  <span className="text-sm text-on-surface-variant">{liveIranMatch.score1} - {liveIranMatch.score2}</span>
                </div>
              ) : nextIranMatch ? (
                <p className="text-sm text-[#3cd7ff]/80 mt-2">
                  🇮🇷 ایران — {nextIranMatch.flag} {nextIranMatch.opponent} · {tehranDateFull(nextIranMatch.utc)} ساعت {tehranTimeStr(nextIranMatch.utc)}
                </p>
              ) : !wcStarted ? (
                <p className="text-sm text-on-surface-variant/60 mt-2">۱۱ ژوئن ۲۰۲۶ · آغاز مسابقات</p>
              ) : null}
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              {[
                { v: countdown.days, l: "روز" },
                { v: countdown.hours, l: "ساعت" },
                { v: countdown.mins, l: "دقیقه" },
                { v: countdown.secs, l: "ثانیه" },
              ].map(({ v, l }, i) => (
                <div key={l}>
                  <div className="flex flex-col items-center bg-surface-container rounded-xl px-3 py-2.5 min-w-[56px] border border-white/5">
                    <span className="text-2xl md:text-3xl font-black text-[#3cd7ff] tabular-nums leading-none">{fa(v)}</span>
                    <span className="text-[10px] text-on-surface-variant/50 mt-1">{l}</span>
                  </div>
                  {i < 3 && <span className="text-on-surface-variant/30 mx-0.5 font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-container-margin mt-6 max-w-screen-xl mx-auto space-y-10">

        {/* ── LIVE MATCHES ──────────────────────────────────────────────── */}
        {liveWCMatches.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2"><LiveDot />بازی‌های در جریان</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {liveWCMatches.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </section>
        )}

        {/* ── IRAN SPOTLIGHT ────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[#3cd7ff]/15 overflow-hidden">
          <div className="bg-gradient-to-r from-[#3cd7ff]/10 to-surface-container px-5 py-3 border-b border-[#3cd7ff]/10">
            <h2 className="text-sm font-bold text-[#3cd7ff] flex items-center gap-2">🇮🇷 تیم ملی ایران در جام جهانی · گروه G</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-x-reverse divide-white/5">

            {/* Iran matches */}
            <div className="p-5 space-y-3">
              <p className="text-xs font-bold text-on-surface-variant/50 mb-3">برنامه بازی‌ها</p>
              {IRAN_SCHEDULE.map((m) => {
                const live = liveWCMatches.find((lm) => isIranMatch(lm) && (lm.team1.includes(m.opponentEn) || lm.team2.includes(m.opponentEn) || lm.team1.includes(m.opponent) || lm.team2.includes(m.opponent)));
                const past = now > new Date(m.utc).getTime() + 2 * 3600000;
                return (
                  <div key={m.id} className={`rounded-xl p-3.5 border ${live ? "bg-green-500/5 border-green-500/20" : past ? "bg-surface-container/60 border-white/5 opacity-70" : "bg-surface-container border-[#3cd7ff]/10"}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm font-black text-[#3cd7ff]">ایران 🇮🇷</span>
                          <span className="text-on-surface-variant/30 text-xs">vs</span>
                          <span className="text-sm font-bold">{m.flag} {m.opponent}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/50 mt-1">{tehranDateFull(m.utc)} · ساعت {tehranTimeStr(m.utc)}</p>
                        <p className="text-[10px] text-on-surface-variant/30">📍 {m.venue}</p>
                      </div>
                      {live ? (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-green-400">{live.score1}</span>
                            <span className="text-on-surface-variant">-</span>
                            <span className="text-2xl font-black text-green-400">{live.score2}</span>
                          </div>
                          <span className="text-[10px] text-green-400 flex items-center gap-1"><LiveDot />{live.minute}</span>
                        </div>
                      ) : past ? (
                        <span className="text-xs text-on-surface-variant/30 bg-surface-container rounded-lg px-2 py-1">پایان یافت</span>
                      ) : (
                        <span className="text-xs text-[#3cd7ff]/60 bg-[#3cd7ff]/5 rounded-lg px-2 py-1 border border-[#3cd7ff]/10">در انتظار</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Group G standings */}
            <div className="p-5">
              <p className="text-xs font-bold text-on-surface-variant/50 mb-3">جدول گروه G</p>
              <StandingsTable
                teams={IRAN_GROUP.teams.map((t, i) => ({ name: t.name, logo: t.flag, rank: i + 1, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }))}
                liveData={iranGroupLive}
              />
            </div>
          </div>
        </section>

        {/* ── UPCOMING & RESULTS MATCHES ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2"><span>📅</span> بازی‌های آینده</h2>
              <div className="space-y-2">
                {upcomingMatches.map((m) => <MatchCard key={m.id} m={m} compact />)}
              </div>
            </section>
          )}
          {recentMatches.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2"><span>📋</span> نتایج اخیر</h2>
              <div className="space-y-2">
                {recentMatches.slice(-8).map((m) => <MatchCard key={m.id} m={m} compact />)}
              </div>
            </section>
          )}
          {upcomingMatches.length === 0 && recentMatches.length === 0 && (
            <div className="md:col-span-2">
              <div className="rounded-xl bg-surface-container border border-white/5 p-8 text-center">
                <p className="text-4xl mb-3">⚽️</p>
                <p className="text-sm font-bold text-on-surface">مسابقات از ۱۱ ژوئن آغاز می‌شود</p>
                <p className="text-xs text-on-surface-variant/50 mt-1">نتایج و برنامه بازی‌ها به‌صورت زنده نمایش داده می‌شود</p>
              </div>
            </div>
          )}
        </div>

        {/* ── ALL GROUP STANDINGS ──────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2"><span>📊</span> جدول گروه‌بندی</h2>

          {/* Group tabs — scrollable */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {WC_GROUPS.map((g, i) => (
              <button key={g.id} onClick={() => setSelGroup(i)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  selGroup === i ? "bg-[#3cd7ff]/15 text-[#3cd7ff] border-[#3cd7ff]/30" : "text-on-surface-variant border-white/5 hover:border-white/20"
                } ${g.id === "G" ? "ring-1 ring-amber-400/30" : ""}`}>
                {g.id === "G" ? `🇮🇷 ${g.name}` : g.name}
              </button>
            ))}
          </div>

          <div className="bg-surface-container rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
              <div className="flex gap-1">
                {WC_GROUPS[selGroup].teams.map((t) => (
                  <span key={t.name} title={t.name} className="text-xl">{t.flag}</span>
                ))}
              </div>
              <h3 className="text-sm font-bold text-on-surface">{WC_GROUPS[selGroup].name}</h3>
            </div>
            <StandingsTable
              teams={WC_GROUPS[selGroup].teams.map((t, i) => ({ name: t.name, logo: t.flag, rank: i + 1, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }))}
              liveData={selectedLiveStandings}
            />
          </div>
        </section>

        {/* ── TOURNAMENT BRACKET ──────────────────────────────────────── */}
        <BracketSection />

        {/* ── WC NEWS ─────────────────────────────────────────────────── */}
        <NewsSection news={news} />

        {/* ── FAQ (SEO) ────────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-on-surface mb-3">سوالات متداول جام جهانی ۲۰۲۶</h2>
          {[
            { q: "جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟", a: "جام جهانی ۲۰۲۶ به میزبانی مشترک ایالات متحده آمریکا، کانادا و مکزیک از ۱۱ ژوئن تا ۱۹ ژوئیه ۲۰۲۶ برگزار می‌شود." },
            { q: "ایران در کدام گروه جام جهانی ۲۰۲۶ است؟", a: "تیم ملی ایران در گروه G قرار دارد. رقبای ایران بلژیک، مصر و نیوزیلند هستند. بازی‌های ایران در لس آنجلس و سیاتل برگزار می‌شود." },
            { q: "برنامه بازی‌های ایران در جام جهانی ۲۰۲۶ چیست؟", a: "ایران در گروه G با نیوزیلند (۱۶ ژوئن - لس آنجلس)، بلژیک (۲۱ ژوئن - لس آنجلس) و مصر (۲۷ ژوئن - سیاتل) بازی می‌کند." },
            { q: "جام جهانی ۲۰۲۶ چند تیم دارد؟", a: "برای اولین بار ۴۸ تیم در قالب ۱۲ گروه چهارتایی شرکت می‌کنند." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium text-on-surface cursor-pointer list-none flex items-center justify-between">
                {q}<span className="text-on-surface-variant group-open:rotate-180 transition-transform text-xs">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-on-surface-variant leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

      </div>
    </div>
  );
}
