export default function Loading() {
  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* ── Mobile skeleton ── */}
      <div className="md:hidden">
        <div className="h-16 bg-surface-container-low border-b border-white/5" />
        <div className="h-10 bg-surface-container-low border-b border-white/5" />

        <div className="px-container-margin pb-24 pt-2 space-y-4">
          {/* Hero */}
          <div className="aspect-[16/9] rounded-xl bg-surface-container animate-pulse mt-3" />

          {/* Prices grid */}
          <div className="space-y-3">
            <div className="h-6 w-20 rounded bg-surface-container animate-pulse" />
            <div className="grid grid-cols-2 gap-2 min-h-[130px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[60px] rounded-lg bg-surface-container animate-pulse" />
              ))}
            </div>
          </div>

          {/* News cards */}
          <div className="h-6 w-28 rounded bg-surface-container animate-pulse" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[88px] rounded-lg bg-surface-container animate-pulse" />
          ))}
        </div>
      </div>

      {/* ── Desktop skeleton ── */}
      <div className="hidden md:block">
        <div className="h-10 bg-surface-container-low border-b border-white/5" />
        <div className="h-16 bg-surface-container-low border-b border-white/5" />

        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-gutter px-container-margin pt-gutter pb-section-gap">
          {/* Left: 6 cols */}
          <div className="col-span-6 flex flex-col gap-4">
            <div className="h-10 rounded-xl bg-surface-container animate-pulse" />
            <div className="aspect-[16/9] rounded-xl bg-surface-container animate-pulse" />
            <div className="grid grid-cols-2 gap-gutter">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-[120px] rounded-lg bg-surface-container animate-pulse" />
              ))}
            </div>
            <div className="h-6 w-28 rounded bg-surface-container animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[88px] rounded-lg bg-surface-container animate-pulse" />
            ))}
          </div>

          {/* Middle: 3 cols */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="h-6 w-24 rounded bg-surface-container animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[80px] rounded-lg bg-surface-container animate-pulse" />
            ))}
          </div>

          {/* Sidebar: 3 cols */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="h-[280px] rounded-xl bg-surface-container animate-pulse" />
            <div className="h-[280px] rounded-xl bg-surface-container animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
