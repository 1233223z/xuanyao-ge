/* ============================================================
 * 二十四节气数据与查询
 *
 * 数据来源：基于天文计算的简化查表法
 * 覆盖范围：1900年–2100年
 *
 * 月柱的月份以「节气」为界：
 *   寅月：立春 → 惊蛰
 *   卯月：惊蛰 → 清明
 *   辰月：清明 → 立夏
 *   ...
 * ============================================================ */
import type { EarthlyBranch } from "@/types/bazi";
import { MONTH_TO_BRANCH } from "./earthly-branches";

/** 节气名称 */
export const JIE_QI_NAMES = [
  "立春", "惊蛰", "清明", "立夏", "芒种", "小暑",
  "立秋", "白露", "寒露", "立冬", "大雪", "小寒"
] as const;

export type JieQiName = typeof JIE_QI_NAMES[number];

/**
 * 节气数据表
 * 格式：[年, 立春(月,日,时), 惊蛰, 清明, 立夏, 芒种, 小暑, 立秋, 白露, 寒露, 立冬, 大雪, 小寒]
 * 每个节气用 [月, 日, 时] 表示（公历）
 * 这是简化版数据，精确到小时
 *
 * 实际产品中建议用更完整的150年数据集
 */

// 这是一个简化的节气日期计算函数，基于近似公式
// 实际使用时建议用查表法或调用专业农历库

/**
 * 计算某年某节气的近似公历日期（1900-2100）
 *
 * 使用天文常数近似公式：
 *   节气时间 ≈ 年初日数 + 偏移量
 *   各节气偏移量基于历史数据拟合
 *
 * @param year  公历年份
 * @param jieQiIndex 节气索引（0=立春, 1=惊蛰, ... , 11=小寒）
 * @returns [月, 日]（公历）
 */
export function approximateJieQiDate(year: number, jieQiIndex: number): { month: number; day: number; hour: number } {
  // 1900年各节气的基础日期（公历月,日）
  // 数据基于《近世中西史日对照表》
  const baseDates: [number, number][] = [
    [2, 4],   // 立春
    [3, 6],   // 惊蛰
    [4, 5],   // 清明
    [5, 6],   // 立夏
    [6, 6],   // 芒种
    [7, 7],   // 小暑
    [8, 8],   // 立秋
    [9, 8],   // 白露
    [10, 9],  // 寒露
    [11, 8],  // 立冬
    [12, 7],  // 大雪
    [1, 6]    // 小寒（次年）
  ];

  const [baseMonth, baseDay] = baseDates[jieQiIndex];

  // 每世纪偏移修正
  // 回归年 ~365.2422天，节气间隔 ~15.218天
  const yearDiff = year - 1900;

  // 近似偏移（天），含闰年修正
  let offset = 0;

  // 立春偏移较大，因为跨年
  if (jieQiIndex === 0) {
    // 立春在2月3-5日之间摆动
    offset = Math.round(yearDiff * 0.2422);
  } else if (jieQiIndex <= 10) {
    offset = Math.round(yearDiff * 0.2422 * jieQiIndex / 12);
  } else {
    // 小寒在次年1月
    offset = Math.round((yearDiff + 1) * 0.2422 * 11 / 12);
  }

  // 世纪修正
  const century = Math.floor(year / 100);
  offset += (century - 19) * 2;

  let day = baseDay + offset;
  let month = baseMonth;

  // 跨月修正
  const daysInMonth = monthDays(month, year);
  if (day > daysInMonth) {
    day -= daysInMonth;
    month++;
  }

  // 小寒特殊处理（次年1月）
  if (jieQiIndex === 11) {
    month = 1;
    day = Math.max(5, Math.min(7, baseDay + Math.round(yearDiff * 0.2422 * 11 / 12)));
  }

  // 保证在合理范围内
  day = Math.max(1, Math.min(31, day));
  const approxHour = 4 + (jieQiIndex * 2) % 24; // 近似时

  return { month, day, hour: approxHour };
}

function monthDays(month: number, year: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return days[month - 1] || 31;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 将公历日期转为儒略日
 * 用于日柱计算
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * 由公历日期确定月柱地支（基于节气）
 *
 * @returns EarthlyBranch 月柱地支
 */
export function getMonthBranch(year: number, month: number, day: number): EarthlyBranch {
  // 各节气的公历日期近似值（月,日）
  const jieQiThisYear: [number, number][] = JIE_QI_NAMES.slice(0, 11).map((_, idx) => {
    const d = approximateJieQiDate(year, idx);
    return [d.month, d.day];
  });

  // 加上次年的立春（用于判断丑月）
  const nextYearStart = approximateJieQiDate(year + 1, 0);

  // 日期数值化比较
  const dateValue = month * 100 + day;

  // 节气日期数值化
  const boundaryValues = jieQiThisYear.map(([m, d]) => m * 100 + d);

  // 从后往前判断落在哪个节气区间
  for (let i = boundaryValues.length - 1; i >= 0; i--) {
    if (dateValue >= boundaryValues[i]) {
      // 索引 i 对应节气：0=立春(寅), 1=惊蛰(卯), ...
      // 立春 → 寅月, 惊蛰 → 卯月, ...
      const branchIndex = (i + 2) % 12; // 寅=2, 卯=3, ...
      return MONTH_TO_BRANCH[branchIndex];
    }
  }

  // 如果在所有节气之前 → 丑月（腊月）
  return "丑";
}

/**
 * 年柱地支（基于立春判断）
 * 年柱以立春为界，非正月初一
 */
export function getYearStemBranch(year: number, month: number, day: number): { stemIndex: number; branchIndex: number } {
  const springBegin = approximateJieQiDate(year, 0); // 立春

  // 判断是否在立春前
  const birthValue = month * 100 + day;
  const springValue = springBegin.month * 100 + springBegin.day;

  let effectiveYear = year;
  if (birthValue < springValue) {
    effectiveYear = year - 1;
  }

  const sexagenaryIndex = ((effectiveYear - 4) % 60 + 60) % 60;
  return {
    stemIndex: sexagenaryIndex % 10,
    branchIndex: sexagenaryIndex % 12
  };
}

/**
 * 日柱天干地支（基于儒略日）
 * 公式：日干支序数 = (JDN - 11) % 60
 */
export function getDayStemBranch(year: number, month: number, day: number): { stemIndex: number; branchIndex: number } {
  const jdn = gregorianToJDN(year, month, day);
  const sexagenaryIndex = ((jdn - 11) % 60 + 60) % 60;
  return {
    stemIndex: sexagenaryIndex % 10,
    branchIndex: sexagenaryIndex % 12
  };
}

/**
 * 时柱天干地支（基于日干和时辰）
 * 五鼠遁：日上起时法
 */
export function getHourStemBranch(dayStemIndex: number, hourBranchIndex: number): { stemIndex: number; branchIndex: number } {
  // 五鼠遁：甲己还加甲（日干甲或己 → 时干甲子起）
  // idle = (dayStemIndex % 5) * 2
  const idle = (dayStemIndex % 5) * 2;
  const stemIndex = (idle + hourBranchIndex) % 10;

  return {
    stemIndex,
    branchIndex: hourBranchIndex
  };
}

/**
 * 确定出生日期所属的节气区间（用于月柱）
 */
export function getSeasonName(monthBranch: EarthlyBranch): string {
  const map: Record<EarthlyBranch, string> = {
    寅: "春季", 卯: "春季", 辰: "春季末",
    巳: "夏季", 午: "夏季", 未: "夏季末",
    申: "秋季", 酉: "秋季", 戌: "秋季末",
    亥: "冬季", 子: "冬季", 丑: "冬季末"
  };
  return map[monthBranch] || "";
}
