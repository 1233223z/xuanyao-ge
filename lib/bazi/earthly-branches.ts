/* ============================================================
 * 地支数据与工具
 * ============================================================ */
import type { EarthlyBranch, HeavenlyStem, WuXing, YinYang, HiddenStemEntry } from "@/types/bazi";
import { STEM_WU_XING } from "./heavenly-stems";

/** 地支列表 */
export const ALL_BRANCHES: EarthlyBranch[] = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/** 地支 → 阴阳 */
export const BRANCH_YIN_YANG: Record<EarthlyBranch, YinYang> = {
  子: "阳", 丑: "阴", 寅: "阳", 卯: "阴", 辰: "阳", 巳: "阴",
  午: "阳", 未: "阴", 申: "阳", 酉: "阴", 戌: "阳", 亥: "阴"
};

/** 地支 → 五行 */
export const BRANCH_WU_XING: Record<EarthlyBranch, WuXing> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水"
};

/** 地支 → 方位 */
export const BRANCH_DIRECTION: Record<EarthlyBranch, string> = {
  子: "正北", 丑: "东北", 寅: "东北", 卯: "正东", 辰: "东南", 巳: "东南",
  午: "正南", 未: "西南", 申: "西南", 酉: "正西", 戌: "西北", 亥: "西北"
};

/** 地支 → 月份（节气月，寅=正月） */
export const BRANCH_MONTH: Record<EarthlyBranch, number> = {
  寅: 1, 卯: 2, 辰: 3, 巳: 4, 午: 5, 未: 6,
  申: 7, 酉: 8, 戌: 9, 亥: 10, 子: 11, 丑: 12
};

/** 月份 → 地支 */
export const MONTH_TO_BRANCH: Record<number, EarthlyBranch> = {
  1: "寅", 2: "卯", 3: "辰", 4: "巳", 5: "午", 6: "未",
  7: "申", 8: "酉", 9: "戌", 10: "亥", 11: "子", 12: "丑"
};

/** 地支藏干 */
export const BRANCH_HIDDEN_STEMS: Record<EarthlyBranch, HiddenStemEntry[]> = {
  子: [{ stem: "癸", qi: "本气" }],
  丑: [
    { stem: "己", qi: "本气" },
    { stem: "癸", qi: "中气" },
    { stem: "辛", qi: "余气" }
  ],
  寅: [
    { stem: "甲", qi: "本气" },
    { stem: "丙", qi: "中气" },
    { stem: "戊", qi: "余气" }
  ],
  卯: [{ stem: "乙", qi: "本气" }],
  辰: [
    { stem: "戊", qi: "本气" },
    { stem: "乙", qi: "中气" },
    { stem: "癸", qi: "余气" }
  ],
  巳: [
    { stem: "丙", qi: "本气" },
    { stem: "庚", qi: "中气" },
    { stem: "戊", qi: "余气" }
  ],
  午: [
    { stem: "丁", qi: "本气" },
    { stem: "己", qi: "中气" }
  ],
  未: [
    { stem: "己", qi: "本气" },
    { stem: "丁", qi: "中气" },
    { stem: "乙", qi: "余气" }
  ],
  申: [
    { stem: "庚", qi: "本气" },
    { stem: "壬", qi: "中气" },
    { stem: "戊", qi: "余气" }
  ],
  酉: [{ stem: "辛", qi: "本气" }],
  戌: [
    { stem: "戊", qi: "本气" },
    { stem: "辛", qi: "中气" },
    { stem: "丁", qi: "余气" }
  ],
  亥: [
    { stem: "壬", qi: "本气" },
    { stem: "甲", qi: "中气" }
  ]
};

/**
 * 由六十甲子序号取得地支
 */
export function branchFromSexagenaryIndex(index: number): EarthlyBranch {
  return ALL_BRANCHES[index % 12];
}

/**
 * 地支序号（子=0, 丑=1, ...）
 */
export function branchIndex(branch: EarthlyBranch): number {
  return ALL_BRANCHES.indexOf(branch);
}

/** 地支六合 */
export function branchSixCombine(branch: EarthlyBranch): EarthlyBranch | null {
  const map: Partial<Record<EarthlyBranch, EarthlyBranch>> = {
    子: "丑", 丑: "子", 寅: "亥", 亥: "寅",
    卯: "戌", 戌: "卯", 辰: "酉", 酉: "辰",
    巳: "申", 申: "巳", 午: "未", 未: "午"
  };
  return map[branch] ?? null;
}

/** 地支三合 */
export function branchTripleCombine(branch: EarthlyBranch): EarthlyBranch[] | null {
  const map: Record<string, EarthlyBranch[]> = {
    申子辰: ["申", "子", "辰"],
    亥卯未: ["亥", "卯", "未"],
    寅午戌: ["寅", "午", "戌"],
    巳酉丑: ["巳", "酉", "丑"]
  };
  for (const [key, branches] of Object.entries(map)) {
    if (branches.includes(branch)) return branches;
  }
  return null;
}

/** 地支六冲 */
export function branchSixClash(branch: EarthlyBranch): EarthlyBranch {
  const map: Record<EarthlyBranch, EarthlyBranch> = {
    子: "午", 丑: "未", 寅: "申", 卯: "酉", 辰: "戌", 巳: "亥",
    午: "子", 未: "丑", 申: "寅", 酉: "卯", 戌: "辰", 亥: "巳"
  };
  return map[branch];
}

/** 地支六害 */
export function branchSixHarm(branch: EarthlyBranch): EarthlyBranch | null {
  const map: Partial<Record<EarthlyBranch, EarthlyBranch>> = {
    子: "未", 丑: "午", 寅: "巳", 卯: "辰",
    巳: "寅", 午: "丑", 未: "子", 申: "亥",
    酉: "戌", 戌: "酉", 亥: "申"
  };
  return map[branch] ?? null;
}

/** 地支三刑 */
export function branchPenalty(branch: EarthlyBranch): string {
  const map: Partial<Record<EarthlyBranch, string>> = {
    寅: "寅巳相刑", 巳: "寅巳相刑",
    丑: "丑未戌相刑", 未: "丑未戌相刑", 戌: "丑未戌相刑",
    子: "子卯相刑", 卯: "子卯相刑",
    辰: "自刑", 午: "自刑", 酉: "自刑", 亥: "自刑"
  };
  return map[branch] ?? "";
}

/**
 * 地图 → 时辰
 * 子时 23-1, 丑时 1-3, 寅时 3-5, ...
 */
export function hourToBranch(hour: number): EarthlyBranch {
  if (hour >= 23 || hour < 1) return "子";
  if (hour < 3) return "丑";
  if (hour < 5) return "寅";
  if (hour < 7) return "卯";
  if (hour < 9) return "辰";
  if (hour < 11) return "巳";
  if (hour < 13) return "午";
  if (hour < 15) return "未";
  if (hour < 17) return "申";
  if (hour < 19) return "酉";
  if (hour < 21) return "戌";
  return "亥";
}

/** 时辰 → 地支序号（子=0, ..., 亥=11） */
export function hourToBranchIndex(hour: number): number {
  return branchIndex(hourToBranch(hour));
}
