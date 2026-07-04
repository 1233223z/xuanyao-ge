/* ============================================================
 * 十神计算
 * 以日主为「我」，与其他天干地支藏干的关系
 * ============================================================ */
import type { HeavenlyStem, TenGod, WuXing, YinYang } from "@/types/bazi";
import { STEM_WU_XING, STEM_YIN_YANG, ALL_STEMS, stemIndex } from "./heavenly-stems";

/**
 * 根据日主与目标天干，计算十神
 *
 * 规则：
 *   同我者 → 比肩（阴阳同）/ 劫财（阴阳异）
 *   我生者 → 食神（阴阳同）/ 伤官（阴阳异）
 *   克我者 → 正官（阴阳异）/ 七杀（阴阳同）
 *   我克者 → 正财（阴阳异）/ 偏财（阴阳同）
 *   生我者 → 正印（阴阳异）/ 偏印（阴阳同）
 */
export function calculateTenGod(dayMaster: HeavenlyStem, target: HeavenlyStem): TenGod {
  const dmWx = STEM_WU_XING[dayMaster];
  const dmYy = STEM_YIN_YANG[dayMaster];
  const tgWx = STEM_WU_XING[target];
  const tgYy = STEM_YIN_YANG[target];

  // 同五行
  if (dmWx === tgWx) {
    return dmYy === tgYy ? "比肩" : "劫财";
  }

  // 我生
  if (
    (dmWx === "木" && tgWx === "火") ||
    (dmWx === "火" && tgWx === "土") ||
    (dmWx === "土" && tgWx === "金") ||
    (dmWx === "金" && tgWx === "水") ||
    (dmWx === "水" && tgWx === "木")
  ) {
    return dmYy === tgYy ? "食神" : "伤官";
  }

  // 克我
  if (
    (tgWx === "木" && dmWx === "土") ||
    (tgWx === "火" && dmWx === "金") ||
    (tgWx === "土" && dmWx === "水") ||
    (tgWx === "金" && dmWx === "木") ||
    (tgWx === "水" && dmWx === "火")
  ) {
    return dmYy === tgYy ? "七杀" : "正官";
  }

  // 我克
  if (
    (dmWx === "木" && tgWx === "土") ||
    (dmWx === "火" && tgWx === "金") ||
    (dmWx === "土" && tgWx === "水") ||
    (dmWx === "金" && tgWx === "木") ||
    (dmWx === "水" && tgWx === "火")
  ) {
    return dmYy === tgYy ? "偏财" : "正财";
  }

  // 生我
  if (
    (tgWx === "木" && dmWx === "火") ||
    (tgWx === "火" && dmWx === "土") ||
    (tgWx === "土" && dmWx === "金") ||
    (tgWx === "金" && dmWx === "水") ||
    (tgWx === "水" && dmWx === "木")
  ) {
    return dmYy === tgYy ? "偏印" : "正印";
  }

  // fallback（不应到达）
  return "比肩";
}

/**
 * 十神 → 五行关系归类
 */
export function tenGodWuXingRelation(tenGod: TenGod): "同我" | "我生" | "克我" | "我克" | "生我" {
  if (tenGod === "比肩" || tenGod === "劫财") return "同我";
  if (tenGod === "食神" || tenGod === "伤官") return "我生";
  if (tenGod === "正官" || tenGod === "七杀") return "克我";
  if (tenGod === "正财" || tenGod === "偏财") return "我克";
  return "生我"; // 正印/偏印
}

/**
 * 十神吉凶属性
 */
export function tenGodNature(tenGod: TenGod): "吉" | "凶" | "中性" {
  const map: Record<TenGod, "吉" | "凶" | "中性"> = {
    正官: "吉", 正印: "吉", 正财: "吉", 食神: "吉",
    七杀: "凶", 劫财: "凶", 伤官: "凶", 偏印: "凶",
    偏财: "中性", 比肩: "中性"
  };
  return map[tenGod];
}
