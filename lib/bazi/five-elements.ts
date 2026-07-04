/* ============================================================
 * 五行生克关系
 * ============================================================ */
import type { WuXing } from "@/types/bazi";

/** 相生：木→火→土→金→水→木 */
export const GENERATES: Record<WuXing, WuXing> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

/** 相克：木→土→水→火→金→木 */
export const CONTROLS: Record<WuXing, WuXing> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

/** 被生（反向查） */
export const GENERATED_BY: Record<WuXing, WuXing> = {
  木: "水",
  火: "木",
  土: "火",
  金: "土",
  水: "金"
};

/** 被克（反向查） */
export const CONTROLLED_BY: Record<WuXing, WuXing> = {
  木: "金",
  火: "水",
  土: "木",
  金: "火",
  水: "土"
};

/** 五行旺相（四季） */
export const WANG_XIANG: Record<string, WuXing> = {
  春: "木",
  夏: "火",
  秋: "金",
  冬: "水"
};

/** 四季土旺 */
export const SEASON_TU: Record<string, string> = {
  春: "辰",
  夏: "未",
  秋: "戌",
  冬: "丑"
};

/** 五行颜色 */
export const WU_XING_COLORS: Record<WuXing, string> = {
  木: "#5b8c7a",
  火: "#c96455",
  土: "#c9a84c",
  金: "#dbc9a8",
  水: "#7eb09a"
};

/** 五行对应身体部位 */
export const WU_XING_BODY: Record<WuXing, string> = {
  木: "肝胆、四肢、筋脉",
  火: "心脏、血液循环、眼睛",
  土: "脾胃、肌肉、皮肤",
  金: "肺部、呼吸系统、骨骼",
  水: "肾脏、泌尿系统、耳朵"
};

/** 五行对应季节 */
export const WU_XING_SEASON: Record<WuXing, string> = {
  木: "春",
  火: "夏",
  土: "四季末",
  金: "秋",
  水: "冬"
};

/**
 * 两行相生关系描述
 */
export function describeGeneration(a: WuXing, b: WuXing): string {
  if (GENERATES[a] === b) return `${a}生${b}`;
  if (GENERATES[b] === a) return `${b}生${a}`;
  return `${a}与${b}无相生关系`;
}

/**
 * 两行相克关系描述
 */
export function describeControl(a: WuXing, b: WuXing): string {
  if (CONTROLS[a] === b) return `${a}克${b}`;
  if (CONTROLS[b] === a) return `${b}克${a}`;
  return `${a}与${b}无相克关系`;
}
