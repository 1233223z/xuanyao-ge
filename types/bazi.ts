/* ============================================================
 * 八字排盘 - 类型定义
 * ============================================================ */

/* 天干 */
export type HeavenlyStem =
  | "甲" | "乙" | "丙" | "丁" | "戊"
  | "己" | "庚" | "辛" | "壬" | "癸";

/* 地支 */
export type EarthlyBranch =
  | "子" | "丑" | "寅" | "卯" | "辰" | "巳"
  | "午" | "未" | "申" | "酉" | "戌" | "亥";

/* 五行 */
export type WuXing = "木" | "火" | "土" | "金" | "水";

/* 阴阳 */
export type YinYang = "阳" | "阴";

/* 性别 */
export type Gender = "男" | "女";

/* 十神 */
export type TenGod =
  | "比肩" | "劫财" | "食神" | "伤官" | "正财"
  | "偏财" | "正官" | "七杀" | "正印" | "偏印";

/* 藏干（地支中所藏天干） */
export type HiddenStemEntry = {
  stem: HeavenlyStem;
  qi: "本气" | "中气" | "余气";
};

/* 一柱 */
export type Pillar = {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemYinYang: YinYang;
  branchYinYang: YinYang;
  stemWuXing: WuXing;
  branchWuXing: WuXing;
  hiddenStems: HiddenStemEntry[];
  stemTenGod?: TenGod;
  branchTenGod?: TenGod;
  stemRelation?: string;
  branchRelation?: string;
  naYin?: string;          // 纳音
};

/* 四柱 */
export type FourPillars = {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
};

/* 五行统计 */
export type WuXingCount = {
  wuXing: WuXing;
  stemCount: number;
  branchCount: number;
  hiddenCount: number;
  total: number;
};

/* 日主强弱等级 */
export type DayMasterStrength = "偏强" | "中和" | "偏弱";

/* 日主分析 */
export type DayMasterAnalysis = {
  stem: HeavenlyStem;
  yinYang: YinYang;
  wuXing: WuXing;
  strength: DayMasterStrength;
  score: number;
  reasoning: string;
};

/* 喜用神 / 忌神 */
export type DeityAdvice = {
  favorable: WuXing[];
  unfavorable: WuXing[];
  favorableExplanation: string;
  unfavorableExplanation: string;
  tiáoHòu: string;         // 调候说明
};

/* 十神分布 */
export type TenGodDistribution = {
  stem: HeavenlyStem;
  pillar: "年" | "月" | "日" | "时";
  tenGod: TenGod;
  position: "天干" | "地支" | "藏干";
  branch?: EarthlyBranch;
}[];

/* 一大运 */
export type DaYunRecord = {
  startAge: number;
  endAge: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemWuXing: WuXing;
  branchWuXing: WuXing;
  tenGodOfDay?: TenGod;
  isCurrent: boolean;
  description: string;
};

/* 大运列表 */
export type DaYunResult = {
  direction: "顺排" | "逆排";
  startYear: number;        // 起运年份
  startAge: number;         // 起运年龄
  records: DaYunRecord[];
  currentIndex: number;
};

/* 流年分析 */
export type LiuNianAnalysis = {
  year: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  wuXing: WuXing;
  relationship: string;     // 与八字关系
  assessment: "吉" | "凶" | "平" | "变动";
  summary: string;
  detail: string;
};

/* 八字排盘完整结果 */
export type BaziResult = {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;        // ISO 或 YYYY-MM-DD
  birthTime: string;
  birthPlace: string;
  usedTrueSolarTime: boolean;
  calculatedAt: string;

  fourPillars: FourPillars;
  dayMaster: DayMasterAnalysis;
  wuXingDistribution: WuXingCount[];
  tenGodDistribution: TenGodDistribution;

  // 月令
  monthLing: {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
    season: string;
  };

  deities: DeityAdvice;
  shenSha: import("@/lib/bazi/shen-sha").ShenShaRecord[];
  daYun: DaYunResult;
  currentLiuNian: LiuNianAnalysis;

  // 各维度分析
  personality: string;
  careerWealth: string;
  relationship: string;
  health: string;

  // 是否有更多详批内容（付费解锁标记）
  hasDetailedReport: boolean;
};

/* 八字报告分段 */
export type BaziReportSection = {
  title: string;
  tag: "基础" | "格局" | "性格" | "事业" | "财运" | "感情" | "健康" | "大运" | "流年" | "建议";
  content: string;
  isLocked: boolean;
  price?: number;
};
