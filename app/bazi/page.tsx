"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BaziForm from "@/components/BaziForm";
import RitualLoading from "@/components/RitualLoading";
import { calculateBazi } from "@/lib/bazi";
import type { BaziResult } from "@/types/bazi";
import { saveReportData } from "@/lib/payment";

export default function BaziPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRitual, setShowRitual] = useState(false);

  const handleCalculate = useCallback((data: { name: string; gender: "男" | "女"; birthDate: string; birthTime: string; birthPlace: string; useTrueSolarTime: boolean }) => {
    const time = data.birthTime || "12:00";

    try {
      const result = calculateBazi(
        data.name,
        data.gender,
        data.birthDate,
        time,
        data.birthPlace,
        data.useTrueSolarTime
      );

      // 仪式感动画期间保存数据
      saveReportData(result.id, result);
      sessionStorage.setItem("baziResult", JSON.stringify(result));

      // 显示仪式感动画
      setShowRitual(true);
      setIsLoading(true);
    } catch (err) {
      console.error("排盘错误:", err);
      alert("排盘计算时出现错误，请检查输入数据。");
      setIsLoading(false);
    }
  }, []);

  function handleRitualComplete() {
    // 动画完成后跳转
    const stored = sessionStorage.getItem("baziResult");
    if (stored) {
      const result = JSON.parse(stored) as BaziResult;
      router.push(`/bazi/result?id=${result.id}`);
    }
  }

  return (
    <>
      <RitualLoading isActive={showRitual} onComplete={handleRitualComplete} />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 text-center gold-corner inline-block w-full pb-8">
          <div className="gold-line mb-6" />
          <p className="font-serif text-xs tracking-[0.2em] text-gold-400/60">BAZI</p>
          <h1 className="mt-3 font-serif text-3xl text-rice-50">八字排盘</h1>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-7 text-rice-100/50">
            输入姓名、性别、出生日期和时间，系统将基于传统子平术数自动排定四柱、
            计算五行分布、十神关系、日主强弱、喜用神忌神、大运和流年。
          </p>
        </div>

        <BaziForm onCalculate={handleCalculate} isLoading={isLoading} />

        {/* 步奏引导 */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3 text-center">
          {[
            { step: "01", label: "填写信息", desc: "姓名、性别、出生时间" },
            { step: "02", label: "系统排盘", desc: "节气算法 · 四柱推演" },
            { step: "03", label: "生成报告", desc: "完整命盘 · 深度分析" },
          ].map((s) => (
            <div key={s.step} className="bazi-card rounded-lg px-4 py-3">
              <p className="text-[10px] text-gold-400/40 tracking-wider">{s.step}</p>
              <p className="mt-1 text-sm text-rice-50">{s.label}</p>
              <p className="text-xs text-rice-100/40">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-brass-300/8 bg-ink-850/60 px-5 py-4 text-xs text-rice-100/40 leading-6">
          ⚠️ 排盘结果仅供文化参考。出生时间越准确，分析越有参考价值。
        </div>
      </div>
    </>
  );
}
