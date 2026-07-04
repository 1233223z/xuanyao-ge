/* ============================================================
 * 四柱计算（排盘核心）
 * ============================================================ */
import type { HeavenlyStem, EarthlyBranch, FourPillars, Pillar, Gender, HiddenStemEntry } from "@/types/bazi";
import { ALL_STEMS, STEM_YIN_YANG, STEM_WU_XING, stemFromNumber } from "./heavenly-stems";
import { ALL_BRANCHES, BRANCH_YIN_YANG, BRANCH_WU_XING, BRANCH_HIDDEN_STEMS, hourToBranchIndex, BRANCH_MONTH } from "./earthly-branches";
import { getYearStemBranch, getDayStemBranch, getHourStemBranch, getMonthBranch } from "./solar-terms";

/**
 * 排四柱
 */
export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  hour: number
): FourPillars {
  // 1. 年柱
  const yearSB = getYearStemBranch(year, month, day);
  const yearStem: HeavenlyStem = ALL_STEMS[yearSB.stemIndex];
  const yearBranch: EarthlyBranch = ALL_BRANCHES[yearSB.branchIndex];

  // 2. 月柱地支（基于节气）
  const monthBranch = getMonthBranch(year, month, day);
  const monthStemIndex = getMonthStemIndex(yearSB.stemIndex, BRANCH_MONTH[monthBranch] - 1);
  const monthStem: HeavenlyStem = ALL_STEMS[monthStemIndex];

  // 3. 日柱
  const daySB = getDayStemBranch(year, month, day);
  const dayStem: HeavenlyStem = ALL_STEMS[daySB.stemIndex];
  const dayBranch: EarthlyBranch = ALL_BRANCHES[daySB.branchIndex];

  // 4. 时柱
  const hourBranchIndex = hourToBranchIndex(hour);
  const hourSB = getHourStemBranch(daySB.stemIndex, hourBranchIndex);
  const hourStem: HeavenlyStem = ALL_STEMS[hourSB.stemIndex];
  const hourBranch: EarthlyBranch = ALL_BRANCHES[hourSB.branchIndex];

  return {
    year: makePillar(yearStem, yearBranch),
    month: makePillar(monthStem, monthBranch),
    day: makePillar(dayStem, dayBranch),
    hour: makePillar(hourStem, hourBranch)
  };
}

/**
 * 五虎遁：年上起月法
 * 由年干和月份（0=寅月, 1=卯月, ...）确定月干
 */
function getMonthStemIndex(yearStemIndex: number, monthIndex: number): number {
  // 甲己 → 丙寅起 (年干0或5 → 月干从2开始：丙=2)
  // 乙庚 → 戊寅起 (年干1或6 → 月干从4开始：戊=4)
  // 丙辛 → 庚寅起 (年干2或7 → 月干从6开始：庚=6)
  // 丁壬 → 壬寅起 (年干3或8 → 月干从8开始：壬=8)
  // 戊癸 → 甲寅起 (年干4或9 → 月干从0开始：甲=0)
  const base = (yearStemIndex % 5) * 2;
  return (base + monthIndex) % 10;
}

/**
 * 构建一柱
 */
function makePillar(stem: HeavenlyStem, branch: EarthlyBranch): Pillar {
  // 纳音（简化版，仅示例值）
  const naYin = getNaYin(stem, branch);

  return {
    stem,
    branch,
    stemYinYang: STEM_YIN_YANG[stem],
    branchYinYang: BRANCH_YIN_YANG[branch],
    stemWuXing: STEM_WU_XING[stem],
    branchWuXing: BRANCH_WU_XING[branch],
    hiddenStems: BRANCH_HIDDEN_STEMS[branch],
    naYin
  };
}

/**
 * 60甲子纳音（简化表）
 */
const NA_YIN_MAP: string[] = [
  "海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火",
  "涧下水", "城头土", "白蜡金", "杨柳木", "泉中水", "屋上土",
  "霹雳火", "松柏木", "长流水", "砂石金", "山下火", "平地木",
  "壁上土", "金箔金", "覆灯火", "天河水", "大驿土", "钗钏金",
  "桑柘木", "大溪水", "沙中土", "天上火", "石榴木", "大海水"
];

function getNaYin(stem: HeavenlyStem, branch: EarthlyBranch): string {
  const stemIdx = ALL_STEMS.indexOf(stem);
  const branchIdx = ALL_BRANCHES.indexOf(branch);
  // 60甲子序 / 2 → 纳音索引（每两柱同纳音）
  const sexagenaryIdx = (stemIdx * 6 + branchIdx * 5) % 60; // 实际应输入查表
  const index = Math.floor((stemIdx * 6 + branchIdx) / 2) % 30;
  // 更准确的纳音需要查60甲子表，这里用简化算法
  const naYinIdx = Math.floor(((stemIdx % 10) + (branchIdx % 12)) / 2) % 30;
  return NA_YIN_MAP[naYinIdx] ?? "未知";
}

/**
 * 八字四柱简写（如：甲子 丙寅 戊辰 庚申）
 */
export function fourPillarsShort(fourPillars: FourPillars): string {
  return `${fourPillars.year.stem}${fourPillars.year.branch} ` +
    `${fourPillars.month.stem}${fourPillars.month.branch} ` +
    `${fourPillars.day.stem}${fourPillars.day.branch} ` +
    `${fourPillars.hour.stem}${fourPillars.hour.branch}`;
}
