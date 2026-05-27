import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "پالس ایران",
  description: "مرجع تخصصی مانیتورینگ زنده اخبار ایران",
  openGraph: {
    title: "پالس ایران",
    description: "مرجع تخصصی مانیتورینگ زنده اخبار ایران",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-background text-on-surface antialiased">{children}</body>
    </html>
  );
}
