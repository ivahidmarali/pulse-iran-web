"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
}

interface League {
  title: string;
  matches: Match[];
}

interface LiveScoreData {
  leagues: League[];
  ts: number;
  ok: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

function playGoalDing(ctx: AudioContext) {
  if (ctx.state === "suspended") ctx.resume();
  // Three ascending notes: E5 → G5 → C6
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

function LiveDot() {
  return (
    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
  );
}

function MatchStatus({ match }: { match: Match }) {
  if (match.is_live) {
    return (
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-green-400">
        <LiveDot />
        {match.minute || "زنده"}
      </span>
    );
  }
  if (match.is_final) {
    return <span className="text-[10px] text-on-surface-variant">پایان</span>;
  }
  if (match.match_time) {
    return (
      <span className="text-[10px] text-secondary-fixed-dim font-medium">
        {match.match_time}
      </span>
    );
  }
  if (match.status) {
    return <span className="text-[10px] text-on-surface-variant">{match.status}</span>;
  }
  return null;
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
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
      {/* Home (right in RTL) */}
      <div className="flex items-center gap-2 min-w-0">
        <TeamLogo src={match.team1_logo} alt={match.team1} />
        <span className="text-sm font-medium text-on-surface truncate leading-tight">
          {match.team1}
        </span>
      </div>

      {/* Center: score or kick-off time */}
      <div className="flex flex-col items-center gap-0.5 px-1">
        {isUpcoming ? (
          <span className="text-sm font-bold text-secondary-fixed-dim tabular-nums">
            {match.match_time || "—"}
          </span>
        ) : (
          <span
            className={`text-base font-bold tabular-nums ${
              match.is_live ? "text-on-surface" : "text-on-surface-variant"
            }`}
          >
            {match.score1} - {match.score2}
          </span>
        )}
        <MatchStatus match={match} />
        {isGoal && (
          <span className="text-[10px] font-bold text-green-400 animate-bounce mt-0.5">
            ⚽ گل!
          </span>
        )}
      </div>

      {/* Away (left in RTL) */}
      <div className="flex items-center gap-2 justify-end min-w-0">
        <span className="text-sm font-medium text-on-surface truncate leading-tight text-right">
          {match.team2}
        </span>
        <TeamLogo src={match.team2_logo} alt={match.team2} />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-8 bg-white/5" />
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

export default function LiveScoreClient() {
  const [data, setData] = useState<LiveScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "finished">("all");
  const [goalIds, setGoalIds] = useState<Set<number>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const prevScores = useRef<Map<number, [number, number]>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isFirstLoad = useRef(true);

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
        for (const match of league.matches) {
          if (match.score1 == null || match.score2 == null) continue;
          const prev = prevScores.current.get(match.id);
          if (prev && !isFirstLoad.current) {
            if (match.score1 > prev[0] || match.score2 > prev[1]) {
              newGoalIds.push(match.id);
            }
          }
          prevScores.current.set(match.id, [match.score1, match.score2]);
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

  const allMatches = data?.leagues.flatMap((l) => l.matches) ?? [];
  const liveCount = allMatches.filter((m) => m.is_live).length;

  const filteredLeagues = (data?.leagues ?? [])
    .map((league) => ({
      ...league,
      matches: league.matches.filter((m) => {
        if (filter === "live") return m.is_live;
        if (filter === "finished") return m.is_final;
        return true;
      }),
    }))
    .filter((l) => l.matches.length > 0);

  return (
    <div className="max-w-2xl mx-auto px-container-margin pt-4 pb-24 md:pb-10 md:pt-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-on-surface flex items-center gap-2">
          نتایج زنده
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-normal text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full">
              <LiveDot />
              {liveCount} زنده
            </span>
          )}
        </h1>

        {/* Sound toggle */}
        <button
          onClick={soundEnabled ? undefined : enableSound}
          title={soundEnabled ? "صدای اعلان گل فعال است" : "برای فعال‌سازی صدای گل کلیک کنید"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            soundEnabled
              ? "bg-secondary-fixed-dim/15 text-secondary-fixed-dim cursor-default"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
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

      {/* Filter chips */}
      <div className="flex gap-2 mb-5">
        {(
          [
            ["all", "همه"],
            ["live", "زنده"],
            ["finished", "پایان‌یافته"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === val
                ? "bg-secondary-fixed-dim text-background font-bold"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {val === "live" && liveCount > 0 ? `زنده (${liveCount})` : label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredLeagues.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <p className="text-5xl mb-4">⚽</p>
          <p className="text-sm">
            {filter === "live"
              ? "در حال حاضر بازی زنده‌ای در جریان نیست"
              : filter === "finished"
              ? "هنوز بازی پایان‌یافته‌ای وجود ندارد"
              : "نتیجه‌ای برای امروز ثبت نشده"}
          </p>
          <p className="text-xs mt-2 text-on-surface-variant/60">
            صفحه هر ۳۰ ثانیه به‌روز می‌شود
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredLeagues.map((league) => (
            <div key={league.title} className="glass-card rounded-2xl overflow-hidden">
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                <span className="text-xs font-bold text-secondary-fixed-dim">🏆</span>
                <span className="text-xs font-bold text-on-surface-variant">
                  {league.title}
                </span>
                {league.matches.some((m) => m.is_live) && (
                  <span className="mr-auto">
                    <LiveDot />
                  </span>
                )}
              </div>
              {league.matches.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  isGoal={goalIds.has(match.id)}
                />
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
