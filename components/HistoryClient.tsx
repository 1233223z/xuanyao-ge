"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryLink, SecondaryButton } from "@/components/PrimaryButton";
import { deleteRecord, readHistory } from "@/lib/storage";
import type { StoredDivinationRecord } from "@/types/yao";

const BAZI_HISTORY_KEY = "xuanyao-bazi-history";

type BaziHistoryRecord = {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  pillarShort: string;
  dayMaster: string;
  savedAt: string;
};

export function HistoryClient() {
  const [records, setRecords] = useState<StoredDivinationRecord[]>([]);
  const [baziRecords, setBaziRecords] = useState<BaziHistoryRecord[]>([]);
  const [tab, setTab] = useState<"liuyao" | "bazi">("liuyao");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(readHistory());
    try {
      const raw = localStorage.getItem(BAZI_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setBaziRecords(parsed);
      }
    } catch { /* noop */ }
  }, []);

  function removeRecord(id: string) {
    setRecords(deleteRecord(id));
    setPendingDeleteId(null);
  }

  function removeBazi(id: string) {
    const next = baziRecords.filter(r => r.id !== id);
    setBaziRecords(next);
    localStorage.setItem(BAZI_HISTORY_KEY, JSON.stringify(next));
    setPendingDeleteId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-xs tracking-widest text-gold-400/60">HISTORY</p>
          <h1 className="mt-1 font-serif text-3xl text-rice-50">历史记录</h1>
          <p className="mt-2 text-sm text-rice-100/50">记录保存在当前浏览器本地，不会上传服务器。</p>
        </div>
        <div className="flex gap-2">
          <PrimaryLink href="/divination">新起一卦</PrimaryLink>
          <PrimaryLink href="/bazi">八字排盘</PrimaryLink>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="mb-6 flex gap-1 rounded-lg border border-brass-300/10 bg-ink-850 p-1">
        <button
          type="button"
          onClick={() => setTab("liuyao")}
          className={`flex-1 rounded-md px-4 py-1.5 text-sm transition ${tab === "liuyao" ? "bg-gold-400/15 text-gold-300" : "text-rice-100/50 hover:text-rice-50"}`}
        >
          六爻占事（{records.length}）
        </button>
        <button
          type="button"
          onClick={() => setTab("bazi")}
          className={`flex-1 rounded-md px-4 py-1.5 text-sm transition ${tab === "bazi" ? "bg-gold-400/15 text-gold-300" : "text-rice-100/50 hover:text-rice-50"}`}
        >
          八字排盘（{baziRecords.length}）
        </button>
      </div>

      {tab === "liuyao" && (
        <>
          {records.length === 0 ? (
            <div className="bazi-card rounded-xl p-8 text-center">
              <p className="text-rice-100/60">还没有保存的六爻占事记录</p>
              <Link href="/divination" className="mt-3 inline-block text-sm text-gold-400 hover:text-gold-300">
                开始起卦 →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <article key={record.id} className="bazi-card rounded-xl p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-lg text-rice-50">{record.title}</h2>
                        <span className="rounded border border-brass-300/20 px-2 py-1 text-xs text-rice-100/50">
                          {record.primaryHexagram.name}
                          {record.changedHexagram ? ` → ${record.changedHexagram.name}` : " · 无变卦"}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-rice-100/60">{record.question}</p>
                      <p className="mt-1 text-xs text-rice-100/40">起卦：{record.castTime}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/result?id=${record.id}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-brass-300/20 bg-ink-800 px-3 py-2 text-sm text-rice-50 transition hover:bg-ink-700"
                      >
                        查看
                      </Link>
                      {pendingDeleteId === record.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => removeRecord(record.id)}
                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-cinnabar-400/40 bg-cinnabar-500/14 px-3 py-2 text-sm text-cinnabar-400 transition hover:bg-cinnabar-500/20"
                          >
                            确认删除
                          </button>
                          <SecondaryButton onClick={() => setPendingDeleteId(null)}>取消</SecondaryButton>
                        </>
                      ) : (
                        <SecondaryButton onClick={() => setPendingDeleteId(record.id)}>删除</SecondaryButton>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "bazi" && (
        <>
          {baziRecords.length === 0 ? (
            <div className="bazi-card rounded-xl p-8 text-center">
              <p className="text-rice-100/60">还没有保存的八字排盘记录</p>
              <Link href="/bazi" className="mt-3 inline-block text-sm text-gold-400 hover:text-gold-300">
                开始排盘 →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {baziRecords.map((record) => (
                <article key={record.id} className="bazi-card rounded-xl p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-lg text-rice-50">{record.name} · 八字命盘</h2>
                        <span className="rounded border border-brass-300/20 px-2 py-1 text-xs text-rice-100/50">
                          {record.pillarShort}
                        </span>
                        <span className="rounded border border-cinnabar-400/30 bg-cinnabar-500/10 px-2 py-1 text-xs text-cinnabar-400">
                          {record.dayMaster}日主
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-rice-100/40">{record.gender} · {record.birthDate} · {record.savedAt}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/bazi/result?id=${record.id}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-brass-300/20 bg-ink-800 px-3 py-2 text-sm text-rice-50 transition hover:bg-ink-700"
                      >
                        查看
                      </Link>
                      {pendingDeleteId === record.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => removeBazi(record.id)}
                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-cinnabar-400/40 bg-cinnabar-500/14 px-3 py-2 text-sm text-cinnabar-400"
                          >
                            确认删除
                          </button>
                          <SecondaryButton onClick={() => setPendingDeleteId(null)}>取消</SecondaryButton>
                        </>
                      ) : (
                        <SecondaryButton onClick={() => setPendingDeleteId(record.id)}>删除</SecondaryButton>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
