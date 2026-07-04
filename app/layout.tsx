import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "玄爻阁 | 八字排盘 · 六爻起卦 · 命理分析",
  description: "基于传统子平术数与周易六爻规则的专业命理排盘工具。提供八字排盘、六爻起卦、流年运势等功能，算法透明，克制解读。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="noise-bg" />
        <Header />
        <main className="relative z-10 min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
