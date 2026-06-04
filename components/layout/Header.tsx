import TopBarMobile from "./TopBarMobile";
import TopBarDesktop from "./TopBarDesktop";
import BreakingTicker from "./BreakingTicker";
import { getBreakingNews } from "@/lib/api";

export default async function Header() {
  let tickerItems: string[] | undefined;
  try {
    const items = await getBreakingNews();
    const titles = items.slice(0, 5).map((i) => i.title).filter(Boolean);
    if (titles.length > 0) tickerItems = titles;
  } catch {
    // falls back to DEFAULT_ITEMS in BreakingTicker
  }

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <TopBarMobile />
        <BreakingTicker items={tickerItems} />
      </div>
      {/* Desktop */}
      <div className="hidden md:block">
        <BreakingTicker topOffset="top-0" items={tickerItems} />
        <TopBarDesktop stickyTop="top-10" />
      </div>
    </>
  );
}
