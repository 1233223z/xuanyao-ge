"use client";

import type { WuXingCount } from "@/types/bazi";
import { WU_XING_COLORS } from "@/lib/bazi/five-elements";

type Props = {
  distribution: WuXingCount[];
  compact?: boolean;
};

const WX_LABELS: Record<string, string> = {
  木: "木", 火: "火", 土: "土", 金: "金", 水: "水"
};

export default function BaziChart({ distribution, compact }: Props) {
  const maxVal = Math.max(...distribution.map((d) => d.total), 1);

  return (
    <div className={compact ? "" : "bazi-card rounded-xl p-5"}>
      {!compact && (
        <h3 className="mb-4 text-sm font-medium text-rice-50">五行分布</h3>
      )}

      {/* 柱状图 */}
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {distribution.map((d) => {
          const pct = (d.total / maxVal) * 100;
          const color = WU_XING_COLORS[d.wuXing];
          return (
            <div key={d.wuXing} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-rice-100/60">{d.total}</span>
              <div className="flex h-24 w-8 items-end sm:h-32 sm:w-10">
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(pct, 4)}%`,
                    background: `linear-gradient(180deg, ${color}, ${color}88)`
                  }}
                />
              </div>
              <span className="text-xs" style={{ color }}>{WX_LABELS[d.wuXing]}</span>
              {!compact && (
                <div className="text-[10px] text-rice-100/40">
                  {d.stemCount ? `天干${d.stemCount}` : ""}
                  {d.hiddenCount ? `+藏${d.hiddenCount}` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 环形图替代视觉 */}
      {!compact && (
        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {distribution.map((d) => {
            const color = WU_XING_COLORS[d.wuXing];
            return (
              <div
                key={d.wuXing}
                className="rounded border border-brass-300/10 bg-ink-800 p-2 text-center"
              >
                <div className="text-sm font-medium" style={{ color }}>
                  {d.wuXing}
                </div>
                <div className="mt-0.5 text-lg font-bold text-rice-50">{d.total}</div>
                <div className="text-[10px] text-rice-100/40">
                  {d.stemCount}天干 {d.branchCount}地支 {d.hiddenCount}藏
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
