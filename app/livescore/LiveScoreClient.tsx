"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Match {
  id: number;
  team1: string;
  team2: string;
  team1_logo?: string | null;
  team2_logo?: string | null;
  score1: number | null;
  score2: number | null;
  minute: string;
  status: string;
  status_code: number;
  is_live: boolean;
  is_final: boolean;
  match_time: string;
  start_utc: string;
}

interface DateGroup {
  jalali_key: string;   // "1405/03/14"
  date_label: string;   // "14 خرداد 1405"
  matches: Match[];
}

interface League {
  title: string;
  date_groups: DateGroup[];
}

interface LiveScoreData {
  leagues: League[];
  ts: number;
  ok: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const TEHRAN_MS = (3 * 60 + 30) * 60 * 1000; // UTC+3:30

function tehranDateKey(utcIso: string): string {
  // Returns "YYYY-MM-DD" in Tehran time
  if (!utcIso) return "";
  return new Date(new Date(utcIso).getTime() + TEHRAN_MS).toISOString().slice(0, 10);
}

function todayTehranKey(): string {
  return new Date(Date.now() + TEHRAN_MS).toISOString().slice(0, 10);
}

function relativeLabel(gregorianKey: string): string {
  const today = todayTehranKey();
  const diff = Math.round(
    (new Date(gregorianKey).getTime() - new Date(today).getTime()) / 86_400_000
  );
  if (diff === -2) return "پریروز";
  if (diff === -1) return "دیروز";
  if (diff === 0) return "امروز";
  if (diff === 1) return "فردا";
  if (diff === 2) return "پس‌فردا";
  return "";
}

function playGoalDing(ctx: AudioContext) {
  if (ctx.state === "suspended") ctx.resume();
  [659.25, 783.99, 1046.5].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.14;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}

function LiveDot({ sm }: { sm?: boolean }) {
  return (
    <span
      className={`inline-block ${sm ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full bg-green-400 animate-pulse`}
    />
  );
}

function MatchStatus({ match }: { match: Match }) {
  if (match.is_live) {
    return (
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-green-400">
        <LiveDot sm />
        {match.minute || "زنده"}
      </span>
    );
  }
  if (match.is_final) return <span className="text-[10px] text-on-surface-variant">پایان</span>;
  if (match.match_time) {
    return <span className="text-[10px] text-secondary-fixed-dim font-medium">{match.match_time}</span>;
  }
  if (match.status) return <span className="text-[10px] text-on-surface-variant">{match.status}</span>;
  return null;
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className="w-6 h-6 object-contain shrink-0"
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function MatchRow({ match, isGoal }: { match: Match; isGoal: boolean }) {
  const isUpcoming = !match.is_live && !match.is_final;
  return (
    <div
      className={`grid grid-cols-[1fr_76px_1fr] items-center px-3 py-3 border-b border-white/5 last:border-0 transition-colors duration-700 ${
        isGoal ? "bg-green-500/15" : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <TeamLogo src={match.team1_logo} alt={match.team1} />
        <span className="text-sm font-medium text-on-surface truncate leading-tight">{match.team1}</span>
      </div>

      <div className="flex flex-col items-center gap-0.5 px-1">
        {isUpcoming ? (
          <span className="text-sm font-bold text-secondary-fixed-dim tabular-nums">
            {match.match_time || "—"}
          </span>
        ) : (
          <span className={`text-base font-bold tabular-nums ${match.is_live ? "text-on-surface" : "text-on-surface-variant"}`}>
            {match.score1} - {match.score2}
          </span>
        )}
        <MatchStatus match={match} />
        {isGoal && (
          <span className="text-[10px] font-bold text-green-400 animate-bounce mt-0.5">⚽ گل!</span>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end min-w-0">
        <span className="text-sm font-medium text-on-surface truncate leading-tight text-right">{match.team2}</span>
        <TeamLogo src={match.team2_logo} alt={match.team2} />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-8 bg-white/5" />
      <div className="h-7 bg-white/[0.03] border-b border-white/5" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 border-b border-white/5 flex items-center px-4 gap-3">
          <div className="flex-1 h-3 bg-white/10 rounded" />
          <div className="w-12 h-4 bg-white/10 rounded mx-2" />
          <div className="flex-1 h-3 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

function useTehranClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const t = new Date(Date.now() + TEHRAN_MS);
      setClock(
        `${t.getUTCHours().toString().padStart(2, "0")}:${t.getUTCMinutes().toString().padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export default function LiveScoreClient() {
  const [data, setData] = useState<LiveScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(""); // gregorian key or ""=all
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "finished">("all");
  const [goalIds, setGoalIds] = useState<Set<number>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const prevScores = useRef<Map<number, [number, number]>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isFirstLoad = useRef(true);
  const clock = useTehranClock();

  const enableSound = useCallback(() => {
    try {
      audioCtxRef.current = new (
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext
      )();
      setSoundEnabled(true);
    } catch {}
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/livescore`, { cache: "no-store" });
      if (!res.ok) return;
      const json: LiveScoreData = await res.json();

      const newGoalIds: number[] = [];
      for (const league of json.leagues) {
        for (const dg of league.date_groups) {
          for (const match of dg.matches) {
            if (match.score1 == null || match.score2 == null) continue;
            const prev = prevScores.current.get(match.id);
            if (prev && !isFirstLoad.current) {
              if (match.score1 > prev[0] || match.score2 > prev[1]) newGoalIds.push(match.id);
            }
            prevScores.current.set(match.id, [match.score1, match.score2]);
          }
        }
      }

      if (newGoalIds.length > 0) {
        if (audioCtxRef.current) playGoalDing(audioCtxRef.current);
        setGoalIds(new Set(newGoalIds));
        setTimeout(() => setGoalIds(new Set()), 4500);
      }

      isFirstLoad.current = false;
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString("fa-IR"));

      // Auto-select "today" on first load
      setSelectedDay((prev) => {
        if (prev !== "") return prev;
        const today = todayTehranKey();
        const hasToday = json.leagues.some((l) =>
          l.date_groups.some((dg) =>
            dg.matches.some((m) => tehranDateKey(m.start_utc) === today)
          )
        );
        return hasToday ? today : "";
      });
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Build sorted unique day list from data
  const days = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, string>(); // gregorianKey → date_label
    for (const league of data.leagues) {
      for (const dg of league.date_groups) {
        for (const m of dg.matches) {
          const key = tehranDateKey(m.start_utc);
          if (key && !map.has(key)) map.set(key, dg.date_label);
        }
      }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, label]) => ({ key, label, rel: relativeLabel(key) }));
  }, [data]);

  // Flatten for counts
  const allMatches = data?.leagues.flatMap((l) => l.date_groups.flatMap((dg) => dg.matches)) ?? [];
  const liveCount = allMatches.filter((m) => m.is_live).length;

  // Today's Jalali label for the top banner
  const todayLabel = days.find((d) => d.key === todayTehranKey())?.label ?? "";

  // Apply both filters
  const filteredLeagues = (data?.leagues ?? [])
    .map((league) => ({
      ...league,
      date_groups: league.date_groups
        .map((dg) => ({
          ...dg,
          matches: dg.matches.filter((m) => {
            const dayMatch = !selectedDay || tehranDateKey(m.start_utc) === selectedDay;
            const statusMatch =
              statusFilter === "live" ? m.is_live :
              statusFilter === "finished" ? m.is_final : true;
            return dayMatch && statusMatch;
          }),
        }))
        .filter((dg) => dg.matches.length > 0),
    }))
    .filter((l) => l.date_groups.length > 0);

  return (
    <div className="max-w-2xl mx-auto px-container-margin pt-4 pb-24 md:pb-10 md:pt-8">

      {/* ── Tehran clock + date banner ── */}
      <div className="glass-card rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-on-surface-variant mb-0.5">ساعت تهران</p>
          <p className="text-2xl font-bold text-secondary-fixed-dim tabular-nums tracking-tight">
            {clock || "—:—"}
          </p>
        </div>
        {todayLabel && (
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant mb-0.5">امروز</p>
            <p className="text-sm font-bold text-on-surface">{todayLabel}</p>
          </div>
        )}
      </div>

      {/* ── Title row ── */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
          نتایج زنده
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-normal text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full">
              <LiveDot sm />
              {liveCount} زنده
            </span>
          )}
        </h1>
        <button
          onClick={soundEnabled ? undefined : enableSound}
          title={soundEnabled ? "صدای اعلان گل فعال است" : "برای فعال‌سازی صدای گل کلیک کنید"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            soundEnabled
              ? "bg-secondary-fixed-dim/15 text-secondary-fixed-dim cursor-default"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
          }`}
        >
          {soundEnabled ? "🔔 صدا فعال" : "🔕 فعال‌سازی صدا"}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-on-surface-variant mb-3">
          آخرین به‌روزرسانی: {lastUpdated} · هر ۳۰ ثانیه
        </p>
      )}

      {/* ── Day selector tabs ── */}
      {days.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedDay("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedDay === ""
                ? "bg-secondary-fixed-dim text-background font-bold"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            همه روزها
          </button>
          {days.map(({ key, label, rel }) => (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedDay === key
                  ? "bg-secondary-fixed-dim text-background font-bold"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {rel === "امروز" && selectedDay !== key && (
                <LiveDot sm />
              )}
              {rel || label}
              {rel && rel !== label && (
                <span className={`text-[10px] opacity-70 ${selectedDay === key ? "" : ""}`}>
                  {label.split(" ").slice(0, 2).join(" ")}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Status chips ── */}
      <div className="flex gap-2 mb-5">
        {([["all", "همه"], ["live", "زنده"], ["finished", "پایان‌یافته"]] as const).map(
          ([val, label]) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === val
                  ? "bg-white/15 text-on-surface font-bold ring-1 ring-white/20"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {val === "live" && liveCount > 0 ? `زنده (${liveCount})` : label}
            </button>
          )
        )}
      </div>

      {/* ── Match cards ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredLeagues.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <p className="text-5xl mb-4">⚽</p>
          <p className="text-sm">
            {statusFilter === "live"
              ? "در حال حاضر بازی زنده‌ای در جریان نیست"
              : statusFilter === "finished"
              ? "هنوز بازی پایان‌یافته‌ای وجود ندارد"
              : "بازی‌ای برای این روز ثبت نشده"}
          </p>
          <p className="text-xs mt-2 text-on-surface-variant/60">
            صفحه هر ۳۰ ثانیه به‌روز می‌شود
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredLeagues.map((league) => (
            <div key={league.title} className="glass-card rounded-2xl overflow-hidden">
              {/* League header */}
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                <span className="text-xs font-bold text-secondary-fixed-dim">🏆</span>
                <span className="text-xs font-bold text-on-surface-variant">{league.title}</span>
                {league.date_groups.some((dg) => dg.matches.some((m) => m.is_live)) && (
                  <span className="mr-auto"><LiveDot sm /></span>
                )}
              </div>

              {/* Date sub-groups — only shown when "همه روزها" is active */}
              {league.date_groups.map((dg) => (
                <div key={dg.jalali_key}>
                  {/* Date subheader: show when multiple days or "all days" selected */}
                  {(!selectedDay || league.date_groups.length > 1) && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border-b border-white/5">
                      {(() => {
                        const rel = relativeLabel(tehranDateKey(dg.matches[0]?.start_utc ?? ""));
                        return (
                          <>
                            {rel && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                rel === "امروز"
                                  ? "bg-secondary-fixed-dim/20 text-secondary-fixed-dim"
                                  : "bg-white/5 text-on-surface-variant"
                              }`}>
                                {rel}
                              </span>
                            )}
                            <span className="text-[10px] text-on-surface-variant">{dg.date_label}</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {dg.matches.map((match) => (
                    <MatchRow key={match.id} match={match} isGoal={goalIds.has(match.id)} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-on-surface-variant/50 text-center mt-8">
        داده‌ها از ورزش۳ — پالس ایران
      </p>
    </div>
  );
}
