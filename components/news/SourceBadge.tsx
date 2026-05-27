interface Props {
  lean?: string;
  credibility?: number;
}

const LEAN_COLOR: Record<string, string> = {
  "اصول‌گرا": "text-green-400 bg-green-500/10",
  "اصلاح‌طلب": "text-blue-400 bg-blue-500/10",
  "لیبرال غربی": "text-red-400 bg-red-500/10",
  "مستقل": "text-outline bg-outline/10",
  "": "text-outline bg-outline/10",
};

export default function SourceBadge({ lean = "", credibility = 5 }: Props) {
  const cls = LEAN_COLOR[lean] ?? "text-outline bg-outline/10";
  return (
    <div className="flex items-center gap-2">
      {lean && (
        <span className={`px-2 py-0.5 rounded text-label-sm font-label-sm ${cls}`}>
          {lean}
        </span>
      )}
      <span className="text-label-sm text-on-surface-variant">
        اعتبار: {credibility}/۱۰
      </span>
    </div>
  );
}
