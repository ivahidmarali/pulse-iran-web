"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_GROUPS, getActiveGroup } from "@/lib/categories";

interface Props {
  selectedCat?: string;
  selectedGroup?: string;
  baseUrl?: string;
}

export default function CategoryTabs({
  selectedCat,
  selectedGroup,
  baseUrl = "/categories",
}: Props) {
  const router = useRouter();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeGroup = getActiveGroup(selectedCat, selectedGroup);

  const navigate = (url: string) => {
    router.push(url);
    setMobileSheet(null);
    setHoveredGroup(null);
  };

  const groupUrl = (name: string) =>
    name === "همه" ? baseUrl : `${baseUrl}?group=${encodeURIComponent(name)}`;

  const catUrl = (cat: string) => `${baseUrl}?cat=${encodeURIComponent(cat)}`;

  const handleTabClick = (groupName: string) => {
    const hasSubCats = CATEGORY_GROUPS[groupName].categories.length > 0;
    if (!hasSubCats) {
      navigate(groupUrl(groupName));
      return;
    }
    // Mobile: open bottom sheet. Desktop: navigate to group.
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      navigate(groupUrl(groupName));
    } else {
      setMobileSheet(mobileSheet === groupName ? null : groupName);
    }
  };

  const handleMouseEnter = (groupName: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (CATEGORY_GROUPS[groupName].categories.length > 0) {
      setHoveredGroup(groupName);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredGroup(null), 150);
  };

  return (
    <>
      {/* ── Tab bar ── */}
      <div
        dir="rtl"
        className="flex flex-row gap-1.5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => {
          const active = activeGroup === groupName;
          const hasSubCats = group.categories.length > 0;

          return (
            <div
              key={groupName}
              className="relative shrink-0 snap-start"
              onMouseEnter={() => handleMouseEnter(groupName)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleTabClick(groupName)}
                className={`min-h-[48px] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  active
                    ? "bg-secondary-fixed-dim text-background font-bold"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {groupName}
                {hasSubCats && (
                  <span className="text-[9px] opacity-50 mt-0.5">▾</span>
                )}
              </button>

              {/* ── Desktop dropdown ── */}
              {hasSubCats && hoveredGroup === groupName && (
                <div
                  className="hidden md:block absolute top-[calc(100%+4px)] right-0 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] py-1.5 overflow-hidden"
                  onMouseEnter={() => {
                    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                    setHoveredGroup(groupName);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="w-full text-right px-4 py-2 text-xs text-on-surface-variant hover:bg-white/5 transition-colors"
                    onClick={() => navigate(groupUrl(groupName))}
                  >
                    همه {groupName}
                  </button>
                  <div className="border-t border-white/5 my-1" />
                  {group.categories.map((cat) => (
                    <button
                      key={cat}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        selectedCat === cat
                          ? "text-secondary-fixed-dim font-bold"
                          : "text-on-surface"
                      }`}
                      onClick={() => navigate(catUrl(cat))}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mobile bottom sheet overlay ── */}
      {mobileSheet && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setMobileSheet(null)}
          />

          {/* Sheet */}
          <div
            dir="rtl"
            className="fixed bottom-0 inset-x-0 bg-surface-container-highest rounded-t-2xl z-50 pb-8 shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-md font-bold">{mobileSheet}</h3>
                <button
                  className="text-on-surface-variant text-sm"
                  onClick={() => setMobileSheet(null)}
                >
                  بستن
                </button>
              </div>

              {/* "All" option */}
              <button
                className="w-full min-h-[48px] px-4 py-3 mb-3 bg-surface-container rounded-xl text-sm text-right hover:bg-white/5 transition-colors text-on-surface-variant"
                onClick={() => navigate(groupUrl(mobileSheet))}
              >
                همه {mobileSheet}
              </button>

              {/* Sub-category grid */}
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_GROUPS[mobileSheet].categories.map((cat) => (
                  <button
                    key={cat}
                    className={`min-h-[48px] px-3 py-3 rounded-xl text-sm text-right transition-colors leading-snug ${
                      selectedCat === cat
                        ? "bg-secondary-fixed-dim/20 ring-1 ring-secondary-fixed-dim text-secondary-fixed-dim font-bold"
                        : "bg-surface-container hover:bg-white/5 text-on-surface"
                    }`}
                    onClick={() => navigate(catUrl(cat))}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
