"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_GROUPS, getActiveGroup } from "@/lib/categories";

interface Props {
  selectedCat?: string;
  selectedGroup?: string;
  baseUrl?: string;
  visibleGroups?: string[];
}

export default function CategoryTabs({
  selectedCat,
  selectedGroup,
  baseUrl = "/categories",
  visibleGroups,
}: Props) {
  const router = useRouter();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
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
    // Mobile: always navigate directly, never show dropdown/sheet
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      navigate(groupUrl(groupName));
      return;
    }
    // Desktop: navigate to group URL
    navigate(groupUrl(groupName));
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
        {Object.entries(CATEGORY_GROUPS).filter(([groupName]) =>
          !visibleGroups || groupName === "همه" || visibleGroups.includes(groupName)
        ).map(([groupName, group]) => {
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
                  <span className="hidden md:inline text-[9px] opacity-50 mt-0.5">▾</span>
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
                      <span className="emoji-flag">{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </>
  );
}
