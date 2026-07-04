/* ============================================================
 * 神煞系统
 *
 * 传统八字神煞算法：
 *   天乙贵人、桃花、孤辰寡宿、文昌贵人、驿马、华盖、劫煞、亡神
 * ============================================================ */
import type { HeavenlyStem, EarthlyBranch, FourPillars } from "@/types/bazi";
import { ALL_STEMS, stemIndex } from "./heavenly-stems";
import { ALL_BRANCHES, branchIndex, BRANCH_WU_XING } from "./earthly-branches";

/** 神煞条目 */
export type ShenShaRecord = {
  name: string;
  type: "吉神" | "凶煞" | "中性";
  pillar: "年" | "月" | "日" | "时";
  position: string;     // 落在哪个柱
  description: string;
};

/**
 * 计算八字中的所有神煞
 */
export function calculateShenSha(fourPillars: FourPillars): ShenShaRecord[] {
  const result: ShenShaRecord[] = [];
  const day = fourPillars.day;
  const year = fourPillars.year;
  const month = fourPillars.month;
  const hour = fourPillars.hour;

  const push = (name: string, type: "吉神" | "凶煞" | "中性", pillar: "年" | "月" | "日" | "时", pos: string, desc: string) => {
    result.push({ name, type, pillar, position: pos, description: desc });
  };

  // === 天乙贵人 ===
  // 甲戊庚牛羊, 乙己鼠猴乡, 丙丁猪鸡位, 壬癸蛇兔藏, 辛逢虎马
  const tianYi: Record<string, string[]> = {
    甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
    乙: ["子", "申"], 己: ["子", "申"],
    丙: ["亥", "酉"], 丁: ["亥", "酉"],
    壬: ["巳", "卯"], 癸: ["巳", "卯"],
    辛: ["寅", "午"]
  };
  const tyBranches = tianYi[day.stem] || [];
  for (const b of tyBranches) {
    if (year.branch === b) push("天乙贵人", "吉神", "年", b, "天乙贵人入年柱，贵人运早，得长辈提携。");
    if (month.branch === b) push("天乙贵人", "吉神", "月", b, "天乙贵人入月柱，中年贵人运佳，得同辈帮助。");
    if (day.branch === b) push("天乙贵人", "吉神", "日", b, "天乙贵人入日柱，自身即是贵人，得配偶及合作伙伴扶持。");
    if (hour.branch === b) push("天乙贵人", "吉神", "时", b, "天乙贵人入时柱，晚年得助，下属或子女中有贵人。");
  }

  // === 文昌贵人 ===
  // 甲乙巳午报君知, 丙戊申宫丁己鸡, 庚猪辛鼠壬逢虎, 癸人卯上见文昌
  const wenChang: Record<string, string> = {
    甲: "巳", 乙: "午",
    丙: "申", 戊: "申", 丁: "酉", 己: "酉",
    庚: "亥", 辛: "子",
    壬: "寅", 癸: "卯"
  };
  const wcBranch = wenChang[day.stem];
  if (wcBranch) {
    if (year.branch === wcBranch) push("文昌贵人", "吉神", "年", wcBranch, "文昌入年，天资聪颖，早年学业佳。");
    if (month.branch === wcBranch) push("文昌贵人", "吉神", "月", wcBranch, "文昌入月，才华能得发挥，适合文职或学术。");
    if (day.branch === wcBranch) push("文昌贵人", "吉神", "日", wcBranch, "文昌入日，自身有学识修养，注重精神追求。");
    if (hour.branch === wcBranch) push("文昌贵人", "吉神", "时", wcBranch, "文昌入时，晚年仍好学习，或子女有文采。");
  }

  // === 桃花星（咸池） ===
  // 申子辰在酉, 寅午戌在卯, 巳酉丑在午, 亥卯未在子
  const taoHua: Record<string, string> = {
    申: "酉", 子: "酉", 辰: "酉",
    寅: "卯", 午: "卯", 戌: "卯",
    巳: "午", 酉: "午", 丑: "午",
    亥: "子", 卯: "子", 未: "子"
  };
  const thBranch = taoHua[year.branch];
  if (thBranch) {
    if (day.branch === thBranch) push("桃花", "中性", "日", thBranch, "桃花入夫妻宫，异性缘佳，注重感情质量。");
    if (month.branch === thBranch) push("桃花", "中性", "月", thBranch, "桃花入月柱，社交活跃，多才多艺。");
    if (hour.branch === thBranch) push("桃花", "中性", "时", thBranch, "桃花入时柱，晚年仍有魅力，或子女容貌出众。");
    if (year.branch === thBranch) push("桃花", "中性", "年", thBranch, "桃花入年柱，早年就展现社交能力。");
  }

  // === 孤辰寡宿 ===
  // 亥子丑 孤在寅 寡在戌
  // 寅卯辰 孤在巳 寡在丑
  // 巳午未 孤在申 寡在辰
  // 申酉戌 孤在亥 寡在未
  const guChenMap: Record<string, string> = {
    亥: "寅", 子: "寅", 丑: "寅",
    寅: "巳", 卯: "巳", 辰: "巳",
    巳: "申", 午: "申", 未: "申",
    申: "亥", 酉: "亥", 戌: "亥"
  };
  const guaSuMap: Record<string, string> = {
    亥: "戌", 子: "戌", 丑: "戌",
    寅: "丑", 卯: "丑", 辰: "丑",
    巳: "辰", 午: "辰", 未: "辰",
    申: "未", 酉: "未", 戌: "未"
  };
  const gcBranch = guChenMap[year.branch];
  const gsBranch = guaSuMap[year.branch];
  if (gcBranch && (day.branch === gcBranch || hour.branch === gcBranch || month.branch === gcBranch)) {
    push("孤辰", "凶煞", "日", gcBranch, "孤辰入命，内心独立，在亲密关系中需要更多个人空间。");
  }
  if (gsBranch && (day.branch === gsBranch || hour.branch === gsBranch || month.branch === gsBranch)) {
    push("寡宿", "凶煞", "日", gsBranch, "寡宿入命，晚年更倾向于安静独处，情感上较为淡泊。");
  }

  // === 驿马 ===
  // 申子辰在寅, 亥卯未在巳, 寅午戌在申, 巳酉丑在亥
  const yiMa: Record<string, string> = {
    申: "寅", 子: "寅", 辰: "寅",
    亥: "巳", 卯: "巳", 未: "巳",
    寅: "申", 午: "申", 戌: "申",
    巳: "酉", 酉: "亥", 丑: "亥"
  };
  const ymBranch = yiMa[year.branch];
  if (ymBranch) {
    if (day.branch === ymBranch) push("驿马", "中性", "日", ymBranch, "驿马入日，一生多动，适合经常出差、变动或旅行的职业。");
    if (month.branch === ymBranch) push("驿马", "中性", "月", ymBranch, "驿马入月柱，青年和中年时期奔波较多，事业上宜向外发展。");
    if (hour.branch === ymBranch) push("驿马", "中性", "时", ymBranch, "驿马入时柱，晚年仍闲不住，喜欢走动。");
  }

  // === 华盖 ===
  // 申子辰在辰, 寅午戌在戌, 巳酉丑在丑, 亥卯未在未
  const huaGai: Record<string, string> = {
    申: "辰", 子: "辰", 辰: "辰",
    寅: "戌", 午: "戌", 戌: "戌",
    巳: "丑", 酉: "丑", 丑: "丑",
    亥: "未", 卯: "未", 未: "未"
  };
  const hgBranch = huaGai[year.branch];
  if (hgBranch && (day.branch === hgBranch || month.branch === hgBranch || hour.branch === hgBranch)) {
    push("华盖", "中性", "日", hgBranch, "华盖入命，与佛道玄学有缘，喜欢思考人生，有艺术天赋。");
  }

  // === 劫煞 ===
  // 申子辰在巳, 亥卯未在申, 寅午戌在亥, 巳酉丑在寅
  const jieSha: Record<string, string> = {
    申: "巳", 子: "巳", 辰: "巳",
    亥: "申", 卯: "申", 未: "申",
    寅: "亥", 午: "亥", 戌: "亥",
    巳: "寅", 酉: "寅", 丑: "寅"
  };
  const jsBranch = jieSha[year.branch];
  if (jsBranch && (day.branch === jsBranch || month.branch === jsBranch)) {
    push("劫煞", "凶煞", "月", jsBranch, "劫煞主竞争压力，在事业和人际关系上容易遇到争夺。");
  }

  // === 亡神 ===
  // 申子辰在亥, 亥卯未在寅, 寅午戌在巳, 巳酉丑在申
  const wangShen: Record<string, string> = {
    申: "亥", 子: "亥", 辰: "亥",
    亥: "寅", 卯: "寅", 未: "寅",
    寅: "巳", 午: "巳", 戌: "巳",
    巳: "申", 酉: "申", 丑: "申"
  };
  const wsBranch = wangShen[year.branch];
  if (wsBranch && (day.branch === wsBranch || hour.branch === wsBranch)) {
    push("亡神", "凶煞", "时", wsBranch, "亡神主沉浮，人生起伏较大，在决策时要更加谨慎。");
  }

  // === 将星 ===
  // 申子辰在子, 亥卯未在卯, 寅午戌在午, 巳酉丑在酉
  const jiangXing: Record<string, string> = {
    申: "子", 子: "子", 辰: "子",
    亥: "卯", 卯: "卯", 未: "卯",
    寅: "午", 午: "午", 戌: "午",
    巳: "酉", 酉: "酉", 丑: "酉"
  };
  const jxBranch = jiangXing[year.branch];
  if (jxBranch && (day.branch === jxBranch || month.branch === jxBranch)) {
    push("将星", "吉神", "月", jxBranch, "将星入命，有领导能力和管理才能，适合承担管理职责。");
  }

  return result;
}

/**
 * 将神煞列表转换为可读文本
 */
export function shenShaToText(shenSha: ShenShaRecord[]): string {
  if (shenSha.length === 0) return "命局中无明显神煞显现。";

  const ji = shenSha.filter(s => s.type === "吉神");
  const xiong = shenSha.filter(s => s.type === "凶煞");
  const zhong = shenSha.filter(s => s.type === "中性");

  const parts: string[] = [];

  if (ji.length > 0) {
    parts.push(`吉神：${ji.map(s => s.name).join("、")}。`);
    parts.push(...ji.slice(0, 3).map(s => s.description));
  }

  if (zhong.length > 0) {
    parts.push(`中性星：${zhong.map(s => s.name).join("、")}。`);
    parts.push(...zhong.slice(0, 2).map(s => s.description));
  }

  if (xiong.length > 0) {
    parts.push(`凶煞：${xiong.map(s => s.name).join("、")}。`);
    parts.push(...xiong.slice(0, 2).map(s => `注意：${s.description}`));
  }

  return parts.join("");
}
