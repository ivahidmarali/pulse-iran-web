"use client";

import Link from "next/link";
import { useState } from "react";
import type { LatestBriefings } from "@/lib/types";

interface Props {
  briefings: LatestBriefings;
}

export default function DailyBriefingCard({ briefings }: Props) {
  const [active, setActive] = useState<"nightly" | "morning">(
    briefings.nightly ? "nightly" : "morning"
  );

  const current = briefings[active];
  if (!briefings.morning && !briefings.nightly) return null;

  // Convert YYYY-MM-DD to Persian display date
  function persianDate(iso: string) {
    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Tehran",
      }).format(new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "T00:00:00"));
    } catch {
      return iso;
    }
  }

  // Parse numbered list (e.g. "1. headline\n2. headline") into items
  function parseLines(text: string): string[] {
    return text
      .split("\n")
      .map((l) => l.replace(/^[\d۰-۹]+[.\-\)]\s*/, "").trim())
      .filter((l) => l.length > 4);
  }

  const lines = current ? parseLines(current.content) : [];

  return (
    <section className="bg-surface-container-low p-gutter rounded-xl" aria-label="خلاصه روز">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-title-md text-title-md">خلاصه روز</h2>
        <Link
          href="/briefings"
          className="text-[11px] text-secondary-fixed-dim/70 hover:text-secondary-fixed-dim transition-colors"
        >
          همه ←
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {briefings.nightly && (
          <button
            onClick={() => setActive("nightly")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              active === "nightly"
                ? "bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30"
                : "text-on-surface-variant/60 hover:text-on-surface-variant"
            }`}
          >
            🌙 شبانه
          </button>
        )}
        {briefings.morning && (
          <button
            onClick={() => setActive("morning")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              active === "morning"
                ? "bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30"
                : "text-on-surface-variant/60 hover:text-on-surface-variant"
            }`}
          >
            ☀️ صبحگاهی
          </button>
        )}
      </div>

      {/* Date */}
      {current && (
        <p className="text-[10px] text-on-surface-variant/40 mb-3 text-right">
          {persianDate(current.date)}
        </p>
      )}

      {/* Headlines list */}
      <ol className="space-y-2.5" dir="rtl">
        {lines.slice(0, 6).map((line, i) => (
          <li key={i} className="flex gap-2 items-start group">
            <span className="text-secondary-fixed-dim/30 font-black text-sm shrink-0 mt-0.5 group-hover:text-secondary-fixed-dim transition-colors">
              {(i + 1).toLocaleString("fa-IR")}
            </span>
            <p className="text-sm leading-relaxed text-on-surface/80 group-hover:text-on-surface transition-colors">
              {line}
            </p>
          </li>
        ))}
      </ol>

      <Link
        href="/briefings"
        className="block w-full mt-4 py-2 border border-secondary-fixed-dim/30 text-secondary-fixed-dim rounded-lg text-xs font-bold hover:bg-secondary-fixed-dim/10 transition-colors text-center"
      >
        مشاهده همه خلاصه‌ها
      </Link>
    </section>
  );
}
