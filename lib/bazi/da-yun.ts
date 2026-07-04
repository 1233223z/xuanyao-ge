/* ============================================================
 * 大运计算
 *
 * 规则：
 *   阳年男、阴年女 → 顺排
 *   阴年男、阳年女 → 逆排
 *   阳年：甲丙戊庚壬
 *   阴年：乙丁己辛癸
 *
 * 起运：顺排以出生日到下一个节气天数/3
 *       逆排以出生日到上一个节气天数/3
 * ============================================================ */
import type { FourPillars, DaYunResult, DaYunRecord, Gender, HeavenlyStem, EarthlyBranch, WuXing } from "@/types/bazi";
import { ALL_STEMS, STEM_YIN_YANG, STEM_WU_XING, stemIndex } from "./heavenly-stems";
import { ALL_BRANCHES, BRANCH_WU_XING, branchIndex, MONTH_TO_BRANCH } from "./earthly-branches";
import { approximateJieQiDate } from "./solar-terms";
import { calculateTenGod } from "./ten-gods";

/**
 * 计算大运
 */
export function calculateDaYun(
  fourPillars: FourPillars,
  gender: Gender,
  birthYear: number,
  birthMonth: number,
  birthDay: number
): DaYunResult {
  const yearStem = fourPillars.year.stem;
  const monthStem = fourPillars.month.stem;
  const monthBranch = fourPillars.month.branch;

  // 1. 判断顺逆
  const isYangYear = STEM_YIN_YANG[yearStem] === "阳";
  const isMale = gender === "男";
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const direction = isForward ? "顺排" : "逆排";

  // 2. 简化起运年龄计算（3天=1年）
  const startAge = calculateStartAge(birthYear, birthMonth, birthDay, fourPillars.month.branch, isForward);

  // 3. 月柱干支索引
  const monthStemIdx = stemIndex(monthStem);
  const monthBranchIdx = branchIndex(monthBranch);

  // 4. 大运干支（顺排：+1；逆排：-1）
  const records: DaYunRecord[] = [];
  const currentYear = new Date().getFullYear();
  const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
  const birthDateObj = new Date(birthDate);

  for (let i = 0; i < 8; i++) {
    const offset = isForward ? (i + 1) : -(i + 1);
    const stem: HeavenlyStem = ALL_STEMS[((monthStemIdx + offset) % 10 + 10) % 10];
    const branch: EarthlyBranch = ALL_BRANCHES[((monthBranchIdx + offset) % 12 + 12) % 12];

    const startAgeThis = startAge + i * 10;
    const endAge = startAge + (i + 1) * 10 - 1;

    // 判断是否当前大运
    const userAge = currentYear - birthYear;
    const isCurrent = userAge >= startAgeThis && userAge <= endAge;

    // 日主十神关系
    const dayMaster = fourPillars.day.stem;
    const tenGodOfDay = calculateTenGod(dayMaster, stem);

    records.push({
      startAge: startAgeThis,
      endAge,
      stem,
      branch,
      stemWuXing: STEM_WU_XING[stem],
      branchWuXing: BRANCH_WU_XING[branch],
      tenGodOfDay,
      isCurrent,
      description: `${startAgeThis}岁-${endAge}岁 ${stem}${branch} 大运`
    });
  }

  const currentIndex = records.findIndex(r => r.isCurrent);

  return {
    direction,
    startYear: birthYear + startAge,
    startAge,
    records,
    currentIndex: currentIndex >= 0 ? currentIndex : 0
  };
}

/**
 * 简化起运年龄计算
 * 顺排：计算出生日到下一个节气天数
 * 逆排：计算出生日到上一个节气天数
 * 每3天为1年，余数折合为月
 */
function calculateStartAge(
  year: number,
  month: number,
  day: number,
  monthBranch: EarthlyBranch,
  isForward: boolean
): number {
  // 简化：基于近似估算
  // 月支对应节气月份，起运通常在1-10岁之间
  // 顺排越靠近下一个节气起运越早，逆排越靠近上一个节气起运越早

  const monthIdx = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"].indexOf(monthBranch);

  // 节气日的大约日期
  let jieQiDate: { month: number; day: number };

  if (isForward) {
    // 下一个节气
    const nextIdx = (monthIdx + 1) % 12;
    const jieQiIdx = nextIdx; // 节气索引近似
    jieQiDate = approximateJieQiDate(year, jieQiIdx >= 11 ? 0 : jieQiIdx);
  } else {
    // 上一个节气
    const prevIdx = (monthIdx - 1 + 12) % 12;
    jieQiDate = approximateJieQiDate(year, prevIdx);
  }

  // 计算出生日到节气的天数差
  const birthDate = new Date(year, month - 1, day);
  let jieQiMonth = jieQiDate.month;
  let jieQiDay = jieQiDate.day;

  const jieQiDateObj = new Date(year, jieQiMonth - 1, jieQiDay);
  const diffDays = Math.abs(Math.round((jieQiDateObj.getTime() - birthDate.getTime()) / (24 * 60 * 60 * 1000)));

  // 每3天=1年
  const age = Math.max(1, Math.round(diffDays / 3));

  return Math.min(age, 10); // 不超过10岁起运
}

/**
 * 获取当前所在大运的描述
 */
export function getCurrentDaYunDescription(daYun: DaYunResult): string {
  const current = daYun.records[daYun.currentIndex];
  if (!current) return "暂未排定大运";

  return `当前正行${current.stem}${current.branch}大运（${current.startAge}岁-${current.endAge}岁），为${current.stemWuXing}运，天干${current.tenGodOfDay}透出。`;
}
