"use client";

import { useState } from "react";
import Link from "next/link";
import BaziForm from "@/components/BaziForm";
import RitualLoading from "@/components/RitualLoading";
import { calculateBazi } from "@/lib/bazi";
import { calculateLiuNian } from "@/lib/bazi/liu-nian";
import PaywallOverlay from "@/components/PaywallOverlay";
import { saveReportData } from "@/lib/payment";
import type { BaziResult, LiuNianAnalysis } from "@/types/bazi";

export default function LiuNianPage() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [years, setYears] = useState<LiuNianAnalysis[]>([]);
  const [selectedYear, setSelectedYear] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleCalculate(data: { name: string; gender: "男" | "女"; birthDate: string; birthTime: string; birthPlace: string; useTrueSolarTime: boolean }) {
    setLoading(true);
    const time = data.birthTime || "12:00";
    const res = calculateBazi(data.name, data.gender, data.birthDate, time, data.birthPlace, data.useTrueSolarTime);
    sessionStorage.setItem("baziResult", JSON.stringify(res));
    saveReportData(res.id, res);

    // 计算前后各几年的流年
    const currentYear = new Date().getFullYear();
    const yearList: LiuNianAnalysis[] = [];
    for (let y = currentYear - 2; y <= currentYear + 4; y++) {
      yearList.push(calculateLiuNian(res.fourPillars, res.daYun, y));
    }
    setResult(res);
    setYears(yearList);
    setSelectedYear(yearList.findIndex(y => y.year === currentYear));
    setLoading(false);
    setShowPaywall(false);
  }

  const currentYear = new Date().getFullYear();
  const assessmentColors: Record<string, string> = {
    吉: "bg-jade-400/15 text-jade-300 border-jade-400/20",
    平: "bg-rice-100/8 text-rice-100/60 border-rice-100/10",
    变动: "bg-gold-400/10 text-gold-300 border-gold-400/20",
    凶: "bg-cinnabar-400/10 text-cinnabar-400 border-cinnabar-400/20",
  };

  return (
    <>
      <RitualLoading isActive={loading} onComplete={() => {}} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 text-center">
          <p className="font-serif text-xs tracking-[0.2em] text-gold-400/60">LIUNIAN</p>
          <h1 className="mt-2 font-serif text-3xl text-rice-50">流年运势</h1>
          <p className="mt-3 text-sm leading-7 text-rice-100/60">
            排定八字大运，查看过去未来七年每年的运势趋势、注意事项和行动方向。
          </p>
        </div>

        {!result ? (
          <BaziForm onCalculate={handleCalculate} isLoading={loading} />
        ) : (
          <div className="space-y-6">
            {/* 命盘摘要 */}
            <div className="bazi-card rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-rice-50">{result.name} · 流年分析</h3>
                  <p className="mt-1 text-sm text-rice-100/50">
                    {result.fourPillars.year.stem}{result.fourPillars.year.branch} · {result.dayMaster.stem}日主 · {result.dayMaster.strength}
                  </p>
                </div>
                <Link href="/bazi/result" className="text-xs text-gold-400/70 hover:text-gold-300">
                  完整命盘 →
                </Link>
              </div>
            </div>

            {/* 流年时间轴 */}
            <div className="bazi-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-rice-50 mb-4">流年时间轴</h4>
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
                {years.map((y, i) => {
                  const isCurrent = y.year === currentYear;
                  const isSelected = i === selectedYear;
                  return (
                    <button
                      key={y.year}
                      type="button"
                      onClick={() => setSelectedYear(i)}
                      className={`flex-shrink-0 rounded-lg border px-3 py-2 text-center transition-all min-w-[72px] ${
                        isSelected
                          ? "border-gold-400/50 bg-gold-400/10"
                          : isCurrent
                            ? "border-brass-300/30 bg-ink-800"
                            : "border-brass-300/10 bg-ink-850 hover:border-brass-300/25"
                      }`}
                    >
                      <div className="text-xs text-rice-100/40">{y.year}</div>
                      <div className="text-sm font-medium text-rice-50 mt-0.5">{y.stem}{y.branch}</div>
                      <div className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] border ${
                        assessmentColors[y.assessment] || "bg-rice-100/8 text-rice-100/60"
                      }`}>
                        {y.assessment === "吉" ? "吉" :
                         y.assessment === "凶" ? "慎" :
                         y.assessment === "变动" ? "变" : "平"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 选中年份详情 */}
            {years[selectedYear] && (
              <div className="bazi-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-medium text-rice-50">
                    {years[selectedYear].year}年 · {years[selectedYear].stem}{years[selectedYear].branch}
                  </h4>
                  <span className={`rounded px-2.5 py-1 text-xs border ${
                    assessmentColors[years[selectedYear].assessment]
                  }`}>
                    {years[selectedYear].assessment === "吉" ? "运势较好" :
                     years[selectedYear].assessment === "凶" ? "需谨慎" :
                     years[selectedYear].assessment === "变动" ? "多变动" : "运势平稳"}
                  </span>
                </div>
                <p className="text-sm leading-7 text-rice-100/70">
                  {years[selectedYear].detail}
                </p>
                {years[selectedYear].year !== currentYear && (
                  <p className="mt-3 text-xs text-rice-100/40">
                    {years[selectedYear].year < currentYear ? "已过去" : "尚未到来"}
                    ，
                    {years[selectedYear].assessment === "吉" ? "此年整体趋势偏向有利。" :
                     years[selectedYear].assessment === "凶" ? "此年需提前准备，谨慎应对。" :
                     years[selectedYear].assessment === "变动" ? "此年多有变化，宜随机应变。" :
                     "此年运势平稳，按部就班即可。"}
                  </p>
                )}
              </div>
            )}

            {/* 当前大运 */}
            <div className="bazi-card rounded-xl p-5">
              <h4 className="text-sm font-medium text-rice-50">当前大运</h4>
              <p className="mt-2 text-sm leading-7 text-rice-100/70">
                {result.daYun.records[result.daYun.currentIndex]?.description || "暂未排定大运"}
              </p>
            </div>

            {/* 付费解锁 */}
            {!showPaywall ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
                >
                  解锁完整流年报告 ¥9.9
                </button>
                <p className="mt-2 text-xs text-rice-100/30">
                  包含大运交互详解、每月运势分析、趋吉避凶建议
                </p>
              </div>
            ) : (
              <PaywallOverlay
                reportId={result.id}
                productId="bazi_report"
                price={9.9}
                title="解锁流年深度报告"
                features={[
                  "大运与流年交互作用详解",
                  "每月吉凶趋势分析",
                  "重要时间节点提示",
                  "趋吉避凶具体建议"
                ]}
              />
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
    </>
  );
}
