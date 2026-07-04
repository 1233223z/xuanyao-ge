"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PrimaryLink } from "@/components/PrimaryButton";
import { ResultView } from "@/components/ResultView";
import { readCurrentResult, readHistory, readRecord, saveRecord } from "@/lib/storage";
import type { DivinationResult } from "@/types/yao";

export function ResultClient() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    const loaded = id ? readRecord(id) : readCurrentResult();

    setResult(loaded);
    setFromHistory(Boolean(id));
    setSaved(loaded ? readHistory().some((item) => item.id === loaded.id) : false);
  }, [searchParams]);

  if (!result) {
    return (
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-3xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="paper-panel rounded-lg p-6 text-center">
          <h1 className="text-2xl font-semibold text-rice-50">暂无排盘结果</h1>
          <p className="mt-3 text-sm leading-7 text-rice-100/62">请先完成一次起卦，或从历史记录中打开已保存的占事。</p>
          <div className="mt-6 flex justify-center">
            <PrimaryLink href="/divination">开始起卦</PrimaryLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResultView
      result={result}
      saved={saved}
      fromHistory={fromHistory}
      onSave={() => {
        saveRecord(result);
        setSaved(true);
      }}
    />
  );
}
