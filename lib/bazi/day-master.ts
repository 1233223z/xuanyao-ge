/* ============================================================
 * 日主强弱分析
 * ============================================================ */
import type { HeavenlyStem, EarthlyBranch, WuXing, FourPillars, DayMasterAnalysis, DayMasterStrength } from "@/types/bazi";
import { STEM_WU_XING, STEM_YIN_YANG, ALL_STEMS, stemIndex } from "./heavenly-stems";
import { BRANCH_WU_XING, BRANCH_HIDDEN_STEMS, BRANCH_MONTH, MONTH_TO_BRANCH, branchIndex, ALL_BRANCHES } from "./earthly-branches";
import { GENERATES, WU_XING_SEASON } from "./five-elements";

/**
 * 日主强弱分析
 *
 * 评分体系：
 *   得令（月令）：+40分
 *   得地（地支主气根）：+20分/个
 *   得势（天干比劫）：+10分/个
 *   印星生扶：+5分/个
 */
export function analyzeDayMaster(fourPillars: FourPillars): DayMasterAnalysis {
  const dayMaster = fourPillars.day.stem;
  const dmWx = STEM_WU_XING[dayMaster];
  const dmYy = STEM_YIN_YANG[dayMaster];

  let score = 0;
  const reasoningParts: string[] = [];

  // 1. 得令（月令）：日主五行在月令是否旺相
  const monthBranch = fourPillars.month.branch;
  const monthWx = BRANCH_WU_XING[monthBranch];
  const monthBranchIndex = BRANCH_MONTH[monthBranch];

  // 月令季节的旺相五行
  const seasonWx = getSeasonWuXing(monthBranch);

  if (seasonWx === dmWx) {
    score += 40;
    reasoningParts.push(`日主${dayMaster}生于${monthBranch}月（${WU_XING_SEASON[dmWx]}），得令，旺相有力`);
  } else if (GENERATES[seasonWx] === dmWx) {
    // 相生（相）: 季节五行生日主
    score += 25;
    reasoningParts.push(`日主${dayMaster}得月令相生，有余气`);
  } else {
    // 休囚
    reasoningParts.push(`日主${dayMaster}生于${monthBranch}月（${WU_XING_SEASON[seasonWx]}），不得令，处于休囚之位`);
  }

  // 2. 得地：地支根气
  const allBranches = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  for (const branch of allBranches) {
    const hiddenStems = BRANCH_HIDDEN_STEMS[branch];
    const mainStem = hiddenStems[0].stem;
    const mainWx = STEM_WU_XING[mainStem];

    if (mainWx === dmWx) {
      score += 20;
      reasoningParts.push(`地支${branch}藏${mainStem}（${dmWx}），为日主强根`);
    }
  }

  // 3. 得势：天干比劫
  const allStems = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.hour.stem];
  for (const stem of allStems) {
    if (STEM_WU_XING[stem] === dmWx && stem !== dayMaster) {
      score += 10;
      reasoningParts.push(`天干${stem}与日主同为${dmWx}，为比劫帮扶`);
    }
  }

  // 4. 印星生扶
  for (const stem of allStems) {
    if (GENERATES[STEM_WU_XING[stem]] === dmWx) {
      score += 5;
      reasoningParts.push(`天干${stem}为日主${dayMaster}之印星，生扶有力`);
    }
  }

  // 判断强弱
  let strength: DayMasterStrength;
  if (score >= 80) {
    strength = "偏强";
  } else if (score >= 50) {
    strength = "中和";
  } else {
    strength = "偏弱";
  }

  return {
    stem: dayMaster,
    yinYang: dmYy,
    wuXing: dmWx,
    strength,
    score,
    reasoning: reasoningParts.join("；")
  };
}

/**
 * 根据地支确定季节的旺相五行
 */
function getSeasonWuXing(branch: EarthlyBranch): WuXing {
  const idx = branchIndex(branch);
  if (idx >= 2 && idx <= 4) return "木";  // 寅卯辰 → 春 → 木
  if (idx >= 4 && idx <= 6) return "火";  // 巳午未 → 夏 → 火
  if (idx >= 6 && idx <= 9) return "金";  // 申酉戌 → 秋 → 金
  if (idx >= 9 || idx <= 2) return "水";  // 亥子丑 → 冬 → 水
  return "土";
}
