"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brass-300/10">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* 品牌 */}
          <div>
            <span className="font-serif text-lg text-rice-50">玄爻阁</span>
            <p className="mt-2 text-sm leading-6 text-rice-100/50">
              以传统周易、八字命理、六爻预测为基础，提供专业排盘与深度分析。
              不承诺绝对准确，不作为决策唯一依据。
            </p>
          </div>

          {/* 导航 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-rice-50">工具</h4>
            <div className="flex flex-col gap-2 text-sm text-rice-100/50">
              <Link href="/bazi" className="hover:text-rice-50 transition">八字排盘</Link>
              <Link href="/divination" className="hover:text-rice-50 transition">六爻起卦</Link>
              <Link href="/liunian" className="hover:text-rice-50 transition">流年运势</Link>
              <Link href="/history" className="hover:text-rice-50 transition">历史记录</Link>
            </div>
          </div>

          {/* 更多 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-rice-50">更多</h4>
            <div className="flex flex-col gap-2 text-sm text-rice-100/50">
              <Link href="/faq" className="hover:text-rice-50 transition">FAQ</Link>
              <Link href="/pricing" className="hover:text-rice-50 transition">付费说明</Link>
              <Link href="/about" className="hover:text-rice-50 transition">关于</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-brass-300/10 pt-6 text-center text-xs text-rice-100/30">
          <p>玄爻阁 · 命理文化参考工具 · 不替代专业建议</p>
        </div>
      </div>
    </footer>
  );
}
