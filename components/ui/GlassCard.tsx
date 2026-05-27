interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl ${onClick ? "cursor-pointer hover:-translate-y-1 transition-transform duration-300" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
