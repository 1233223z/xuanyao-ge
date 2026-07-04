"use client";

import { useState } from "react";
import Link from "next/link";
import BaziForm from "@/components/BaziForm";
import { calculateBazi } from "@/lib/bazi";
import ReportSection from "@/components/ReportSection";
import type { BaziResult } from "@/types/bazi";

export default function LiuNianPage() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  function handleCalculate(data: { name: string; gender: "男" | "女"; birthDate: string; birthTime: string; birthPlace: string; useTrueSolarTime: boolean }) {
    const time = data.birthTime || "12:00";
    const res = calculateBazi(data.name, data.gender, data.birthDate, time, data.birthPlace, data.useTrueSolarTime);
    setResult(res);
    sessionStorage.setItem("baziResult", JSON.stringify(res));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">LIUNIAN</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">流年运势</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          输入生辰排定八字大运，查看每年运势的吉凶趋势、注意事项和最佳行动方向。
        </p>
      </div>

      {!result ? (
        <BaziForm onCalculate={handleCalculate} />
      ) : (
        <div className="space-y-6">
          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-lg text-rice-50">{result.name} · 流年分析</h3>
            <p className="mt-1 text-sm text-rice-100/50">
              {result.fourPillars.year.stem}{result.fourPillars.year.branch} · {result.dayMaster.stem}日主 · {result.dayMaster.strength}
            </p>
          </div>

          {/* 当前流年 */}
          <div className="bazi-card rounded-xl p-5">
            <h4 className="text-sm font-medium text-gold-300">
              {result.currentLiuNian.year}年 · {result.currentLiuNian.stem}{result.currentLiuNian.branch} · {result.currentLiuNian.wuXing}
            </h4>
            <div className="mt-2">
              <span className={`inline-block rounded px-2 py-0.5 text-xs ${
                result.currentLiuNian.assessment === "吉" ? "bg-jade-400/15 text-jade-300" :
                result.currentLiuNian.assessment === "凶" ? "bg-cinnabar-400/15 text-cinnabar-400" :
                result.currentLiuNian.assessment === "变动" ? "bg-gold-400/15 text-gold-300" :
                "bg-rice-100/10 text-rice-100/60"
              }`}>
                {result.currentLiuNian.assessment === "吉" ? "吉" :
                 result.currentLiuNian.assessment === "凶" ? "需谨慎" :
                 result.currentLiuNian.assessment === "变动" ? "多变动" : "平稳"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-rice-100/70">
              {result.currentLiuNian.detail}
            </p>
          </div>

          {/* 大运 */}
          <ReportSection title="当前大运" tag="大运">
            <p>{result.daYun.records[result.daYun.currentIndex]?.description}</p>
          </ReportSection>

          {/* 付费 */}
          {!showPaywall ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowPaywall(true)}
                className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
              >
                解锁未来三年流年详解 ¥9.9
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-gold-400/20 bg-gold-400/5 p-4 text-center text-sm text-gold-300">
              支付功能开发中，敬请期待！
            </div>
          )}

          <div className="flex justify-between border-t border-brass-300/10 pt-6">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-sm text-gold-400/70 hover:text-gold-300"
            >
              ← 重新排盘
            </button>
            <Link href="/bazi/result" className="text-sm text-gold-400/70 hover:text-gold-300">
              查看完整命盘 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
