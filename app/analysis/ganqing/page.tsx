"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BaziResultCard from "@/components/BaziResultCard";
import ReportSection from "@/components/ReportSection";
import PaywallOverlay from "@/components/PaywallOverlay";
import type { BaziResult } from "@/types/bazi";

export default function GanqingPage() {
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
        <p className="font-serif text-xs tracking-widest text-gold-400/60">GANQING</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">感情婚姻分析</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          从八字命局看感情运势、姻缘特征和夫妻关系
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
            <h3 className="font-serif text-base text-rice-50">感情婚姻分析</h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-rice-100/70">
              <p>{result.relationship}</p>
            </div>
          </div>

          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-base text-rice-50">流年感情提示</h3>
            <div className="mt-3 text-sm leading-7 text-rice-100/70">
              <p>{result.currentLiuNian.assessment === "吉"
                ? `${result.currentLiuNian.year}年感情运势较为顺利，关系发展处于有利窗口。`
                : result.currentLiuNian.assessment === "变动"
                ? `${result.currentLiuNian.year}年感情上可能遇到变化或选择，建议多做沟通。`
                : `${result.currentLiuNian.year}年感情运势平稳，适合在现有基础上稳步推进。`}</p>
            </div>
          </div>

          <ReportSection title="感情深度分析" tag="感情" locked price={9.9}>
            <p>未来五年感情运势时间线、正缘特征描述、相处建议与注意事项。</p>
          </ReportSection>

          <PaywallOverlay
            price={9.9}
            title="解锁感情深度分析"
            features={["正缘特征判断", "未来五年感情时间线", "相处模式与注意事项", "桃花星与人际关系分析"]}
          />
        </div>
      )}
    </div>
  );
}
