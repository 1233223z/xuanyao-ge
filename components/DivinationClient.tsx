"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CoinFaceBadge } from "@/components/CoinFaceBadge";
import { PrimaryButton, SecondaryButton } from "@/components/PrimaryButton";
import { SectionCard } from "@/components/SectionCard";
import {
  calculateDivination,
  createRandomCoins,
  createTimeBasedCoins,
  evaluateCoins,
  formatDateTime,
  positionNames
} from "@/lib/yao";
import { saveCurrentResult } from "@/lib/storage";
import type { CoinFace, DivinationMethod, YaoLine } from "@/types/yao";

const defaultCoins: [CoinFace, CoinFace, CoinFace] = ["back", "character", "character"];

export function DivinationClient() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [method, setMethod] = useState<DivinationMethod>("manual");
  const [castTime, setCastTime] = useState("");
  const [manualCoins, setManualCoins] = useState<[CoinFace, CoinFace, CoinFace]>(defaultCoins);
  const [previewCoins, setPreviewCoins] = useState<[CoinFace, CoinFace, CoinFace]>(defaultCoins);
  const [lines, setLines] = useState<YaoLine[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState("");

  const nextPosition = useMemo(() => Math.min(lines.length + 1, 6) as YaoLine["position"], [lines.length]);
  const completed = lines.length === 6;

  useEffect(() => {
    setCastTime(formatDateTime());
  }, []);

  function appendLine(coins: [CoinFace, CoinFace, CoinFace]) {
    if (lines.length >= 6) {
      return;
    }

    const line = evaluateCoins(coins, (lines.length + 1) as YaoLine["position"]);
    setLines((current) => [...current, line]);
    setPreviewCoins(coins);
    setError("");
  }

  function updateManualCoin(index: number, face: CoinFace) {
    setManualCoins((current) => current.map((coin, coinIndex) => (coinIndex === index ? face : coin)) as [
      CoinFace,
      CoinFace,
      CoinFace
    ]);
  }

  function recordManualLine() {
    appendLine(manualCoins);
  }

  function shakeRandomLine() {
    if (isShaking || completed) {
      return;
    }

    const coins = createRandomCoins();
    setPreviewCoins(coins);
    setIsShaking(true);

    window.setTimeout(() => {
      appendLine(coins);
      setIsShaking(false);
    }, 620);
  }

  function undoLastLine() {
    setLines((current) => current.slice(0, -1));
    setError("");
  }

  function resetLines() {
    setLines([]);
    setPreviewCoins(defaultCoins);
    setManualCoins(defaultCoins);
    setCastTime(formatDateTime());
    setError("");
  }

  function generateResult() {
    if (!title.trim()) {
      setError("请先填写占事标题。");
      return;
    }

    if (!question.trim()) {
      setError("请先填写具体问题。");
      return;
    }

    if (lines.length !== 6) {
      setError("需要完成六次起卦后才能生成排盘。");
      return;
    }

    const result = calculateDivination({
      title,
      question,
      method,
      castTime: castTime || formatDateTime(),
      lines
    });

    saveCurrentResult(result);
    router.push("/result");
  }

  function switchMethod(nextMethod: DivinationMethod) {
    if (lines.length > 0) {
      return;
    }

    setMethod(nextMethod);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6">
        <p className="text-sm text-cinnabar-400">起卦</p>
        <h1 className="mt-2 text-3xl font-semibold text-rice-50 sm:text-4xl">三枚铜钱，六次成卦</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-rice-100/64">
          请先写明占事，再从初爻开始依次记录六次铜钱结果。动爻会在结果页自动标记，并用于生成变卦。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="占事信息">
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm text-rice-100/64">占事标题</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：工作、合作、考试、出行"
                className="mt-2 w-full rounded-md border border-rice-100/14 bg-ink-950/50 px-3 py-3 text-rice-50 outline-none transition placeholder:text-rice-100/28 focus:border-cinnabar-400/60"
              />
            </label>

            <label className="block">
              <span className="text-sm text-rice-100/64">具体问题</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="请尽量写清楚正在考虑的事项、时间范围与现实背景。"
                rows={5}
                className="mt-2 w-full resize-none rounded-md border border-rice-100/14 bg-ink-950/50 px-3 py-3 text-rice-50 outline-none transition placeholder:text-rice-100/28 focus:border-cinnabar-400/60"
              />
            </label>

            <div>
              <span className="text-sm text-rice-100/64">起卦方式</span>
              <div className="mt-2 grid grid-cols-3 gap-2 rounded-md border border-rice-100/12 bg-ink-950/38 p-1">
                <button
                  type="button"
                  onClick={() => switchMethod("manual")}
                  disabled={lines.length > 0}
                  className={`rounded px-2 py-2 text-sm transition ${
                    method === "manual"
                      ? "bg-rice-50/10 text-rice-50"
                      : "text-rice-100/58 hover:bg-rice-50/[0.06] hover:text-rice-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  手动起卦
                </button>
                <button
                  type="button"
                  onClick={() => switchMethod("random")}
                  disabled={lines.length > 0}
                  className={`rounded px-2 py-2 text-sm transition ${
                    method === "random"
                      ? "bg-rice-50/10 text-rice-50"
                      : "text-rice-100/58 hover:bg-rice-50/[0.06] hover:text-rice-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  随机摇卦
                </button>
                <button
                  type="button"
                  onClick={() => switchMethod("time")}
                  disabled={lines.length > 0}
                  className={`rounded px-2 py-2 text-sm transition ${
                    method === "time"
                      ? "bg-rice-50/10 text-rice-50"
                      : "text-rice-100/58 hover:bg-rice-50/[0.06] hover:text-rice-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  时间起卦
                </button>
              </div>
              {lines.length > 0 ? <p className="mt-2 text-xs text-rice-100/42">起卦开始后，方式会锁定以保持记录一致。</p> : null}
            </div>

            <div className="rounded-md border border-rice-100/10 bg-rice-50/[0.035] p-4 text-sm text-rice-100/64">
              起卦时间：<span className="text-rice-50">{castTime || "正在记录..."}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={completed ? "六爻已成" : `第 ${nextPosition} 次 · ${positionNames[nextPosition - 1]}`}>
          <div className="space-y-6">
            <div className="rounded-lg border border-rice-100/10 bg-ink-950/30 p-5">
              <div className="mb-5 flex justify-center gap-4">
                {previewCoins.map((coin, index) => (
                  <CoinFaceBadge key={`${coin}-${index}`} face={coin} shaking={isShaking} />
                ))}
              </div>

              {method === "manual" ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {manualCoins.map((coin, index) => (
                      <div key={index} className="rounded-md border border-rice-100/10 p-3">
                        <p className="mb-2 text-center text-xs text-rice-100/46">第 {index + 1} 枚</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(["back", "character"] as CoinFace[]).map((face) => (
                            <button
                              key={face}
                              type="button"
                              onClick={() => updateManualCoin(index, face)}
                              disabled={completed}
                              className={`rounded border px-2 py-2 text-sm transition ${
                                coin === face
                                  ? "border-cinnabar-400/50 bg-cinnabar-500/16 text-rice-50"
                                  : "border-rice-100/12 text-rice-100/58 hover:bg-rice-50/[0.06]"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {face === "back" ? "背" : "字"}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <PrimaryButton onClick={recordManualLine} disabled={completed} className="w-full">
                    记录此爻
                  </PrimaryButton>
                </div>
              ) : method === "time" ? (
                <div className="text-center">
                  <p className="mb-3 text-sm text-rice-100/60">
                    时间起卦将根据当前时间自动计算卦象
                  </p>
                  <PrimaryButton
                    onClick={() => {
                      const timeLines = createTimeBasedCoins();
                      setLines(timeLines);
                    }}
                    disabled={completed}
                    className="w-full"
                  >
                    {lines.length > 0 ? "重新起卦" : "开始起卦"}
                  </PrimaryButton>
                </div>
              ) : (
                <PrimaryButton onClick={shakeRandomLine} disabled={completed || isShaking} className="w-full">
                  {isShaking ? "铜钱落定中" : completed ? "六次已完成" : `摇第 ${nextPosition} 爻`}
                </PrimaryButton>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-rice-100/64">已记录 {lines.length} / 6 次</p>
                <div className="flex gap-2">
                  <SecondaryButton onClick={undoLastLine} disabled={lines.length === 0 || isShaking}>
                    撤回
                  </SecondaryButton>
                  <SecondaryButton onClick={resetLines} disabled={lines.length === 0 || isShaking}>
                    重来
                  </SecondaryButton>
                </div>
              </div>

              {lines.length > 0 ? (
                <div className="grid gap-2">
                  {lines.map((line) => (
                    <div
                      key={line.position}
                      className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-3 rounded-md border border-rice-100/10 bg-rice-50/[0.03] p-3 text-sm"
                    >
                      <span className="text-rice-100/58">{positionNames[line.position - 1]}</span>
                      <span className="flex gap-2">
                        {line.coins.map((coin, index) => (
                          <span key={index} className="rounded border border-rice-100/10 px-2 py-1 text-xs text-rice-100/66">
                            {coin === "back" ? "背" : "字"}
                          </span>
                        ))}
                      </span>
                      <span className={line.isMoving ? "text-cinnabar-400" : "text-rice-50"}>
                        {line.label} · {line.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed border-rice-100/12 p-4 text-sm text-rice-100/48">
                  起卦结果会从初爻开始依次记录在这里。
                </p>
              )}
            </div>

            {error ? <p className="rounded-md border border-cinnabar-400/35 bg-cinnabar-500/10 p-3 text-sm text-cinnabar-400">{error}</p> : null}

            <PrimaryButton onClick={generateResult} disabled={!completed || isShaking} className="w-full">
              生成排盘
            </PrimaryButton>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
