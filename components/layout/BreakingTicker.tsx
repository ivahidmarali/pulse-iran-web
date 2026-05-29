interface Props {
  items?: string[];
  topOffset?: string;
}

const DEFAULT_ITEMS = [
  "آخرین اخبار اقتصادی و سیاسی کشور",
  "پالس ایران — مانیتورینگ لحظه‌ای اخبار ایران",
  "پوشش ۴۵+ منبع خبری بدون فیلترینگ محتوا",
];

export default function BreakingTicker({ items = DEFAULT_ITEMS, topOffset = "top-16" }: Props) {
  const text = items.join(" • ");
  return (
    <div className={`w-full bg-secondary-container text-on-secondary-container h-10 flex items-center overflow-hidden sticky ${topOffset} z-[55] border-b border-secondary-fixed-dim/20`}>
      <div className="px-4 bg-secondary-fixed-dim text-on-secondary-fixed font-bold z-10 whitespace-nowrap flex items-center gap-2 h-full shrink-0">
        <span>🚨</span>
        خبر فوری
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-scroll whitespace-nowrap flex items-center gap-12 font-medium">
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
