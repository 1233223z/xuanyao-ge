"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BaziResultCard from "@/components/BaziResultCard";
import ReportSection from "@/components/ReportSection";
import PaywallOverlay from "@/components/PaywallOverlay";
import BaziChart from "@/components/BaziChart";
import type { BaziResult } from "@/types/bazi";

export default function JiankangPage() {
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
        <p className="font-serif text-xs tracking-widest text-gold-400/60">JIANKANG</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">健康性格分析</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          从八字五行看先天体质倾向、易感注意事项与性格特质
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

          <BaziChart distribution={result.wuXingDistribution} />

          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-base text-rice-50">体质与健康分析</h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-rice-100/70">
              <p>{result.health}</p>
            </div>
          </div>

          <div className="bazi-card rounded-xl p-5">
            <h3 className="font-serif text-base text-rice-50">性格特质分析</h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-rice-100/70">
              <p>{result.personality}</p>
            </div>
          </div>

          <ReportSection title="深度健康调理建议" tag="健康" locked price={9.9}>
            <p>基于五行过旺过弱的具体调理方案，包括饮食、作息、运动等方面的针对性建议。</p>
          </ReportSection>

          <PaywallOverlay
            price={9.9}
            title="解锁健康深度分析"
            features={["五行体质详细分析", "易感事项提前预防", "饮食作息调理建议", "大运流年对健康的影响"]}
          />
        </div>
      )}
    </div>
  );
}
