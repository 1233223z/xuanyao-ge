"use client";

import type { BaziResult } from "@/types/bazi";
import { STEM_YIN_YANG } from "@/lib/bazi/heavenly-stems";
import { BRANCH_YIN_YANG } from "@/lib/bazi/earthly-branches";

type Props = {
  result: BaziResult;
};

const STEM_COLORS: Record<string, string> = {
  甲: "text-jade-400", 乙: "text-jade-300",
  丙: "text-cinnabar-400", 丁: "text-cinnabar-300",
  戊: "text-gold-400", 己: "text-gold-300",
  庚: "text-rice-200", 辛: "text-rice-100",
  壬: "text-jade-300", 癸: "text-jade-200"
};

function PillarBlock({ label, stem, branch, naYin }: { label: string; stem: string; branch: string; naYin?: string }) {
  const stemColor = STEM_COLORS[stem] || "text-rice-50";
  const stemKey = stem as import("@/types/bazi").HeavenlyStem;
  const branchKey = branch as import("@/types/bazi").EarthlyBranch;
  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-xs text-rice-100/50">{label}</span>
      <div className="bazi-card rounded-lg px-5 py-3 text-center">
        <div className={`text-2xl font-bold tracking-widest ${stemColor}`}>
          {stem}{branch}
        </div>
        <div className="mt-1 text-xs text-rice-100/40">
          {STEM_YIN_YANG[stemKey]}{stem} · {BRANCH_YIN_YANG[branchKey]}{branch}
        </div>
        {naYin && (
          <div className="mt-1 text-[11px] text-rice-100/30">{naYin}</div>
        )}
      </div>
    </div>
  );
}

export default function BaziResultCard({ result }: Props) {
  const { fourPillars, dayMaster } = result;

  return (
    <div className="bazi-card rounded-xl p-6">
      {/* 头部信息 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-rice-50">{result.name} · 八字命盘</h2>
          <p className="mt-1 text-sm text-rice-100/50">
            {result.gender} · {result.birthDate} {result.birthTime}
            {result.birthPlace !== "" && ` · ${result.birthPlace}`}
          </p>
        </div>
        <div className="rounded border border-cinnabar-400/30 bg-cinnabar-500/10 px-2.5 py-1 text-xs text-cinnabar-400">
          日主：{dayMaster.stem}（{dayMaster.wuXing} · {dayMaster.yinYang}）
        </div>
      </div>

      {/* 四柱 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PillarBlock label="年柱" stem={fourPillars.year.stem} branch={fourPillars.year.branch} naYin={fourPillars.year.naYin} />
        <PillarBlock label="月柱" stem={fourPillars.month.stem} branch={fourPillars.month.branch} naYin={fourPillars.month.naYin} />
        <PillarBlock label="日柱" stem={fourPillars.day.stem} branch={fourPillars.day.branch} naYin={fourPillars.day.naYin} />
        <PillarBlock label="时柱" stem={fourPillars.hour.stem} branch={fourPillars.hour.branch} naYin={fourPillars.hour.naYin} />
      </div>

      {/* 日主强弱 */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-300/20 bg-ink-800 px-3 py-1 text-xs text-rice-100/70">
          日主{dayMaster.stem} · {dayMaster.wuXing} · {dayMaster.yinYang}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-300/20 bg-ink-800 px-3 py-1 text-xs text-rice-100/70">
          强弱：{dayMaster.strength}（{dayMaster.score}分）
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-300/20 bg-ink-800 px-3 py-1 text-xs text-rice-100/70">
          用神：{result.deities.favorable.join("、")}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brass-300/20 bg-ink-800 px-3 py-1 text-xs text-rice-100/70">
          忌神：{result.deities.unfavorable.join("、")}
        </span>
      </div>
    </div>
  );
}
