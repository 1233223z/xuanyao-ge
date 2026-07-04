"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BaziResultCard from "@/components/BaziResultCard";
import ReportSection from "@/components/ReportSection";
import PaywallOverlay from "@/components/PaywallOverlay";
import type { BaziResult } from "@/types/bazi";

export default function CaiyunPage() {
  const router = useRouter();
  const [result, setResult] = useState<BaziResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("baziResult");
      if (stored) setResult(JSON.parse(stored));
    } catch { /* noop */ }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">CAIYUN</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">财运事业分析</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          从八字命局看事业方向、财星格局和收入模式
        </p>
      </div>

      {!result ? (
        <div className="bazi-card rounded-xl p-8 text-center">
          <p className="text-sm text-rice-100/60">请先进行八字排盘</p>
          <Link href="/bazi" className="mt-4 inline-block text-sm text-gold-400 hover:text-gold-300">
            前往八字排盘 →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <BaziResultCard result={result} />

          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-base text-rice-50">财运事业分析</h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-rice-100/70">
              <p>{result.careerWealth}</p>
            </div>
          </div>

          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-base text-rice-50">当前大运事业提示</h3>
            <div className="mt-3 text-sm leading-7 text-rice-100/70">
              <p>
                当前大运：{result.daYun.records[result.daYun.currentIndex]?.stem}{result.daYun.records[result.daYun.currentIndex]?.branch}，
                {result.daYun.records[result.daYun.currentIndex]?.stemWuXing}运，
                {result.daYun.records[result.daYun.currentIndex]?.tenGodOfDay}透出。
              </p>
              <p className="mt-2">
                此大运期间，事业发展适宜围绕{result.daYun.records[result.daYun.currentIndex]?.stemWuXing}五行相关领域展开，
                结合日主{result.dayMaster.stem}的强弱特点来选择具体方向。
              </p>
            </div>
          </div>

          <ReportSection title="财运深度分析" tag="财运" locked price={9.9}>
            <p>财星格局详解、财库分析、适合的理财模式、未来五年财运趋势。</p>
          </ReportSection>

          <PaywallOverlay
            onUnlock={() => alert("支付功能开发中，敬请期待！")}
            price={9.9}
            title="解锁财运事业深度分析"
            features={["财星格局详细分析", "适合的行业与职业方向", "未来五年财运时间线", "投资与创业建议"]}
          />
        </div>
      )}
    </div>
  );
}
