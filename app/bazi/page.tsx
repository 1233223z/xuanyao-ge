"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaziForm from "@/components/BaziForm";
import { calculateBazi } from "@/lib/bazi";
import type { BaziResult } from "@/types/bazi";

export default function BaziPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleCalculate(data: { name: string; gender: "男" | "女"; birthDate: string; birthTime: string; birthPlace: string; useTrueSolarTime: boolean }) {
    setIsLoading(true);

    // 如无时间，默认为午时
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

      // 保存到 sessionStorage
      sessionStorage.setItem("baziResult", JSON.stringify(result));

      // 跳转到结果页
      router.push(`/bazi/result?id=${result.id}`);
    } catch (err) {
      console.error("排盘错误:", err);
      alert("排盘计算时出现错误，请检查输入数据。");
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">BAZI</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">八字排盘</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          输入姓名、性别、出生日期和时间，系统将基于传统子平术数自动排定四柱、
          计算五行分布、十神关系、日主强弱、喜用神忌神、大运和流年。
        </p>
      </div>

      <BaziForm onCalculate={handleCalculate} isLoading={isLoading} />

      <div className="mt-8 rounded-lg border border-brass-300/10 bg-ink-850 p-4 text-xs text-rice-100/40">
        <p>⚠️ 排盘结果仅供文化参考。出生时间越准确，分析越有参考价值。</p>
      </div>
    </div>
  );
}
