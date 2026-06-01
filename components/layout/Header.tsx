import TopBarMobile from "./TopBarMobile";
import TopBarDesktop from "./TopBarDesktop";
import BreakingTicker from "./BreakingTicker";

export default function Header() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <BreakingTicker />
      </div>
      {/* Desktop */}
      <div className="hidden md:block">
        <BreakingTicker topOffset="top-0" />
        <TopBarDesktop stickyTop="top-10" />
      </div>
    </>
  );
}
