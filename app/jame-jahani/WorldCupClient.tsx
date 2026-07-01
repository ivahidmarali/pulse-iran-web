"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { articleHref, articleId } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

// ── Hard-coded WC 2026 data ────────────────────────────────────────────────

const WC_START_UTC = new Date("2026-06-11T19:00:00Z");
const WC_FINAL_UTC = new Date("2026-07-19T20:00:00Z");

const IRAN_SCHEDULE = [
  { id: "ir1", opponent: "نیوزیلند", opponentEn: "New Zealand", flag: "🇳🇿", utc: "2026-06-16T01:00:00Z", venue: "لس آنجلس", iranGoals: 2, oppGoals: 2 },
  { id: "ir2", opponent: "بلژیک",    opponentEn: "Belgium",     flag: "🇧🇪", utc: "2026-06-21T19:00:00Z", venue: "لس آنجلس", iranGoals: 0, oppGoals: 0 },
  { id: "ir3", opponent: "مصر",      opponentEn: "Egypt",       flag: "🇪🇬", utc: "2026-06-27T03:00:00Z", venue: "سیاتل",   iranGoals: 1, oppGoals: 1 },
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
const ALL_TEAMS_FLAGS = Object.fromEntries(WC_GROUPS.flatMap((g) => g.teams.map((t) => [t.name, t.flag])));

// Full group-stage round-1 schedule (UTC). Times from Varzesh3 (Tehran UTC+3:30 → UTC).
const WC_SCHEDULE = [
  { utc: "2026-06-11T19:00:00Z", t1: "مکزیک",        t2: "آفریقای جنوبی", group: "A" },
  { utc: "2026-06-12T02:00:00Z", t1: "کره جنوبی",    t2: "جمهوری چک",    group: "A" },
  { utc: "2026-06-12T19:00:00Z", t1: "کانادا",        t2: "بوسنی",         group: "B" },
  { utc: "2026-06-13T01:00:00Z", t1: "ایالات متحده",  t2: "پاراگوئه",      group: "D" },
  { utc: "2026-06-13T04:00:00Z", t1: "استرالیا",      t2: "ترکیه",         group: "D" },
  { utc: "2026-06-13T19:00:00Z", t1: "قطر",           t2: "سوئیس",         group: "B" },
  { utc: "2026-06-13T22:00:00Z", t1: "برزیل",         t2: "مراکش",         group: "C" },
  { utc: "2026-06-14T01:00:00Z", t1: "هائیتی",        t2: "اسکاتلند",      group: "C" },
  { utc: "2026-06-14T17:00:00Z", t1: "آلمان",         t2: "کوراسائو",      group: "E" },
  { utc: "2026-06-14T20:00:00Z", t1: "هلند",          t2: "ژاپن",          group: "F" },
  { utc: "2026-06-14T23:00:00Z", t1: "ساحل عاج",      t2: "اکوادور",       group: "E" },
  { utc: "2026-06-15T02:00:00Z", t1: "سوئد",          t2: "تونس",          group: "F" },
  { utc: "2026-06-15T16:00:00Z", t1: "اسپانیا",       t2: "کیپ ورد",       group: "H" },
  { utc: "2026-06-15T19:00:00Z", t1: "بلژیک",         t2: "مصر",           group: "G" },
  { utc: "2026-06-15T22:00:00Z", t1: "عربستان",       t2: "اروگوئه",       group: "H" },
  { utc: "2026-06-16T01:00:00Z", t1: "ایران",         t2: "نیوزیلند",      group: "G" },
  { utc: "2026-06-16T04:00:00Z", t1: "اتریش",         t2: "اردن",          group: "J" },
  { utc: "2026-06-16T19:00:00Z", t1: "فرانسه",        t2: "سنگال",         group: "I" },
  { utc: "2026-06-16T22:00:00Z", t1: "عراق",          t2: "نروژ",          group: "I" },
  { utc: "2026-06-17T01:00:00Z", t1: "آرژانتین",      t2: "الجزایر",       group: "J" },
  { utc: "2026-06-17T17:00:00Z", t1: "پرتغال",        t2: "کلمبیا",        group: "K" },
  { utc: "2026-06-17T20:00:00Z", t1: "ازبکستان",      t2: "کنگو",          group: "K" },
  { utc: "2026-06-17T23:00:00Z", t1: "انگلستان",      t2: "پاناما",        group: "L" },
  { utc: "2026-06-18T02:00:00Z", t1: "غنا",           t2: "کرواسی",        group: "L" },
];

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// ── Helpers ────────────────────────────────────────────────────────────────

function isWCLeague(t: string) {
  const s = t.toLowerCase();
  return (s.includes("جام") && s.includes("جهانی")) || (s.includes("world") && s.includes("cup"));
}
function isIranTeam(n: string) { return n === "ایران" || n.toLowerCase() === "iran"; }
function isIranMatch(m: Match) { return isIranTeam(m.team1) || isIranTeam(m.team2); }

function tehranTime(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit" }).format(new Date(utc)); } catch { return ""; }
}
function tehranDate(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", month: "long", day: "numeric" }).format(new Date(utc)); } catch { return ""; }
}
function tehranDateFull(utc: string) {
  if (!utc) return "";
  try { return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", weekday: "long", month: "long", day: "numeric" }).format(new Date(utc)); } catch { return ""; }
}
function relPosted(p: string) {
  const d = Math.floor((Date.now() - new Date(p).getTime()) / 60000);
  const fa = (n: number) => String(n).replace(/\d/g, (c) => "۰۱۲۳۴۵۶۷۸۹"[+c]);
  if (d < 60) return `${fa(d)} دقیقه پیش`;
  if (d < 1440) return `${fa(Math.floor(d / 60))} ساعت پیش`;
  return `${fa(Math.floor(d / 1440))} روز پیش`;
}
const fa2 = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

// ── Shared small components ────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

function TeamLogo({ flag, name, size = 24 }: { flag?: string | null; name: string; size?: number }) {
  if (flag && !flag.startsWith("http")) {
    return <span style={{ fontSize: size }} className="leading-none select-none">{flag}</span>;
  }
  if (flag?.startsWith("http")) {
    return <img src={flag} alt={name} width={size} height={size} className="rounded-full object-contain bg-white/5 shrink-0" loading="lazy" />;
  }
  return (
    <span style={{ width: size, height: size }} className="rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-on-surface-variant shrink-0">
      {name.slice(0, 2)}
    </span>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────

function MatchCard({ m }: { m: Match }) {
  const iran = isIranMatch(m);
  const hasScore = m.score1 !== null && m.score2 !== null;

  return (
    <div className={`rounded-xl border p-3 transition-all ${iran ? "bg-[#3cd7ff]/5 border-[#3cd7ff]/20" : "bg-surface-container border-white/8"}`}>
      <div className="flex items-center gap-2">
        {/* Team 1 */}
        <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
          <span className={`text-sm font-bold truncate ${isIranTeam(m.team1) ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.team1}</span>
          <TeamLogo flag={m.team1_logo ?? ALL_TEAMS_FLAGS[m.team1]} name={m.team1} size={20} />
        </div>
        {/* Score / Time */}
        <div className="flex flex-col items-center shrink-0 min-w-[54px]">
          {hasScore ? (
            <div className="flex items-center gap-1.5">
              <span className={`text-lg font-black tabular-nums leading-none ${m.is_live ? "text-green-400" : "text-on-surface"}`}>{m.score1}</span>
              <span className="text-on-surface-variant/40 text-xs">–</span>
              <span className={`text-lg font-black tabular-nums leading-none ${m.is_live ? "text-green-400" : "text-on-surface"}`}>{m.score2}</span>
            </div>
          ) : (
            <span className="text-sm font-bold text-on-surface-variant tabular-nums">{tehranTime(m.start_utc) || m.match_time || "--:--"}</span>
          )}
          <span className="text-[10px] mt-0.5">
            {m.is_live
              ? <span className="flex items-center gap-1 text-green-400 font-bold"><LiveDot />{m.minute || "زنده"}</span>
              : m.is_final
              ? <span className="text-on-surface-variant/40">پایان</span>
              : <span className="text-on-surface-variant/40">{tehranDate(m.start_utc)}</span>
            }
          </span>
        </div>
        {/* Team 2 */}
        <div className="flex items-center gap-1.5 flex-1 justify-start min-w-0">
          <TeamLogo flag={m.team2_logo ?? ALL_TEAMS_FLAGS[m.team2]} name={m.team2} size={20} />
          <span className={`text-sm font-bold truncate ${isIranTeam(m.team2) ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.team2}</span>
        </div>
      </div>
    </div>
  );
}

// ── Standings table ────────────────────────────────────────────────────────

function StandingsTable({ staticTeams, liveRows }: {
  staticTeams: { name: string; flag: string }[];
  liveRows?: StandingTeam[];
}) {
  const rows: StandingTeam[] = liveRows?.length
    ? liveRows
    : staticTeams.map((t, i) => ({ name: t.name, logo: t.flag, rank: i + 1, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }));

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs min-w-[300px]" dir="rtl">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-right pb-2.5 pr-1 font-medium text-on-surface-variant/40 w-6">#</th>
            <th className="text-right pb-2.5 font-medium text-on-surface-variant/40">تیم</th>
            <th className="text-center pb-2.5 w-8 font-medium text-on-surface-variant/40">ب</th>
            <th className="text-center pb-2.5 w-8 font-medium text-on-surface-variant/40">پ</th>
            <th className="text-center pb-2.5 w-8 font-medium text-on-surface-variant/40">م</th>
            <th className="text-center pb-2.5 w-8 font-medium text-on-surface-variant/40">با</th>
            <th className="text-center pb-2.5 w-12 font-medium text-on-surface-variant/40">گل</th>
            <th className="text-center pb-2.5 w-8 font-medium text-on-surface-variant/40">تف</th>
            <th className="text-center pb-2.5 w-8 font-bold text-[#3cd7ff]/70">ام</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((t, i) => {
            const isIran = t.name === "ایران" || t.name.toLowerCase() === "iran";
            const flag = ALL_TEAMS_FLAGS[t.name] ?? t.logo;
            return (
              <tr key={t.name} className={isIran ? "bg-[#3cd7ff]/5" : ""}>
                <td className="py-2 pr-1">
                  <span className={`font-bold text-xs ${i < 2 ? "text-green-400" : "text-on-surface-variant/30"}`}>{i + 1}</span>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-1.5">
                    <TeamLogo flag={flag} name={t.name} size={16} />
                    <span className={`font-medium ${isIran ? "text-[#3cd7ff] font-bold" : "text-on-surface"}`}>{t.name}</span>
                  </div>
                </td>
                <td className="py-2 text-center tabular-nums text-on-surface-variant/60">{t.played}</td>
                <td className="py-2 text-center tabular-nums text-green-400/70">{t.won}</td>
                <td className="py-2 text-center tabular-nums text-on-surface-variant/40">{t.drawn}</td>
                <td className="py-2 text-center tabular-nums text-red-400/60">{t.lost}</td>
                <td className="py-2 text-center tabular-nums text-on-surface-variant/50">{t.gf}:{t.ga}</td>
                <td className={`py-2 text-center tabular-nums text-xs ${t.gd > 0 ? "text-green-400/70" : t.gd < 0 ? "text-red-400/60" : "text-on-surface-variant/30"}`}>
                  {t.gd > 0 ? `+${t.gd}` : t.gd}
                </td>
                <td className="py-2 text-center font-black text-on-surface tabular-nums">{t.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-1.5 mt-2.5 px-1">
        <span className="w-2 h-2 rounded-sm bg-green-400/40 shrink-0" />
        <span className="text-[10px] text-on-surface-variant/30">دو تیم برتر صعود می‌کنند</span>
      </div>
    </div>
  );
}

// ── Tournament bracket ──────────────────────────────────────────────────────

interface BM { t1: string; t2: string; f1: string; f2: string; s1?: number; s2?: number; pen?: string; upcoming?: boolean; }

const R16: BM[] = [
  { t1: "پاراگوئه",      t2: "آلمان",          f1: "🇵🇾", f2: "🇩🇪", pen: "پاراگوئه" },
  { t1: "فرانسه",        t2: "سوئد",           f1: "🇫🇷", f2: "🇸🇪", s1: 3, s2: 0 },
  { t1: "کانادا",        t2: "آفریقای جنوبی",  f1: "🇨🇦", f2: "🇿🇦", s1: 1, s2: 0 },
  { t1: "مراکش",         t2: "هلند",           f1: "🇲🇦", f2: "🇳🇱", pen: "مراکش" },
  { t1: "بلژیک",         t2: "سنگال",          f1: "🇧🇪", f2: "🇸🇳", s1: 3, s2: 2 },
  { t1: "برزیل",         t2: "ژاپن",           f1: "🇧🇷", f2: "🇯🇵", s1: 2, s2: 1 },
  { t1: "نروژ",          t2: "ساحل عاج",       f1: "🇳🇴", f2: "🇨🇮", s1: 2, s2: 1 },
  { t1: "مکزیک",         t2: "اکوادور",        f1: "🇲🇽", f2: "🇪🇨", s1: 2, s2: 0 },
  { t1: "انگلستان",      t2: "کنگو",           f1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", f2: "🇨🇩", s1: 2, s2: 1 },
  { t1: "پرتغال",        t2: "کرواسی",         f1: "🇵🇹", f2: "🇭🇷", upcoming: true },
  { t1: "اسپانیا",       t2: "اتریش",          f1: "🇪🇸", f2: "🇦🇹", upcoming: true },
  { t1: "ایالات متحده",  t2: "بوسنی",          f1: "🇺🇸", f2: "🇧🇦", upcoming: true },
  { t1: "استرالیا",      t2: "مصر",            f1: "🇦🇺", f2: "🇪🇬", upcoming: true },
  { t1: "سوئیس",         t2: "الجزایر",        f1: "🇨🇭", f2: "🇩🇿", upcoming: true },
  { t1: "کلمبیا",        t2: "غنا",            f1: "🇨🇴", f2: "🇬🇭", upcoming: true },
  { t1: "آرژانتین",      t2: "کیپ ورد",        f1: "🇦🇷", f2: "🇨🇻", upcoming: true },
];

const QF: BM[] = [
  { t1: "پاراگوئه", t2: "فرانسه",   f1: "🇵🇾", f2: "🇫🇷" },
  { t1: "کانادا",   t2: "مراکش",    f1: "🇨🇦", f2: "🇲🇦" },
  { t1: "برزیل",    t2: "نروژ",     f1: "🇧🇷", f2: "🇳🇴" },
  { t1: "مکزیک",    t2: "انگلستان", f1: "🇲🇽", f2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
];

function BracketCard({ m, compact = false }: { m: BM; compact?: boolean }) {
  const done = !m.upcoming;
  const winner = m.pen ?? (m.s1 !== undefined && m.s2 !== undefined ? (m.s1 > m.s2 ? m.t1 : m.t2) : null);
  return (
    <div className={`rounded-xl border p-3 ${done ? "bg-surface-container border-white/8" : "bg-white/2 border-white/5 opacity-70"}`}>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 flex-1 justify-end min-w-0 ${winner === m.t1 ? "opacity-100" : winner ? "opacity-40" : ""}`}>
          <span className="text-sm font-bold truncate text-on-surface">{m.t1}</span>
          <span className="text-lg leading-none">{m.f1}</span>
        </div>
        <div className="flex flex-col items-center shrink-0 min-w-[52px]">
          {m.pen ? (
            <span className="text-[10px] text-on-surface-variant/50 font-bold">پنالتی</span>
          ) : m.s1 !== undefined ? (
            <span className="text-sm font-black text-on-surface tabular-nums">{m.s1}–{m.s2}</span>
          ) : (
            <span className="text-xs text-on-surface-variant/30">vs</span>
          )}
        </div>
        <div className={`flex items-center gap-1.5 flex-1 justify-start min-w-0 ${winner === m.t2 ? "opacity-100" : winner ? "opacity-40" : ""}`}>
          <span className="text-lg leading-none">{m.f2}</span>
          <span className="text-sm font-bold truncate text-on-surface">{m.t2}</span>
        </div>
      </div>
    </div>
  );
}

function BracketSection() {
  const [tab, setTab] = useState<"r16" | "qf">("r16");
  const doneCount = R16.filter((m) => !m.upcoming).length;
  return (
    <section>
      <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
        <span>🏆</span> مرحله حذفی
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {([["r16", `یک شانزدهم (${doneCount}/۱۶)`], ["qf", "یک هشتم (۴ مشخص)"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${tab === key ? "bg-[#3cd7ff]/15 text-[#3cd7ff] border-[#3cd7ff]/30" : "text-on-surface-variant/60 border-white/8 bg-surface-container"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "r16" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {R16.map((m) => <BracketCard key={m.t1 + m.t2} m={m} />)}
        </div>
      )}

      {tab === "qf" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {QF.map((m) => <BracketCard key={m.t1 + m.t2} m={m} />)}
          </div>
          <p className="text-[11px] text-on-surface-variant/30 text-center">
            ۴ جفت دیگر پس از تکمیل یک‌شانزدهم مشخص می‌شوند
          </p>
        </>
      )}
    </section>
  );
}

// ── News section ───────────────────────────────────────────────────────────

function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  return (
    <Link
      href={articleHref(articleId(item), item.title)}
      className="group block rounded-2xl overflow-hidden border border-white/8 bg-surface-container hover:border-[#3cd7ff]/20 transition-all"
    >
      {item.image_url && (
        <div className={`relative overflow-hidden ${large ? "h-52 md:h-64" : "h-36"}`}>
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            loading={large ? "eager" : "lazy"}
            fetchPriority={large ? "high" : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-3 md:p-4">
            <p className={`font-bold text-white leading-snug ${large ? "text-base line-clamp-2" : "text-sm line-clamp-2"}`}>
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-white/50 text-[10px]">{item.source}</span>
              <span className="text-white/30 text-[10px]">·</span>
              <span className="text-white/40 text-[10px]">{relPosted(item.posted_at)}</span>
            </div>
          </div>
        </div>
      )}
      {!item.image_url && (
        <div className={`p-4 ${large ? "py-6" : ""}`}>
          <div className="text-[10px] text-[#3cd7ff]/50 font-bold mb-1.5">⚽ جام جهانی</div>
          <p className={`font-bold text-on-surface group-hover:text-[#3cd7ff] transition-colors leading-relaxed ${large ? "text-base line-clamp-3" : "text-sm line-clamp-3"}`}>
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-on-surface-variant/40 text-[10px]">{item.source}</span>
            <span className="text-on-surface-variant/20 text-[10px]">·</span>
            <span className="text-on-surface-variant/30 text-[10px]">{relPosted(item.posted_at)}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

function NewsSection({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
          <span>📰</span> اخبار جام جهانی
        </h2>
        <div className="rounded-2xl bg-surface-container border border-white/5 p-10 text-center">
          <p className="text-3xl mb-3">📰</p>
          <p className="text-sm text-on-surface-variant/50">اخبار جام جهانی به‌زودی نمایش داده می‌شود</p>
        </div>
      </section>
    );
  }

  const hero = news[0];
  const grid = news.slice(1, 7);
  const more = news.slice(7);

  return (
    <section>
      <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2"><span>📰</span> اخبار جام جهانی</span>
        <Link href="/tag/varzeshi" className="text-[11px] text-[#3cd7ff]/70 hover:text-[#3cd7ff] transition-colors">
          همه اخبار ورزشی ←
        </Link>
      </h2>

      {/* Hero */}
      <NewsCard item={hero} large />

      {/* 3-col grid */}
      {grid.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {grid.map((item) => (
            <NewsCard key={item.item_id} item={item} />
          ))}
        </div>
      )}

      {/* More news — text list */}
      {more.length > 0 && (
        <div className="mt-4 space-y-0 divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {more.map((item) => (
            <Link
              key={item.item_id}
              href={articleHref(articleId(item), item.title)}
              className="flex items-start gap-3 px-4 py-3 bg-surface-container hover:bg-white/3 transition-colors group"
            >
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" loading="lazy" />
              )}
              <div className="min-w-0 flex-1 py-0.5">
                <p className="text-sm font-medium text-on-surface group-hover:text-[#3cd7ff] transition-colors line-clamp-2 leading-relaxed">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-on-surface-variant/40">{item.source}</span>
                  <span className="text-[10px] text-on-surface-variant/20">·</span>
                  <span className="text-[10px] text-on-surface-variant/30">{relPosted(item.posted_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Upcoming matches (hard-coded schedule + live API overlay) ─────────────

interface ScheduleMatch { utc: string; t1: string; t2: string; group: string; }

function ScheduleRow({ m, now }: { m: ScheduleMatch; now: number }) {
  const ms = new Date(m.utc).getTime();
  const isPast = now > ms + 2 * 3600000;
  const isToday = (() => {
    const d = new Date(m.utc);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  })();
  const isTomorrow = (() => {
    const d = new Date(m.utc);
    const t = new Date(); t.setDate(t.getDate() + 1);
    return d.toDateString() === t.toDateString();
  })();
  const hasIran = m.t1 === "ایران" || m.t2 === "ایران";

  return (
    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
      hasIran   ? "bg-[#3cd7ff]/5 border-[#3cd7ff]/20" :
      isPast    ? "opacity-40 bg-white/2 border-white/4" :
                  "bg-surface-container border-white/6 hover:border-white/12"
    }`}>
      {/* Group badge */}
      <span className="text-[10px] font-bold text-on-surface-variant/30 w-4 shrink-0 text-center">{m.group}</span>

      {/* Team 1 */}
      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
        <span className={`text-sm font-bold truncate ${hasIran && m.t1 === "ایران" ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.t1}</span>
        <TeamLogo flag={ALL_TEAMS_FLAGS[m.t1]} name={m.t1} size={18} />
      </div>

      {/* Time / VS */}
      <div className="flex flex-col items-center shrink-0 min-w-[52px]">
        <span className={`text-xs font-black tabular-nums ${isPast ? "text-on-surface-variant/30" : isToday ? "text-amber-400" : "text-on-surface-variant/60"}`}>
          {tehranTime(m.utc)}
        </span>
        <span className={`text-[9px] mt-0.5 ${isToday ? "text-amber-400/80 font-bold" : isTomorrow ? "text-[#3cd7ff]/50" : "text-on-surface-variant/25"}`}>
          {isToday ? "امروز" : isTomorrow ? "فردا" : tehranDate(m.utc)}
        </span>
      </div>

      {/* Team 2 */}
      <div className="flex items-center gap-1.5 flex-1 justify-start min-w-0">
        <TeamLogo flag={ALL_TEAMS_FLAGS[m.t2]} name={m.t2} size={18} />
        <span className={`text-sm font-bold truncate ${hasIran && m.t2 === "ایران" ? "text-[#3cd7ff]" : "text-on-surface"}`}>{m.t2}</span>
      </div>
    </div>
  );
}

function UpcomingSection({ liveUpcoming, liveRecent, now }: { liveUpcoming: Match[]; liveRecent: Match[]; now: number }) {
  const [selDay, setSelDay] = useState(0);

  // When livescore has meaningful data, show that (tournament running).
  if (liveRecent.length > 0 || liveUpcoming.length >= 5) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liveUpcoming.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2"><span>📅</span> بازی‌های پیش رو</h2>
            <div className="space-y-2">{liveUpcoming.map((m) => <MatchCard key={m.id} m={m} />)}</div>
          </section>
        )}
        {liveRecent.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2"><span>📋</span> نتایج اخیر</h2>
            <div className="space-y-2">{liveRecent.map((m) => <MatchCard key={m.id} m={m} />)}</div>
          </section>
        )}
      </div>
    );
  }

  // Pre-tournament or API empty: date-tabbed schedule (shows one day at a time)
  const remaining = WC_SCHEDULE.filter((m) => new Date(m.utc).getTime() > now - 7200000);

  const days: { key: string; label: string; shortLabel: string; matches: ScheduleMatch[] }[] = [];
  const idx: Record<string, number> = {};
  for (const m of remaining) {
    const d = new Date(m.utc);
    const key = new Intl.DateTimeFormat("sv", { timeZone: "Asia/Tehran" }).format(d); // YYYY-MM-DD stable key
    if (idx[key] === undefined) {
      idx[key] = days.length;
      days.push({
        key,
        label: new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", weekday: "long", month: "long", day: "numeric" }).format(d),
        shortLabel: new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", day: "numeric" }).format(d),
        matches: [],
      });
    }
    days[idx[key]].matches.push(m);
  }

  if (days.length === 0) return null;

  const activeDay = Math.min(selDay, days.length - 1);
  const dayData = days[activeDay];

  return (
    <section>
      <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
        <span>📅</span> برنامه مرحله گروهی
      </h2>

      {/* Horizontal date tab strip — one pill per day, horizontally scrollable */}
      <div className="overflow-x-auto -mx-1 px-1 pb-1 mb-3">
        <div className="flex gap-1.5 min-w-max">
          {days.map((d, i) => {
            const hasIran = d.matches.some((m) => m.t1 === "ایران" || m.t2 === "ایران");
            return (
              <button
                key={d.key}
                onClick={() => setSelDay(i)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  activeDay === i
                    ? "bg-[#3cd7ff]/15 text-[#3cd7ff] border-[#3cd7ff]/30"
                    : "text-on-surface-variant/60 border-white/8 bg-surface-container hover:border-white/20 hover:text-on-surface-variant"
                } ${hasIran ? "ring-1 ring-amber-400/30" : ""}`}
              >
                {hasIran && <span className="text-[10px]">🇮🇷</span>}
                <span>{d.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs font-bold text-on-surface-variant/40 mb-2.5">{dayData.label}</p>

      <div className="space-y-1.5">
        {dayData.matches.map((m) => (
          <ScheduleRow key={m.utc + m.t1} m={m} now={now} />
        ))}
      </div>
    </section>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function WorldCupClient({ initialLiveData, initialStandings, initialNews }: Props) {
  const [liveData, setLiveData] = useState<LiveScoreData | null>(initialLiveData);
  const [standings, setStandings] = useState(initialStandings);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selGroup, setSelGroup] = useState(6);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [countdownLabel, setCountdownLabel] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── WC match data ──────────────────────────────────────────────────────
  const allWCMatches = useMemo<Match[]>(() => {
    if (!liveData?.leagues) return [];
    return liveData.leagues.filter((l) => isWCLeague(l.title)).flatMap((l) => l.date_groups.flatMap((dg) => dg.matches));
  }, [liveData]);

  const liveWCMatches = useMemo(() => allWCMatches.filter((m) => m.is_live), [allWCMatches]);
  const recentMatches = useMemo(() => allWCMatches.filter((m) => m.is_final).slice(-6), [allWCMatches]);
  const upcomingMatches = useMemo(() => allWCMatches.filter((m) => !m.is_live && !m.is_final).slice(0, 10), [allWCMatches]);
  const liveIranMatch = useMemo(() => liveWCMatches.find(isIranMatch), [liveWCMatches]);

  // ── Standings map ──────────────────────────────────────────────────────
  const liveGroupMap = useMemo(() => {
    const map: Record<string, StandingTeam[]> = {};
    for (const g of standings?.groups ?? []) map[g.title] = g.teams;
    return map;
  }, [standings]);

  // ── Countdown ──────────────────────────────────────────────────────────
  // Rule: count to WC opening if it hasn't started; then count to Iran's next match
  useEffect(() => {
    const wcStartMs = WC_START_UTC.getTime();

    const getTarget = () => {
      const now = Date.now();
      if (now < wcStartMs) return { ms: wcStartMs, label: "تا آغاز جام جهانی" };
      const next = IRAN_SCHEDULE.find((m) => new Date(m.utc).getTime() > now);
      if (next) return { ms: new Date(next.utc).getTime(), label: `تا بازی ایران – ${next.flag} ${next.opponent}` };
      const finalMs = WC_FINAL_UTC.getTime();
      if (now < finalMs) return { ms: finalMs, label: "تا فینال جام جهانی" };
      return { ms: 0, label: "جام جهانی ۲۰۲۶" };
    };

    const tick = () => {
      const { ms, label } = getTarget();
      setCountdownLabel(label);
      if (ms <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      const diff = ms - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setCountdown({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Polling ────────────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    try { const r = await fetch(`${API_BASE}/livescore`, { cache: "no-store" }); if (r.ok) setLiveData(await r.json()); } catch {}
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
        // Try WC category first, fall back to sports tag
        const r = await fetch(`${API_BASE}/news?category=${encodeURIComponent("🏆")}&per_page=20`, { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          const items: NewsItem[] = d.items ?? [];
          if (items.length > 0) { setNews(items); return; }
        }
        // Fallback: sports category
        const r2 = await fetch(`${API_BASE}/news?category=${encodeURIComponent("⚽")}&per_page=20`, { cache: "no-store" });
        if (r2.ok) { const d2 = await r2.json(); setNews(d2.items ?? []); }
      } catch {}
    })();
  }, []);

  const now = Date.now();
  const wcStarted = now >= WC_START_UTC.getTime();
  const nextIranMatch = IRAN_SCHEDULE.find((m) => new Date(m.utc).getTime() > now);

  const selGroupData = WC_GROUPS[selGroup];
  const selGroupLive = liveGroupMap[selGroupData?.name] ?? [];
  const iranGroupLive = liveGroupMap["گروه G"] ?? [];

  return (
    <div dir="rtl" className="min-h-screen pb-24 md:pb-8">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #071929 0%, #0d1f2d 60%, transparent 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(60,215,255,0.12) 0%, transparent 70%)" }} />
        <div className="relative px-4 md:px-8 py-10 md:py-14 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Left: title + context */}
            <div className="text-center md:text-right flex-1 space-y-3">
              <div className="flex items-center gap-3 justify-center md:justify-end">
                <span className="text-6xl md:text-7xl leading-none">🏆</span>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">جام جهانی ۲۰۲۶</h1>
                  <p className="text-sm text-white/40 mt-1 font-medium">USA · Canada · Mexico</p>
                </div>
              </div>

              {liveIranMatch ? (
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2">
                  <LiveDot />
                  <span className="text-sm font-bold text-green-400">ایران در حال بازی</span>
                  <span className="text-white font-black text-base">{liveIranMatch.score1} – {liveIranMatch.score2}</span>
                </div>
              ) : nextIranMatch ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#3cd7ff]/8 border border-[#3cd7ff]/15 px-4 py-2">
                  <span className="text-sm">🇮🇷</span>
                  <span className="text-sm text-[#3cd7ff]/80">
                    ایران vs {nextIranMatch.flag} {nextIranMatch.opponent} · {tehranDateFull(nextIranMatch.utc)} · {tehranTime(nextIranMatch.utc)}
                  </span>
                </div>
              ) : wcStarted ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-2">
                  <span className="text-sm">🇮🇷</span>
                  <span className="text-sm text-red-400/80">ایران با ۳ تساوی در مرحله گروهی حذف شد · سوم گروه G</span>
                </div>
              ) : (
                <p className="text-sm text-white/40">افتتاحیه: ۱۱ ژوئن ۲۰۲۶</p>
              )}

              {countdownLabel && (
                <p className="text-xs text-white/30 font-medium">{countdownLabel}</p>
              )}
            </div>

            {/* Right: countdown blocks */}
            <div className="flex items-end gap-1.5 shrink-0">
              {([
                { v: countdown.days,  l: "روز"   },
                { v: countdown.hours, l: "ساعت"  },
                { v: countdown.mins,  l: "دقیقه" },
                { v: countdown.secs,  l: "ثانیه" },
              ] as const).map(({ v, l }, i) => (
                <div key={l} className="flex items-center">
                  <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-3 min-w-[58px] backdrop-blur-sm">
                    <span className="text-3xl md:text-4xl font-black text-[#3cd7ff] tabular-nums leading-none">{fa2(v)}</span>
                    <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">{l}</span>
                  </div>
                  {i < 3 && <span className="text-white/20 text-lg font-bold mx-0.5 mb-3">:</span>}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-screen-xl mx-auto mt-6 space-y-10">

        {/* ── LIVE MATCHES ──────────────────────────────────────────── */}
        {liveWCMatches.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
              <LiveDot /> بازی‌های در جریان
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {liveWCMatches.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </section>
        )}

        {/* ── IRAN SPOTLIGHT ────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[#3cd7ff]/15 overflow-hidden bg-surface-container">
          <div className="px-5 py-3.5 border-b border-[#3cd7ff]/10 bg-[#3cd7ff]/5">
            <h2 className="text-sm font-bold text-[#3cd7ff] flex items-center gap-2">
              🇮🇷 تیم ملی ایران · گروه G
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/5">

            {/* Iran schedule */}
            <div className="p-5 space-y-3">
              <p className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-wider mb-4">برنامه بازی‌ها</p>
              {IRAN_SCHEDULE.map((m) => {
                const matchMs = new Date(m.utc).getTime();
                const live = liveWCMatches.find((lm) =>
                  isIranMatch(lm) && (lm.team1.includes(m.opponentEn) || lm.team2.includes(m.opponentEn) || lm.team1 === m.opponent || lm.team2 === m.opponent)
                );
                const finished = now > matchMs + 2 * 3600000;
                const upcoming = !live && !finished;

                return (
                  <div key={m.id} className={`rounded-xl p-4 border transition-all ${
                    live     ? "bg-green-500/8 border-green-500/25" :
                    finished ? "bg-white/3 border-white/5 opacity-60" :
                               "bg-white/3 border-[#3cd7ff]/10"
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-black text-[#3cd7ff] text-sm">ایران 🇮🇷</span>
                          <span className="text-on-surface-variant/30 text-xs">vs</span>
                          <span className="font-bold text-on-surface text-sm">{m.flag} {m.opponent}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/50">{tehranDateFull(m.utc)} · {tehranTime(m.utc)}</p>
                        <p className="text-[10px] text-on-surface-variant/30 mt-0.5">📍 {m.venue}</p>
                      </div>

                      {live ? (
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-2xl font-black text-green-400 leading-none">{live.score1}–{live.score2}</span>
                          <span className="text-[10px] text-green-400 flex items-center gap-1 mt-1"><LiveDot />{live.minute}</span>
                        </div>
                      ) : finished ? (
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-xl font-black text-on-surface/70 leading-none tabular-nums">{m.iranGoals}–{m.oppGoals}</span>
                          <span className="text-[10px] text-on-surface-variant/30 mt-1">پایان</span>
                        </div>
                      ) : upcoming ? (
                        <span className="text-[10px] text-[#3cd7ff]/50 bg-[#3cd7ff]/8 rounded-lg px-2.5 py-1 border border-[#3cd7ff]/10 shrink-0 font-bold">
                          {now < WC_START_UTC.getTime() ? "قبل از جام" : "آینده"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Group G standings */}
            <div className="p-5">
              <p className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-wider mb-4">جدول گروه G</p>
              <StandingsTable
                staticTeams={IRAN_GROUP.teams}
                liveRows={iranGroupLive}
              />
            </div>
          </div>
        </section>

        {/* ── UPCOMING + RESULTS ────────────────────────────────────── */}
        <UpcomingSection
          liveUpcoming={upcomingMatches}
          liveRecent={recentMatches}
          now={now}
        />

        {/* ── ALL GROUPS ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <span>📊</span> جدول گروه‌بندی
          </h2>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {WC_GROUPS.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setSelGroup(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selGroup === i
                    ? "bg-[#3cd7ff]/15 text-[#3cd7ff] border-[#3cd7ff]/30"
                    : "text-on-surface-variant/60 border-white/8 hover:border-white/20 hover:text-on-surface-variant"
                } ${g.id === "G" ? "ring-1 ring-amber-400/30" : ""}`}
              >
                {g.id === "G" ? `🇮🇷 G` : g.id}
              </button>
            ))}
          </div>

          <div className="bg-surface-container rounded-2xl p-4 md:p-5 border border-white/8">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
              <div className="flex gap-1.5">
                {WC_GROUPS[selGroup].teams.map((t) => (
                  <span key={t.name} title={t.name} className="text-lg leading-none">{t.flag}</span>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">{WC_GROUPS[selGroup].name}</h3>
                <p className="text-[11px] text-on-surface-variant/40 mt-0.5">
                  {WC_GROUPS[selGroup].teams.map((t) => t.name).join(" · ")}
                </p>
              </div>
            </div>
            <StandingsTable staticTeams={WC_GROUPS[selGroup].teams} liveRows={selGroupLive} />
          </div>
        </section>

        {/* ── BRACKET ───────────────────────────────────────────────── */}
        <BracketSection />

        {/* ── NEWS ──────────────────────────────────────────────────── */}
        <NewsSection news={news} />

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-on-surface mb-3">سوالات متداول جام جهانی ۲۰۲۶</h2>
          {[
            { q: "جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟", a: "جام جهانی ۲۰۲۶ به میزبانی مشترک ایالات متحده آمریکا، کانادا و مکزیک از ۱۱ ژوئن تا ۱۹ ژوئیه ۲۰۲۶ برگزار می‌شود." },
            { q: "ایران در جام جهانی ۲۰۲۶ چه نتیجه‌ای گرفت؟", a: "تیم ملی ایران در گروه G قرار داشت و با سه تساوی (۲-۲ نیوزیلند، ۰-۰ بلژیک، ۱-۱ مصر) با ۳ امتیاز سوم گروه شد و در مرحله گروهی حذف شد. بلژیک (۵ امتیاز) و مصر (۵ امتیاز) از این گروه صعود کردند." },
            { q: "چه تیم‌هایی از گروه G جام جهانی ۲۰۲۶ صعود کردند؟", a: "بلژیک با ۵ امتیاز (اول) و مصر با ۵ امتیاز (دوم) از گروه G صعود کردند. ایران با ۳ امتیاز سوم شد و نیوزیلند با ۱ امتیاز چهارم." },
            { q: "جام جهانی ۲۰۲۶ چند تیم دارد؟", a: "برای اولین بار ۴۸ تیم در قالب ۱۲ گروه چهارتایی شرکت می‌کنند. ۲ تیم برتر هر گروه و ۸ تیم برتر مرحله سوم به مرحله یک‌شانزدهم می‌روند." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-surface-container rounded-xl border border-white/5 overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium text-on-surface cursor-pointer list-none flex items-center justify-between gap-3">
                <span>{q}</span>
                <span className="text-on-surface-variant/40 group-open:rotate-180 transition-transform text-xs shrink-0">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-on-surface-variant/70 leading-relaxed">{a}</p>
            </details>
          ))}
        </section>

      </div>
    </div>
  );
}
