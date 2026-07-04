/* ============================================================
 * 天干数据与工具
 * ============================================================ */
import type { HeavenlyStem, WuXing, YinYang } from "@/types/bazi";

/** 天干列表 */
export const ALL_STEMS: HeavenlyStem[] = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/** 天干 → 阴阳 */
export const STEM_YIN_YANG: Record<HeavenlyStem, YinYang> = {
  甲: "阳", 乙: "阴", 丙: "阳", 丁: "阴", 戊: "阳",
  己: "阴", 庚: "阳", 辛: "阴", 壬: "阳", 癸: "阴"
};

/** 天干 → 五行 */
export const STEM_WU_XING: Record<HeavenlyStem, WuXing> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水"
};

/** 天干 → 方位 */
export const STEM_DIRECTION: Record<HeavenlyStem, string> = {
  甲: "东方", 乙: "东方", 丙: "南方", 丁: "南方", 戊: "中央",
  己: "中央", 庚: "西方", 辛: "西方", 壬: "北方", 癸: "北方"
};

/**
 * 由干支序号（0-59，六十甲子序）取得天干
 * 序号0 = 甲子
 */
export function stemFromSexagenaryIndex(index: number): HeavenlyStem {
  return ALL_STEMS[index % 10];
}

/**
 * 由数字（1-10）取得天干
 */
export function stemFromNumber(n: number): HeavenlyStem {
  return ALL_STEMS[((n - 1) % 10 + 10) % 10];
}

/**
 * 取得天干序号（甲=0, 乙=1, ...）
 */
export function stemIndex(stem: HeavenlyStem): number {
  return ALL_STEMS.indexOf(stem);
}

/**
 * 天干五合
 * 甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火
 */
export function stemCombine(stem: HeavenlyStem): HeavenlyStem | null {
  const map: Partial<Record<HeavenlyStem, HeavenlyStem>> = {
    甲: "己", 乙: "庚", 丙: "辛", 丁: "壬", 戊: "癸",
    己: "甲", 庚: "乙", 辛: "丙", 壬: "丁", 癸: "戊"
  };
  return map[stem] ?? null;
}

/**
 * 天干相冲
 * 甲庚冲、乙辛冲、丙壬冲、丁癸冲
 */
export function stemClash(stem: HeavenlyStem): HeavenlyStem | null {
  const map: Partial<Record<HeavenlyStem, HeavenlyStem>> = {
    甲: "庚", 乙: "辛", 丙: "壬", 丁: "癸",
    庚: "甲", 辛: "乙", 壬: "丙", 癸: "丁"
  };
  return map[stem] ?? null;
}
