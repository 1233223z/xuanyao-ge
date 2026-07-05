"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BaziResultCard from "@/components/BaziResultCard";
import BaziChart from "@/components/BaziChart";
import ReportSection from "@/components/ReportSection";
import PaywallOverlay from "@/components/PaywallOverlay";
import type { BaziResult } from "@/types/bazi";
import { calculateTenGod } from "@/lib/bazi/ten-gods";
import { saveBaziRecord } from "@/lib/storage";
import { fourPillarsShort } from "@/lib/bazi";
import { getReportData, isReportPaid } from "@/lib/payment";

export default function BaziResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<BaziResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // 从 URL 读取参数（不用 useSearchParams 以避免 Suspense boundary）
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");
    const paidFromUrl = params.get("paid") === "true";

    try {
      const stored = sessionStorage.getItem("baziResult");
      if (stored) {
        const data = JSON.parse(stored);
        setResult(data);
        // 如果已支付过，自动解锁
        if (isReportPaid(data.id)) {
          setSaved(true);
          setIsPaid(true);
        }
        return;
      }

      // sessionStorage 中没有 — 尝试从 localStorage 按 id 找回
      if (idFromUrl) {
        const localData = getReportData(idFromUrl);
        if (localData) {
          setResult(localData as BaziResult);
          const paid = isReportPaid(idFromUrl);
          if (paid) setIsPaid(true);
          return;
        }

        // 检查是否支付过但数据丢失
        if (paidFromUrl || isReportPaid(idFromUrl)) {
          setNotFound(true);
          return;
        }
      }

      // 什么也没有 — 回退到输入页
      router.replace("/bazi");
    } catch {
      if (idFromUrl && isReportPaid(idFromUrl)) {
        setNotFound(true);
      } else {
        router.replace("/bazi");
      }
    }
  }, [router]);

  function handleSave() {
    if (!result || saved) return;
    saveBaziRecord({
      id: result.id,
      name: result.name,
      gender: result.gender,
      birthDate: result.birthDate,
      birthTime: result.birthTime,
      pillarShort: fourPillarsShort(result.fourPillars),
      dayMaster: result.dayMaster.stem,
      savedAt: new Date().toISOString()
    });
    setSaved(true);
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brass-300/20">
          <span className="text-3xl text-rice-100/50">?</span>
        </div>
        <h1 className="font-serif text-2xl text-rice-50">未找到原报告</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          该报告已支付成功，但数据在清理浏览器缓存后丢失。<br />
          请返回历史记录查看（如果已保存），或重新进行八字排盘。
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/history"
            className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
          >
            查看历史记录
          </Link>
          <Link
            href="/bazi"
            className="rounded-lg border border-brass-300/20 px-6 py-2.5 text-sm text-rice-100/70 hover:text-rice-50"
          >
            重新排盘
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-rice-100/50">
        加载中…
      </div>
    );
  }

  const { fourPillars, dayMaster, wuXingDistribution, deities, daYun, currentLiuNian, personality } = result;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* 标题 */}
      <div className="mb-6">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">八字排盘报告</p>
        <h1 className="mt-1 font-serif text-2xl text-rice-50">{result.name} 的命盘</h1>
        <p className="mt-1 text-sm text-rice-100/50">
          排盘时间：{result.calculatedAt}
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className={`mt-2 rounded-md px-3 py-1 text-xs transition ${
            saved
              ? "bg-jade-400/15 text-jade-300"
              : "border border-brass-300/20 text-rice-100/60 hover:border-gold-400/40 hover:text-gold-300"
          }`}
        >
          {saved ? "✓ 已保存" : "保存到历史记录"}
        </button>
      </div>

      {/* 命盘卡片 */}
      <BaziResultCard result={result} />

      {/* 五行图表 */}
      <div className="mt-6">
        <BaziChart distribution={wuXingDistribution} />
      </div>

      {/* 十神表 */}
      <div className="bazi-card mt-6 rounded-xl p-5">
        <h3 className="mb-3 text-sm font-medium text-rice-50">十神关系</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brass-300/10 text-left text-xs text-rice-100/50">
                <th className="py-2 pr-4">柱位</th>
                <th className="py-2 pr-4">天干</th>
                <th className="py-2 pr-4">地支</th>
                <th className="py-2 pr-4">藏干 → 十神</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "年柱", p: fourPillars.year },
                { label: "月柱", p: fourPillars.month },
                { label: "日柱", p: fourPillars.day },
                { label: "时柱", p: fourPillars.hour }
              ].map(({ label, p }) => {
                const dm = fourPillars.day.stem;
                const hiddenText = p.hiddenStems
                  .map(h => `${h.stem}(${calculateTenGod(dm, h.stem)})`)
                  .join(" ");
                return (
                  <tr key={label} className="border-b border-brass-300/5">
                    <td className="py-2.5 pr-4 text-rice-100/60">{label}</td>
                    <td className="py-2.5 pr-4 text-rice-50">{p.stem}</td>
                    <td className="py-2.5 pr-4 text-rice-50">{p.branch}</td>
                    <td className="py-2.5 text-rice-100/70">{hiddenText || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 神煞 */}
      <div className="bazi-card mt-6 rounded-xl p-5">
        <h3 className="mb-3 text-sm font-medium text-rice-50">神煞</h3>
        {result.shenSha && result.shenSha.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.shenSha.map((s, i) => (
              <span
                key={i}
                title={s.description}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                  s.type === "吉神"
                    ? "border border-jade-400/30 bg-jade-400/10 text-jade-300"
                    : s.type === "凶煞"
                    ? "border border-cinnabar-400/30 bg-cinnabar-400/10 text-cinnabar-400"
                    : "border border-brass-300/20 bg-ink-800 text-rice-100/60"
                }`}
              >
                {s.name}
                <span className="opacity-60">@{s.pillar}柱</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-rice-100/50">命局中无明显神煞显现。</p>
        )}
      </div>

      {/* 分析报告 */}
      <div className="bazi-card mt-6 rounded-xl p-5">
        <h3 className="mb-4 text-sm font-medium text-rice-50">命理分析</h3>

        {/* 核心格局 */}
        <ReportSection title="核心格局" tag="格局">
          <p>
            日主{dayMaster.stem}（{dayMaster.wuXing} · {dayMaster.yinYang}），生于{fourPillars.month.branch}月，日主{dayMaster.strength}。
          </p>
          <p className="mt-2">
            {dayMaster.reasoning}
          </p>
          <p className="mt-2">
            用神：{deities.favorable.join("、")} · 忌神：{deities.unfavorable.join("、")}
          </p>
          <p className="mt-2 text-rice-100/50">
            {deities.favorableExplanation}
          </p>
        </ReportSection>

        {/* 性格分析 */}
        <ReportSection title="性格分析" tag="性格">
          <p>{personality}</p>
        </ReportSection>

        {/* 大运 */}
        <ReportSection title="大运" tag="大运" locked={!isPaid}>
          <div className="space-y-2">
            {daYun.records.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-24 text-xs text-rice-100/50`}>
                  {r.startAge}-{r.endAge}岁
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-rice-50">{r.stem}{r.branch}</span>
                    <span className="text-xs text-rice-100/50">{r.stemWuXing}运 · {r.tenGodOfDay}</span>
                  </div>
                  {/* 时间轴 */}
                  <div className="dayun-timeline-track mt-1">
                    <div
                      className="fill"
                      style={{ width: r.isCurrent ? "100%" : "0%" }}
                    />
                  </div>
                </div>
                {r.isCurrent && (
                  <span className="shrink-0 rounded bg-gold-400/15 px-2 py-0.5 text-[10px] text-gold-300">
                    当前
                  </span>
                )}
              </div>
            ))}
          </div>
        </ReportSection>

        {/* 流年 */}
        <ReportSection title={`流年 ${currentLiuNian.year}年`} tag="流年" locked={!isPaid}>
          <p>{currentLiuNian.detail}</p>
        </ReportSection>

        {/* 事业 */}
        <ReportSection title="事业分析" tag="事业" locked={!isPaid} price={9.9}>
          <p>{result.careerWealth}</p>
        </ReportSection>

        {/* 感情 */}
        <ReportSection title="感情婚姻分析" tag="感情" locked={!isPaid} price={9.9}>
          <p>{result.relationship}</p>
        </ReportSection>

        {/* 健康 */}
        <ReportSection title="健康分析" tag="健康" locked={!isPaid} price={9.9}>
          <p>{result.health}</p>
        </ReportSection>
      </div>

      {/* 付费解锁 */}
      {isPaid ? (
        <div className="mt-6 rounded-lg border border-jade-400/20 bg-jade-400/5 px-6 py-4 text-center">
          <p className="text-sm text-jade-300">✓ 已解锁完整报告</p>
        </div>
      ) : showPaywall ? (
        <div className="mt-6">
          <PaywallOverlay reportId={result.id} />
        </div>
      ) : (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowPaywall(true)}
            className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 transition hover:from-gold-400 hover:to-brass-300"
          >
            解锁完整详批报告 ¥9.9
          </button>
          <p className="mt-2 text-xs text-rice-100/30">
            包含事业、财运、感情、健康、大运、流年完整深度分析
          </p>
        </div>
      )}

      {/* 底部 */}
      <div className="mt-8 flex justify-between border-t border-brass-300/10 pt-6">
        <Link href="/bazi" className="text-sm text-gold-400/70 hover:text-gold-300">
          ← 重新排盘
        </Link>
        <Link href="/analysis/ganqing" className="text-sm text-gold-400/70 hover:text-gold-300">
          专题分析 →
        </Link>
      </div>
    </div>
  );
}
