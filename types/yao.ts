export type CoinFace = "back" | "character";

export type YaoNature = "yang" | "yin";

export type YaoValue = 6 | 7 | 8 | 9;

export type TrigramName = "乾" | "兑" | "离" | "震" | "巽" | "坎" | "艮" | "坤";

export type DivinationMethod = "manual" | "random" | "time";

export type FiveElement = "木" | "火" | "土" | "金" | "水";

export type SixRelative = "父母" | "兄弟" | "子孙" | "妻财" | "官鬼";

export type SixSpirit = "青龙" | "朱雀" | "勾陈" | "腾蛇" | "白虎" | "玄武";

export type WorldResponseMark = "世" | "应" | null;

export type ReadingSection = {
  title: "核心判断" | "卦象依据" | "当前局势" | "变化趋势" | "动爻分析" | "风险点" | "可执行建议" | "需要核实的问题";
  tag: "判断" | "依据" | "局势" | "趋势" | "风险" | "建议" | "核实";
  evidence: string;
  judgment: string;
  advice?: string;
  questions?: string[];
};

export type Hexagram = {
  sequence: number;
  name: string;
  upper: TrigramName;
  lower: TrigramName;
  judgment: string;
  keywords: string[];
  readingFocus: string;
};

export type YaoLine = {
  position: 1 | 2 | 3 | 4 | 5 | 6;
  coins: [CoinFace, CoinFace, CoinFace];
  value: YaoValue;
  nature: YaoNature;
  isMoving: boolean;
  label: "老阴" | "少阳" | "少阴" | "老阳";
};

export type YaoLineDetail = {
  position: 1 | 2 | 3 | 4 | 5 | 6;
  positionName: string;
  relation: SixRelative;
  spirit: SixSpirit;
  worldResponse: WorldResponseMark;
  element: FiveElement;
  basis: string;
};

export type DivinationResult = {
  id: string;
  title: string;
  question: string;
  method: DivinationMethod;
  castTime: string;
  lines: YaoLine[];
  lineDetails?: YaoLineDetail[];
  changedLines: number[];
  primaryHexagram: Hexagram;
  changedHexagram: Hexagram | null;
  oneLineConclusion?: string;
  interpretation: ReadingSection[];
};

export type StoredDivinationRecord = DivinationResult & {
  savedAt: string;
};

export type DivinationTopic = "work" | "relationship" | "wealth" | "cooperation" | "travel" | "exam" | "health" | "general";
