"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BaziResultCard from "@/components/BaziResultCard";
import PaywallOverlay from "@/components/PaywallOverlay";
import ReportSection from "@/components/ReportSection";
import type { BaziResult } from "@/types/bazi";

export default function BaziDetailPage() {
  const router = useRouter();
  const [result, setResult] = useState<BaziResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("baziResult");
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        router.replace("/bazi");
      }
    } catch {
      router.replace("/bazi");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-rice-100/50">
        加载中…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-6">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">八字详批</p>
        <h1 className="mt-1 font-serif text-2xl text-rice-50">{result.name} · 深度详批</h1>
      </div>

      <BaziResultCard result={result} />

      <div className="mt-8 space-y-6">
        <ReportSection title="事业深度分析" tag="事业" locked price={19.9}>
          <p>基于您的八字格局与大运流年，对事业发展方向、职业适应性和晋升时机进行深度分析。</p>
        </ReportSection>

        <ReportSection title="财运深度分析" tag="财运" locked price={19.9}>
          <p>分析财星格局、财库情况，判断收入模式和理财方向。</p>
        </ReportSection>

        <ReportSection title="感情深度分析" tag="感情" locked price={19.9}>
          <p>夫妻宫深析、桃花星判断、流年感情运势时间线。</p>
        </ReportSection>

        <ReportSection title="健康深度分析" tag="健康" locked price={19.9}>
          <p>五行过旺过弱对应的健康提示，大运流年对健康的影响。</p>
        </ReportSection>
      </div>

      <div className="mt-8">
        <PaywallOverlay
          price={19.9}
          title="解锁完整详批"
          features={[
            "事业深度分析（含方向建议）",
            "财运格局详解（含财库分析）",
            "感情婚姻深析（含夫妻宫）",
            "健康五行调理建议",
            "大运流年综合时间线"
          ]}
        />
      </div>

      <div className="mt-6 text-center">
        <Link href="/bazi/result" className="text-sm text-gold-400/70 hover:text-gold-300">
          ← 返回基础报告
        </Link>
      </div>
    </div>
  );
}
