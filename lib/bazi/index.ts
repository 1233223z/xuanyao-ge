/* ============================================================
 * 八字排盘 - 主入口
 * ============================================================ */
import type { BaziResult, Gender, WuXingCount, FourPillars } from "@/types/bazi";
import { STEM_WU_XING } from "./heavenly-stems";
import { BRANCH_WU_XING, BRANCH_HIDDEN_STEMS } from "./earthly-branches";
import { calculateFourPillars, fourPillarsShort } from "./pillar-calculator";
import { analyzeDayMaster } from "./day-master";
import { determineDeities } from "./deities";
import { calculateDaYun, getCurrentDaYunDescription } from "./da-yun";
import { calculateCurrentLiuNian } from "./liu-nian";
import { calculateTenGod } from "./ten-gods";
import { calculateShenSha } from "./shen-sha";
import {
  interpretPersonality,
  interpretCareerWealth,
  interpretRelationship,
  interpretHealth
} from "./interpretation";

/** 生成唯一 ID */
function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** 格式化时间 */
function formatNow() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** 计算五行分布 */
function calculateWuXingDistribution(fourPillars: FourPillars): WuXingCount[] {
  const map: Record<string, { stemCount: number; branchCount: number; hiddenCount: number }> = {
    木: { stemCount: 0, branchCount: 0, hiddenCount: 0 },
    火: { stemCount: 0, branchCount: 0, hiddenCount: 0 },
    土: { stemCount: 0, branchCount: 0, hiddenCount: 0 },
    金: { stemCount: 0, branchCount: 0, hiddenCount: 0 },
    水: { stemCount: 0, branchCount: 0, hiddenCount: 0 }
  };

  for (const pillar of [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]) {
    const sx = STEM_WU_XING[pillar.stem];
    map[sx].stemCount++;

    const bx = BRANCH_WU_XING[pillar.branch];
    map[bx].branchCount++;

    for (const h of BRANCH_HIDDEN_STEMS[pillar.branch]) {
      const hx = STEM_WU_XING[h.stem];
      map[hx].hiddenCount++;
    }
  }

  return Object.entries(map).map(([wx, counts]) => ({
    wuXing: wx as WuXingCount["wuXing"],
    ...counts,
    total: counts.stemCount + counts.branchCount + counts.hiddenCount
  }));
}

/** 计算十神分布 */
function calculateTenGodDistribution(fourPillars: FourPillars) {
  const dm = fourPillars.day.stem;
  const result: any[] = [];

  const pillarKeys: Array<{ key: "year" | "month" | "day" | "hour"; label: "年" | "月" | "日" | "时" }> = [
    { key: "year", label: "年" },
    { key: "month", label: "月" },
    { key: "day", label: "日" },
    { key: "hour", label: "时" }
  ];

  for (const { key, label } of pillarKeys) {
    const p = fourPillars[key];
    const tg = calculateTenGod(dm, p.stem);
    result.push({ stem: p.stem, pillar: label, tenGod: tg, position: "天干" });

    for (const h of p.hiddenStems) {
      const htg = calculateTenGod(dm, h.stem);
      result.push({ stem: h.stem, pillar: label, tenGod: htg, position: "藏干", branch: p.branch });
    }
  }

  return result as import("@/types/bazi").TenGodDistribution;
}

/**
 * 主函数：八字排盘
 */
export function calculateBazi(
  name: string,
  gender: Gender,
  birthDate: string,  // YYYY-MM-DD
  birthTime: string,  // HH:mm
  birthPlace: string,
  useTrueSolarTime: boolean
): BaziResult {
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm] = birthTime.split(":").map(Number);
  const hour = hh + mm / 60;

  // 四柱
  const fourPillars = calculateFourPillars(y, m, d, Math.round(hour));

  // 日主
  const dayMaster = analyzeDayMaster(fourPillars);

  // 五行分布
  const wuXingDistribution = calculateWuXingDistribution(fourPillars);

  // 十神分布
  const tenGodDistribution = calculateTenGodDistribution(fourPillars);

  // 喜用神 / 忌神
  const deities = determineDeities(fourPillars, dayMaster.stem, dayMaster.wuXing, dayMaster.strength);

  // 大运
  const daYun = calculateDaYun(fourPillars, gender, y, m, d);

  // 流年
  const currentLiuNian = calculateCurrentLiuNian(fourPillars, daYun);

  // 神煞
  const shenSha = calculateShenSha(fourPillars);

  // 各维度分析
  const personality = interpretPersonality(fourPillars, dayMaster, deities);
  const careerWealth = interpretCareerWealth(fourPillars, dayMaster, deities, daYun);
  const relationship = interpretRelationship(fourPillars, dayMaster, gender);
  const health = interpretHealth(fourPillars, dayMaster);

  return {
    id: createId(),
    name,
    gender,
    birthDate,
    birthTime,
    birthPlace,
    usedTrueSolarTime: useTrueSolarTime,
    calculatedAt: formatNow(),
    fourPillars,
    dayMaster,
    wuXingDistribution,
    tenGodDistribution,
    monthLing: {
      stem: fourPillars.month.stem,
      branch: fourPillars.month.branch,
      season: getSeason(fourPillars.month.branch)
    },
    deities,
    shenSha,
    daYun,
    currentLiuNian,
    personality,
    careerWealth,
    relationship,
    health,
    hasDetailedReport: false
  };
}

function getSeason(branch: string): string {
  const map: Record<string, string> = {
    寅: "春季", 卯: "春季", 辰: "春季末",
    巳: "夏季", 午: "夏季", 未: "夏季末",
    申: "秋季", 酉: "秋季", 戌: "秋季末",
    亥: "冬季", 子: "冬季", 丑: "冬季末"
  };
  return map[branch] || "";
}

export { fourPillarsShort } from "./pillar-calculator";
