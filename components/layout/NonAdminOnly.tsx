"use client";
import { usePathname } from "next/navigation";

export default function NonAdminOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <>{children}</>;
}
