/* ============================================================
 * 喜用神 & 忌神分析
 * ============================================================ */
import type { WuXing, FourPillars, DeityAdvice, DayMasterStrength } from "@/types/bazi";
import { STEM_WU_XING } from "./heavenly-stems";
import { BRANCH_WU_XING } from "./earthly-branches";
import { GENERATES, CONTROLS } from "./five-elements";

/**
 * 判断喜用神和忌神
 *
 * 原则：
 *   日主偏强 → 喜克泄耗（官杀、食伤、财），忌生扶（印、比劫）
 *   日主偏弱 → 喜生扶（印、比劫），忌克泄耗（官杀、食伤、财）
 *   特殊格局（从旺/从弱）另有规则
 *
 * 调候因素：
 *   夏生（巳午未月）→ 喜水调候
 *   冬生（亥子丑月）→ 喜火调候
 */
export function determineDeities(
  fourPillars: FourPillars,
  dayMasterStem: string,
  dayMasterWx: WuXing,
  strength: DayMasterStrength
): DeityAdvice {
  const monthBranch = fourPillars.month.branch;
  const monthWx = BRANCH_WU_XING[monthBranch];
  const monthIdx = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"].indexOf(monthBranch);

  let favorable: WuXing[] = [];
  let unfavorable: WuXing[] = [];
  let favorableExplanation = "";
  let unfavorableExplanation = "";
  let tiáoHòu = "";

  // === 基础喜忌 ===
  if (strength === "偏强") {
    // 日主强 → 喜克泄耗
    const toControl = CONTROLS[dayMasterWx];   // 我克者为财
    const toGenerate = GENERATES[dayMasterWx]; // 我生者为食伤
    const controlsMe = findControls(dayMasterWx); // 克我者为官杀

    favorable = [controlsMe, toGenerate, toControl].filter((v, i, a) => a.indexOf(v) === i);
    unfavorable = [dayMasterWx, GENERATES[controlsMe] || dayMasterWx].filter((v, i, a) => a.indexOf(v) === i);

    favorableExplanation = `日主${dayMasterStem}偏强，喜克、泄、耗，宜用${favorable.join("、")}。${controlsMe}为官杀制身，${toGenerate}为食伤泄秀，${toControl}为财星耗身。`;
    unfavorableExplanation = `忌生扶，${unfavorable.join("、")}会加重日主过旺之势，易导致固执、过刚易折。`;
  } else if (strength === "偏弱") {
    // 日主弱 → 喜生扶
    const generatesMe = findGenerates(dayMasterWx); // 生我者为印
    favorable = [generatesMe, dayMasterWx];

    const controlsMe = findControls(dayMasterWx);
    const toControl = CONTROLS[dayMasterWx];
    unfavorable = [controlsMe, toControl];

    favorableExplanation = `日主${dayMasterStem}偏弱，喜生扶，宜用${favorable.join("、")}。${generatesMe}为印星生身，${dayMasterWx}为比劫助身。`;
    unfavorableExplanation = `忌克泄耗，${unfavorable.join("、")}会削弱日主，易导致精力不足、压力过大。`;
  } else {
    // 中和
    favorable = ["木", "火", "土", "金", "水"];
    unfavorable = [];
    favorableExplanation = `日主${dayMasterStem}中和，五行平衡，宜根据大运流年走势灵活调整。`;
    unfavorableExplanation = "中和之命，忌某一五行过旺打破平衡。";
  }

  // === 调候 ===
  if (monthIdx >= 3 && monthIdx <= 5) {
    // 夏生（巳午未）
    if (!favorable.includes("水")) {
      favorable = [...favorable, "水"];
    }
    tiáoHòu = `生于${monthBranch}月，火旺天热，优先取水调候，以平衡炎燥之气。`;
  } else if (monthIdx >= 9 || monthIdx <= 1) {
    // 冬生（亥子丑或部分寅）
    if (!favorable.includes("火")) {
      favorable = [...favorable, "火"];
    }
    tiáoHòu = `生于${monthBranch}月，寒气较重，优先取火调候，以暖局为要。`;
  } else if (monthIdx === 1 || monthIdx === 2) {
    tiáoHòu = `生于${monthBranch}月，木旺之季，宜视八字中火土金水配置灵活取用。`;
  } else {
    tiáoHòu = `生于${monthBranch}月，金旺之季，宜结合八字具体配置取用。`;
  }

  return {
    favorable: [...new Set(favorable)],
    unfavorable: [...new Set(unfavorable)],
    favorableExplanation,
    unfavorableExplanation,
    tiáoHòu
  };
}

/**
 * 克我者
 */
function findControls(wx: WuXing): WuXing {
  const map: Record<WuXing, WuXing> = {
    木: "金", 火: "水", 土: "木", 金: "火", 水: "土"
  };
  return map[wx];
}

/**
 * 生我者
 */
function findGenerates(wx: WuXing): WuXing {
  const map: Record<WuXing, WuXing> = {
    木: "水", 火: "木", 土: "火", 金: "土", 水: "金"
  };
  return map[wx];
}
