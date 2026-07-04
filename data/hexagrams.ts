import type { Hexagram, TrigramName } from "@/types/yao";

type HexagramSeed = Omit<Hexagram, "judgment" | "keywords" | "readingFocus"> & {
  theme: string;
  keywords: string[];
};

const seeds: HexagramSeed[] = [
  { sequence: 1, name: "乾为天", upper: "乾", lower: "乾", theme: "刚健主动，重在正当推进与自我约束。", keywords: ["刚健", "主动", "开创", "自强"] },
  { sequence: 2, name: "坤为地", upper: "坤", lower: "坤", theme: "厚重承载，宜顺势积累，不急于争先。", keywords: ["承载", "顺势", "稳定", "包容"] },
  { sequence: 3, name: "水雷屯", upper: "坎", lower: "震", theme: "初始多阻，先理清条件，再稳步起步。", keywords: ["初创", "阻滞", "整理", "蓄势"] },
  { sequence: 4, name: "山水蒙", upper: "艮", lower: "坎", theme: "信息未明，宜求证学习，避免凭感觉判断。", keywords: ["启蒙", "求知", "不明", "审慎"] },
  { sequence: 5, name: "水天需", upper: "坎", lower: "乾", theme: "时机未全，等待不是停滞，而是养成条件。", keywords: ["等待", "涵养", "时机", "耐心"] },
  { sequence: 6, name: "天水讼", upper: "乾", lower: "坎", theme: "意见相争，宜先止损，重视证据与边界。", keywords: ["争执", "边界", "证据", "和解"] },
  { sequence: 7, name: "地水师", upper: "坤", lower: "坎", theme: "组织成事，重在纪律、目标和可执行安排。", keywords: ["组织", "纪律", "协作", "统筹"] },
  { sequence: 8, name: "水地比", upper: "坎", lower: "坤", theme: "亲比相依，选择可靠关系比盲目扩张更重要。", keywords: ["亲近", "选择", "依附", "合作"] },
  { sequence: 9, name: "风天小畜", upper: "巽", lower: "乾", theme: "力量尚小，宜积小成多，暂不强推。", keywords: ["小蓄", "克制", "积累", "柔进"] },
  { sequence: 10, name: "天泽履", upper: "乾", lower: "兑", theme: "行事需守礼守度，谨慎踏实可减少风险。", keywords: ["礼度", "谨慎", "规则", "履行"] },
  { sequence: 11, name: "地天泰", upper: "坤", lower: "乾", theme: "上下相通，局面较顺，仍需保持节制。", keywords: ["通达", "顺势", "平衡", "和合"] },
  { sequence: 12, name: "天地否", upper: "乾", lower: "坤", theme: "上下不交，沟通受阻，宜收束而非硬冲。", keywords: ["闭塞", "阻隔", "收敛", "观望"] },
  { sequence: 13, name: "天火同人", upper: "乾", lower: "离", theme: "同道相聚，适合公开沟通与建立共识。", keywords: ["同道", "公开", "共识", "协同"] },
  { sequence: 14, name: "火天大有", upper: "离", lower: "乾", theme: "资源较足，宜以清明之心善用优势。", keywords: ["丰盛", "资源", "清明", "善用"] },
  { sequence: 15, name: "地山谦", upper: "坤", lower: "艮", theme: "以谦守成，低位蓄力反而更稳。", keywords: ["谦逊", "守正", "收敛", "稳健"] },
  { sequence: 16, name: "雷地豫", upper: "震", lower: "坤", theme: "人心动起，宜有准备地行动，勿只凭兴致。", keywords: ["预备", "动员", "喜悦", "节制"] },
  { sequence: 17, name: "泽雷随", upper: "兑", lower: "震", theme: "顺势而随，但需辨别所随之人事是否可靠。", keywords: ["随顺", "选择", "跟进", "适应"] },
  { sequence: 18, name: "山风蛊", upper: "艮", lower: "巽", theme: "旧弊待修，先清理根源，再谈推进。", keywords: ["整治", "旧弊", "修复", "责任"] },
  { sequence: 19, name: "地泽临", upper: "坤", lower: "兑", theme: "机会临近，宜以宽厚与清晰边界承接。", keywords: ["临近", "照拂", "机会", "管理"] },
  { sequence: 20, name: "风地观", upper: "巽", lower: "坤", theme: "先观察全局，借由事实校正判断。", keywords: ["观察", "审视", "风向", "省察"] },
  { sequence: 21, name: "火雷噬嗑", upper: "离", lower: "震", theme: "有阻需决断，规则清楚后才能通达。", keywords: ["决断", "规则", "清障", "执行"] },
  { sequence: 22, name: "山火贲", upper: "艮", lower: "离", theme: "外在修饰有益，但不可掩盖实质不足。", keywords: ["文饰", "秩序", "形象", "实质"] },
  { sequence: 23, name: "山地剥", upper: "艮", lower: "坤", theme: "基础被削，宜止损守底，不宜冒进。", keywords: ["剥落", "止损", "守底", "审慎"] },
  { sequence: 24, name: "地雷复", upper: "坤", lower: "震", theme: "转机初回，适合从小处恢复节奏。", keywords: ["复归", "转机", "恢复", "初心"] },
  { sequence: 25, name: "天雷无妄", upper: "乾", lower: "震", theme: "守真实、不妄动，顺其正理而行。", keywords: ["真实", "不妄", "正当", "自然"] },
  { sequence: 26, name: "山天大畜", upper: "艮", lower: "乾", theme: "大力蓄养，先沉淀能力与资源。", keywords: ["蓄养", "沉淀", "约束", "厚积"] },
  { sequence: 27, name: "山雷颐", upper: "艮", lower: "震", theme: "养正为先，关注输入、输出与日常节律。", keywords: ["养正", "滋养", "言行", "节律"] },
  { sequence: 28, name: "泽风大过", upper: "兑", lower: "巽", theme: "负担偏重，需调整结构，避免硬撑。", keywords: ["过载", "承担", "调整", "非常"] },
  { sequence: 29, name: "坎为水", upper: "坎", lower: "坎", theme: "险中求稳，先保安全与基本盘。", keywords: ["险阻", "谨慎", "反复", "守稳"] },
  { sequence: 30, name: "离为火", upper: "离", lower: "离", theme: "依附明处，适合以清楚表达照见问题。", keywords: ["光明", "依附", "清晰", "表达"] },
  { sequence: 31, name: "泽山咸", upper: "兑", lower: "艮", theme: "感应相通，关系互动宜真诚而有分寸。", keywords: ["感应", "关系", "互动", "分寸"] },
  { sequence: 32, name: "雷风恒", upper: "震", lower: "巽", theme: "贵在持久，适合建立稳定节奏。", keywords: ["恒常", "持续", "节奏", "承诺"] },
  { sequence: 33, name: "天山遁", upper: "乾", lower: "艮", theme: "适度退避，保留实力比争一时更要紧。", keywords: ["退避", "保全", "距离", "时势"] },
  { sequence: 34, name: "雷天大壮", upper: "震", lower: "乾", theme: "势头强盛，越有力量越要守正。", keywords: ["壮盛", "行动", "守正", "节制"] },
  { sequence: 35, name: "火地晋", upper: "离", lower: "坤", theme: "渐有进展，适合借明晰目标向前推进。", keywords: ["晋升", "进展", "明朗", "呈现"] },
  { sequence: 36, name: "地火明夷", upper: "坤", lower: "离", theme: "明处受掩，宜低调护持核心判断。", keywords: ["受抑", "低调", "守明", "避锋"] },
  { sequence: 37, name: "风火家人", upper: "巽", lower: "离", theme: "内在秩序决定外部表现，先理家法与分工。", keywords: ["家内", "秩序", "分工", "责任"] },
  { sequence: 38, name: "火泽睽", upper: "离", lower: "兑", theme: "立场有异，宜求同存异，不宜强合。", keywords: ["分歧", "异中求同", "沟通", "距离"] },
  { sequence: 39, name: "水山蹇", upper: "坎", lower: "艮", theme: "前行受阻，宜回看路径与求助资源。", keywords: ["艰阻", "回顾", "求助", "改道"] },
  { sequence: 40, name: "雷水解", upper: "震", lower: "坎", theme: "困局可解，重点在及时行动与释放压力。", keywords: ["解除", "松动", "行动", "缓和"] },
  { sequence: 41, name: "山泽损", upper: "艮", lower: "兑", theme: "有所减损，反而能换来结构清明。", keywords: ["减损", "取舍", "节省", "修整"] },
  { sequence: 42, name: "风雷益", upper: "巽", lower: "震", theme: "增长有机，利于助人助己、顺势扩展。", keywords: ["增益", "扶助", "扩展", "互利"] },
  { sequence: 43, name: "泽天夬", upper: "兑", lower: "乾", theme: "需要决断，公开说明比暗中拖延更合适。", keywords: ["决断", "宣明", "去弊", "果决"] },
  { sequence: 44, name: "天风姤", upper: "乾", lower: "巽", theme: "偶遇新因，宜辨别诱因，不可轻忽。", keywords: ["相遇", "诱因", "辨别", "节制"] },
  { sequence: 45, name: "泽地萃", upper: "兑", lower: "坤", theme: "人事聚合，宜明确共同目标与秩序。", keywords: ["聚集", "共识", "资源", "秩序"] },
  { sequence: 46, name: "地风升", upper: "坤", lower: "巽", theme: "循序上升，适合踏实积累、由下而上。", keywords: ["上升", "积累", "循序", "成长"] },
  { sequence: 47, name: "泽水困", upper: "兑", lower: "坎", theme: "处境受限，守住心气与底线尤为重要。", keywords: ["困顿", "受限", "守心", "节用"] },
  { sequence: 48, name: "水风井", upper: "坎", lower: "巽", theme: "资源可用但需维护制度与取用方式。", keywords: ["资源", "供养", "制度", "维护"] },
  { sequence: 49, name: "泽火革", upper: "兑", lower: "离", theme: "变革有因，宜在条件成熟后更新旧局。", keywords: ["变革", "更新", "时机", "决心"] },
  { sequence: 50, name: "火风鼎", upper: "离", lower: "巽", theme: "整合成器，适合更新方法与稳定供给。", keywords: ["整合", "成器", "更新", "承载"] },
  { sequence: 51, name: "震为雷", upper: "震", lower: "震", theme: "震动惊醒，先稳住节奏，再处理变化。", keywords: ["震动", "警醒", "行动", "复位"] },
  { sequence: 52, name: "艮为山", upper: "艮", lower: "艮", theme: "止而后定，适合暂停、界定与内省。", keywords: ["止定", "边界", "内省", "沉稳"] },
  { sequence: 53, name: "风山渐", upper: "巽", lower: "艮", theme: "渐进有序，慢一点反而更可靠。", keywords: ["渐进", "秩序", "成长", "耐心"] },
  { sequence: 54, name: "雷泽归妹", upper: "震", lower: "兑", theme: "关系位置需辨清，勿因一时情势失分寸。", keywords: ["关系", "名分", "冲动", "分寸"] },
  { sequence: 55, name: "雷火丰", upper: "震", lower: "离", theme: "盛大明亮之时，宜把握重点，防止过满。", keywords: ["丰盛", "明动", "高峰", "取舍"] },
  { sequence: 56, name: "火山旅", upper: "离", lower: "艮", theme: "身在过渡，宜守礼、轻装、少依赖。", keywords: ["旅居", "过渡", "谨慎", "自持"] },
  { sequence: 57, name: "巽为风", upper: "巽", lower: "巽", theme: "柔入渐进，适合沟通、渗透和长期影响。", keywords: ["柔入", "沟通", "渗透", "顺势"] },
  { sequence: 58, name: "兑为泽", upper: "兑", lower: "兑", theme: "悦而有度，交流有利但不可流于轻率。", keywords: ["喜悦", "交流", "开放", "节度"] },
  { sequence: 59, name: "风水涣", upper: "巽", lower: "坎", theme: "离散可化，宜疏通阻隔、重建连接。", keywords: ["涣散", "疏通", "化解", "连接"] },
  { sequence: 60, name: "水泽节", upper: "坎", lower: "兑", theme: "设限成序，适合制定规则与控制节奏。", keywords: ["节制", "规则", "限度", "节奏"] },
  { sequence: 61, name: "风泽中孚", upper: "巽", lower: "兑", theme: "诚信在中，关系与判断都需回到真实。", keywords: ["诚信", "信任", "内实", "沟通"] },
  { sequence: 62, name: "雷山小过", upper: "震", lower: "艮", theme: "小事可过，大事宜谨慎，不宜过度拔高。", keywords: ["小过", "谨慎", "细节", "低飞"] },
  { sequence: 63, name: "水火既济", upper: "坎", lower: "离", theme: "阶段已成，越接近完成越要防松懈。", keywords: ["已成", "收束", "防变", "完善"] },
  { sequence: 64, name: "火水未济", upper: "离", lower: "坎", theme: "尚未完成，方向可见但仍需耐心调度。", keywords: ["未成", "调整", "过渡", "续行"] }
];

const makeJudgment = (seed: HexagramSeed) =>
  `${seed.name}，上${seed.upper}下${seed.lower}。${seed.theme}`;

const makeFocus = (seed: HexagramSeed) =>
  `可重点参考「${seed.keywords.join("、")}」等象意，结合占事的现实条件判断进退。`;

export const hexagrams: Hexagram[] = seeds.map((seed) => ({
  sequence: seed.sequence,
  name: seed.name,
  upper: seed.upper,
  lower: seed.lower,
  judgment: makeJudgment(seed),
  keywords: seed.keywords,
  readingFocus: makeFocus(seed)
}));

export const hexagramByTrigrams = new Map<string, Hexagram>(
  hexagrams.map((hexagram) => [createHexagramKey(hexagram.lower, hexagram.upper), hexagram])
);

export function createHexagramKey(lower: TrigramName, upper: TrigramName) {
  return `${lower}-${upper}`;
}
