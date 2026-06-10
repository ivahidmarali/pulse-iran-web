"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

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
  has_details: boolean;
}

interface DateGroup {
  jalali_key: string;
  date_label: string;
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

interface MatchEvent {
  type: "goal" | "card" | "sub" | "other";
  time: string;
  raw_time: number;
  side: number;           // 0=home 1=away
  scope: number;
  scope_label: string;
  // goal
  goal_type?: number;     // 0=normal 1=own 2=penalty
  player?: string;
  score?: { host: number; guest: number } | null;
  // card
  card_type?: number;     // 1=yellow 2=red 3=yellow→red
  // sub
  player_in?: string;
  player_out?: string;
  // other
  description?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const API_BASE   = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const TEHRAN_MS  = (3 * 60 + 30) * 60 * 1000;

// ── Utilities ──────────────────────────────────────────────────────────────

function tehranDateKey(utcIso: string): string {
  if (!utcIso) return "";
  return new Date(new Date(utcIso).getTime() + TEHRAN_MS).toISOString().slice(0, 10);
}

function todayTehranKey(): string {
  return new Date(Date.now() + TEHRAN_MS).toISOString().slice(0, 10);
}

function relativeLabel(gregorianKey: string): string {
  const diff = Math.round(
    (new Date(gregorianKey).getTime() - new Date(todayTehranKey()).getTime()) / 86_400_000
  );
  return diff === -2 ? "پریروز" : diff === -1 ? "دیروز" : diff === 0 ? "امروز" : diff === 1 ? "فردا" : diff === 2 ? "پس‌فردا" : "";
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

// ── Small shared components ────────────────────────────────────────────────

function LiveDot({ sm }: { sm?: boolean }) {
  return (
    <span className={`inline-block ${sm ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full bg-green-400 animate-pulse`} />
  );
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img src={src} alt={alt} className="w-6 h-6 object-contain shrink-0" loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
  );
}

function MatchStatus({ match }: { match: Match }) {
  if (match.is_live)
    return (
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-green-400">
        <LiveDot sm />{match.minute || "زنده"}
      </span>
    );
  if (match.is_final)   return <span className="text-[10px] text-on-surface-variant">پایان</span>;
  if (match.match_time) return <span className="text-[10px] text-secondary-fixed-dim font-medium">{match.match_time}</span>;
  if (match.status)     return <span className="text-[10px] text-on-surface-variant">{match.status}</span>;
  return null;
}

// ── Event timeline ─────────────────────────────────────────────────────────

function goalIcon(goalType?: number) {
  if (goalType === 1) return "⚽"; // own goal — same icon, label below
  if (goalType === 2) return "⚽"; // penalty
  return "⚽";
}

function goalLabel(goalType?: number) {
  if (goalType === 1) return <span className="text-[9px] text-red-400">به خودی</span>;
  if (goalType === 2) return <span className="text-[9px] text-secondary-fixed-dim">پنالتی</span>;
  return null;
}

function cardIcon(cardType?: number) {
  if (cardType === 2) return "🟥";
  if (cardType === 3) return "🟥";
  return "🟨";
}

function EventRow({ event }: { event: MatchEvent }) {
  const isHome = event.side === 0;

  const homeContent =
    isHome ? (
      <div className="flex flex-col items-start gap-0.5">
        {event.type === "goal" && (
          <>
            <span className="text-sm leading-tight">
              {goalIcon(event.goal_type)} {event.player}
            </span>
            {goalLabel(event.goal_type)}
            {event.score && (
              <span className="text-[10px] text-secondary-fixed-dim font-bold tabular-nums">
                {event.score.host} - {event.score.guest}
              </span>
            )}
          </>
        )}
        {event.type === "card" && (
          <span className="text-sm">{cardIcon(event.card_type)} {event.player}</span>
        )}
        {event.type === "sub" && (
          <div className="text-[11px] leading-tight">
            <span className="text-green-400">↑ {event.player_in}</span>
            <br />
            <span className="text-red-400/70">↓ {event.player_out}</span>
          </div>
        )}
        {event.type === "other" && (
          <span className="text-[11px] text-on-surface-variant">{event.description}</span>
        )}
      </div>
    ) : null;

  const awayContent =
    !isHome ? (
      <div className="flex flex-col items-end gap-0.5">
        {event.type === "goal" && (
          <>
            <span className="text-sm leading-tight">
              {event.player} {goalIcon(event.goal_type)}
            </span>
            {goalLabel(event.goal_type)}
            {event.score && (
              <span className="text-[10px] text-secondary-fixed-dim font-bold tabular-nums">
                {event.score.host} - {event.score.guest}
              </span>
            )}
          </>
        )}
        {event.type === "card" && (
          <span className="text-sm">{event.player} {cardIcon(event.card_type)}</span>
        )}
        {event.type === "sub" && (
          <div className="text-[11px] leading-tight text-right">
            <span className="text-green-400">{event.player_in} ↑</span>
            <br />
            <span className="text-red-400/70">{event.player_out} ↓</span>
          </div>
        )}
        {event.type === "other" && (
          <span className="text-[11px] text-on-surface-variant">{event.description}</span>
        )}
      </div>
    ) : null;

  return (
    <div className="grid grid-cols-[1fr_36px_1fr] items-start gap-x-1 px-3 py-1.5">
      <div className="min-w-0">{homeContent}</div>
      <div className="text-center text-[10px] text-on-surface-variant/70 tabular-nums pt-0.5">
        {event.time}&apos;
      </div>
      <div className="min-w-0 flex justify-end">{awayContent}</div>
    </div>
  );
}

function ScopeDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-[9px] text-on-surface-variant/50 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function EventTimeline({
  events,
  loading,
}: {
  events: MatchEvent[] | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="px-4 py-3 border-t border-white/5 space-y-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="flex-1 h-3 bg-white/10 rounded" />
            <div className="w-8 h-3 bg-white/10 rounded" />
            <div className="flex-1 h-3 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="px-4 py-3 border-t border-white/5 text-center text-xs text-on-surface-variant">
        جزئیاتی موجود نیست
      </div>
    );
  }

  // Inject scope dividers when scope changes
  type Row = { kind: "event"; event: MatchEvent } | { kind: "divider"; label: string };
  const rows: Row[] = [];
  let currentScope = -1;
  for (const event of events) {
    if (event.scope !== currentScope && event.scope_label) {
      rows.push({ kind: "divider", label: event.scope_label });
      currentScope = event.scope;
    }
    rows.push({ kind: "event", event });
  }

  // Separate goals from other events for the summary header
  const goals = events.filter((e) => e.type === "goal");

  return (
    <div className="border-t border-white/5">
      {/* Goal scorers summary (if any goals) */}
      {goals.length > 0 && (
        <div className="flex gap-2 px-3 py-2 bg-white/[0.02] border-b border-white/5 flex-wrap">
          {goals.map((g, i) => (
            <span key={i} className="text-[11px] text-on-surface-variant">
              ⚽ {g.player}{g.goal_type === 2 ? " (پ)" : g.goal_type === 1 ? " (خودی)" : ""} {g.time}&apos;
            </span>
          ))}
        </div>
      )}
      {/* Timeline */}
      {rows.map((row, i) =>
        row.kind === "divider" ? (
          <ScopeDivider key={`d-${i}`} label={row.label} />
        ) : (
          <EventRow key={row.event.time + row.event.side + row.event.type + i} event={row.event} />
        )
      )}
    </div>
  );
}

// ── Match card (row + expandable detail) ─────────────────────────────────

function MatchCard({ match, isGoal }: { match: Match; isGoal: boolean }) {
  const [expanded, setExpanded]     = useState(false);
  const [events, setEvents]         = useState<MatchEvent[] | null>(null);
  const [loadingEvt, setLoadingEvt] = useState(false);

  const toggle = async () => {
    if (!match.has_details) return;
    const next = !expanded;
    setExpanded(next);
    if (next && events === null) {
      setLoadingEvt(true);
      try {
        const res = await fetch(`${API_BASE}/livescore/match/${match.id}/events`, { cache: "no-store" });
        const data = await res.json();
        setEvents(data.events ?? []);
      } catch {
        setEvents([]);
      }
      setLoadingEvt(false);
    }
  };

  const isUpcoming = !match.is_live && !match.is_final;

  return (
    <div>
      {/* Match row */}
      <div
        onClick={toggle}
        className={`grid grid-cols-[1fr_76px_1fr] items-center px-3 py-3 border-b border-white/5 transition-colors duration-700 ${
          isGoal ? "bg-green-500/15" : ""
        } ${match.has_details ? "cursor-pointer hover:bg-white/[0.03] active:bg-white/[0.05]" : ""}`}
      >
        {/* Home team */}
        <div className="flex items-center gap-2 min-w-0">
          <TeamLogo src={match.team1_logo} alt={match.team1} />
          <span className="text-sm font-medium text-on-surface truncate leading-tight">{match.team1}</span>
        </div>

        {/* Score / time */}
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

        {/* Away team */}
        <div className="flex items-center gap-2 justify-end min-w-0">
          <span className="text-sm font-medium text-on-surface truncate leading-tight text-right">{match.team2}</span>
          <TeamLogo src={match.team2_logo} alt={match.team2} />
          {match.has_details && (
            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 shrink-0 text-on-surface-variant/40 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </div>
      </div>

      {/* Expandable event timeline */}
      {expanded && (
        <EventTimeline events={events} loading={loadingEvt} />
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────

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

// ── Tehran clock hook ─────────────────────────────────────────────────────

function useTehranClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const t = new Date(Date.now() + TEHRAN_MS);
      setClock(`${t.getUTCHours().toString().padStart(2, "0")}:${t.getUTCMinutes().toString().padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LiveScoreClient({ initialData }: { initialData?: LiveScoreData | null }) {
  const [data, setData]             = useState<LiveScoreData | null>(initialData ?? null);
  const [loading, setLoading]       = useState(!initialData);
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "finished">("all");
  const [goalIds, setGoalIds]       = useState<Set<number>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastUpdated, setLastUpdated]   = useState("");

  const prevScores  = useRef<Map<number, [number, number]>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isFirstLoad = useRef(true);
  const clock       = useTehranClock();

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
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const allMatches = data?.leagues.flatMap((l) => l.date_groups.flatMap((dg) => dg.matches)) ?? [];
  const liveCount  = allMatches.filter((m) => m.is_live).length;

  const todayLabel = useMemo(
    () =>
      data?.leagues
        .flatMap((l) => l.date_groups)
        .find((dg) => relativeLabel(tehranDateKey(dg.matches[0]?.start_utc ?? "")) === "امروز")
        ?.date_label ?? "",
    [data]
  );

  const filteredLeagues = useMemo(
    () =>
      (data?.leagues ?? [])
        .map((league) => ({
          ...league,
          date_groups: league.date_groups
            .map((dg) => ({
              ...dg,
              matches: dg.matches.filter((m) =>
                statusFilter === "live"     ? m.is_live
              : statusFilter === "finished" ? m.is_final
              : true
              ),
            }))
            .filter((dg) => dg.matches.length > 0),
        }))
        .filter((l) => l.date_groups.length > 0),
    [data, statusFilter]
  );

  return (
    <div className="max-w-2xl mx-auto px-container-margin pt-4 pb-24 md:pb-10 md:pt-8">

      {/* Tehran clock banner */}
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

      {/* Title + sound toggle */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
          نتایج زنده
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-normal text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full">
              <LiveDot sm />{liveCount} زنده
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

      {/* Status chips */}
      <div className="flex gap-2 mb-5">
        {([["all", "همه"], ["live", "زنده"], ["finished", "پایان‌یافته"]] as const).map(([val, label]) => (
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
        ))}
      </div>

      {/* Match cards */}
      {loading ? (
        <div className="flex flex-col gap-3"><SkeletonCard /><SkeletonCard /></div>
      ) : filteredLeagues.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <p className="text-5xl mb-4">⚽</p>
          <p className="text-sm">
            {statusFilter === "live" ? "در حال حاضر بازی زنده‌ای در جریان نیست"
             : statusFilter === "finished" ? "هنوز بازی پایان‌یافته‌ای وجود ندارد"
             : "بازی‌ای برای این روز ثبت نشده"}
          </p>
          <p className="text-xs mt-2 text-on-surface-variant/60">صفحه هر ۳۰ ثانیه به‌روز می‌شود</p>
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
              {/* Date groups */}
              {league.date_groups.map((dg) => (
                <div key={dg.jalali_key}>
                  {league.date_groups.length > 1 && (
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
                              }`}>{rel}</span>
                            )}
                            <span className="text-[10px] text-on-surface-variant">{dg.date_label}</span>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {dg.matches.map((match) => (
                    <MatchCard key={match.id} match={match} isGoal={goalIds.has(match.id)} />
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
