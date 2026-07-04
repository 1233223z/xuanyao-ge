/* ============================================================
 * 流年计算
 * ============================================================ */
import type { LiuNianAnalysis, HeavenlyStem, EarthlyBranch, FourPillars, WuXing } from "@/types/bazi";
import { ALL_STEMS, STEM_WU_XING, stemIndex } from "./heavenly-stems";
import { ALL_BRANCHES, BRANCH_WU_XING, branchIndex, branchSixClash } from "./earthly-branches";
import { GENERATES, CONTROLS } from "./five-elements";
import { calculateTenGod } from "./ten-gods";
import type { DaYunResult } from "@/types/bazi";

/**
 * 计算当前流年
 */
export function calculateCurrentLiuNian(
  fourPillars: FourPillars,
  daYun: DaYunResult
): LiuNianAnalysis {
  const currentYear = new Date().getFullYear();
  return calculateLiuNian(fourPillars, daYun, currentYear);
}

/**
 * 计算指定年份的流年
 */
export function calculateLiuNian(
  fourPillars: FourPillars,
  daYun: DaYunResult,
  year: number
): LiuNianAnalysis {
  const sexagenaryIndex = ((year - 4) % 60 + 60) % 60;
  const stem: HeavenlyStem = ALL_STEMS[sexagenaryIndex % 10];
  const branch: EarthlyBranch = ALL_BRANCHES[sexagenaryIndex % 12];
  const wx = STEM_WU_XING[stem];

  // 流年与八字的关系分析
  const { relationship, assessment } = analyzeLiuNianRelationship(fourPillars, stem, branch, year);

  // 流年与大运的关系
  const currentDaYun = daYun.records[daYun.currentIndex];
  let daYunInteraction = "";
  if (currentDaYun) {
    daYunInteraction = `流年${stem}${branch}与大运${currentDaYun.stem}${currentDaYun.branch}相遇，`;
    const daYunStemIdx = stemIndex(currentDaYun.stem);
    const liuNianStemIdx = stemIndex(stem);
    if (daYunStemIdx === liuNianStemIdx) {
      daYunInteraction += "岁运同干，该年天干五行力量倍增。";
    }
  }

  // 生成详细分析
  const dayMaster = fourPillars.day.stem;
  const tenGod = calculateTenGod(dayMaster, stem);
  const detail = [
    `流年${stem}${branch}，天干为${stem}（${wx}），为日主之${tenGod}。`,
    relationship,
    daYunInteraction,
    assessment === "吉" ? "总体运势偏向有利，宜把握机会。"
    : assessment === "凶" ? "需多加谨慎，凡事留有余地。"
    : assessment === "变动" ? "多有变化，宜随机应变。"
    : "运势平稳，按部就班即可。"
  ].filter(Boolean).join("");

  return {
    year,
    stem,
    branch,
    wuXing: wx,
    relationship,
    assessment,
    summary: `${year}年（${stem}${branch}），${wx}年，流年运势${assessment === "吉" ? "较好" : assessment === "凶" ? "需谨慎" : assessment === "变动" ? "多变动" : "平稳"}。`,
    detail
  };
}

/**
 * 分析流年与四柱的关系
 */
function analyzeLiuNianRelationship(
  fourPillars: FourPillars,
  liuNianStem: HeavenlyStem,
  liuNianBranch: EarthlyBranch,
  year: number
): { relationship: string; assessment: "吉" | "凶" | "平" | "变动" } {
  const parts: string[] = [];
  let score = 0;

  // 检查与年柱的关系
  const yearBranch = fourPillars.year.branch;
  const yearStem = fourPillars.year.stem;
  if (branchSixClash(yearBranch) === liuNianBranch) {
    parts.push(`流年地支${liuNianBranch}冲年柱${yearStem}${yearBranch}，根基有动。`);
    score -= 2;
  }

  // 检查与日柱的关系
  const dayBranch = fourPillars.day.branch;
  const dayStem = fourPillars.day.stem;
  if (branchSixClash(dayBranch) === liuNianBranch) {
    parts.push(`值年地支冲日支${dayBranch}（夫妻宫），感情或自身易有波动。`);
    score -= 2;
  }

  // 流年地支与月支相同
  const monthBranch = fourPillars.month.branch;
  if (monthBranch === liuNianBranch) {
    parts.push(`流年与月柱同支，称为「伏吟」，该年易有重复、停滞之事。`);
    score -= 1;
  }

  // 本命年
  const yearBranchIndex = branchIndex(fourPillars.year.branch);
  const liuNianBranchIndex = branchIndex(liuNianBranch);
  if (yearBranchIndex === liuNianBranchIndex) {
    parts.push(`今年为值太岁之年（本命年），宜守不宜攻。`);
    score -= 1;
  }

  // 流年天干生日主
  const dayMaster = fourPillars.day.stem;
  const dmWx = STEM_WU_XING[dayMaster];
  const lnWx = STEM_WU_XING[liuNianStem];
  if (GENERATES[lnWx] === dmWx) {
    parts.push(`流年天干${liuNianStem}（${lnWx}）生日主${dayMaster}（${dmWx}），有外力相助之意。`);
    score += 2;
  }
  if (CONTROLS[lnWx] === dmWx) {
    parts.push(`流年天干${liuNianStem}（${lnWx}）克日主${dayMaster}（${dmWx}），压力增大。`);
    score -= 1;
  }

  let assessment: "吉" | "凶" | "平" | "变动";
  if (score >= 3) assessment = "吉";
  else if (score >= -1) assessment = "平";
  else if (score >= -3) assessment = "变动";
  else assessment = "凶";

  return {
    relationship: parts.join("") || "流年与命局无显著冲合，运势相对平稳。",
    assessment
  };
}
