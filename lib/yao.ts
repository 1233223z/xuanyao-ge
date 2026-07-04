import { hexagramByTrigrams } from "@/data/hexagrams";
import type {
  CoinFace,
  DivinationMethod,
  DivinationResult,
  FiveElement,
  Hexagram,
  ReadingSection,
  SixRelative,
  SixSpirit,
  TrigramName,
  YaoLine,
  YaoLineDetail,
  YaoNature,
  YaoValue
} from "@/types/yao";
import { buildDeepInterpretation } from "./yao-interpretation";

const trigramPatterns: Record<string, TrigramName> = {
  "111": "乾",
  "110": "兑",
  "101": "离",
  "100": "震",
  "011": "巽",
  "010": "坎",
  "001": "艮",
  "000": "坤"
};

export const positionNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

const trigramElements: Record<TrigramName, FiveElement> = {
  乾: "金",
  兑: "金",
  离: "火",
  震: "木",
  巽: "木",
  坎: "水",
  艮: "土",
  坤: "土"
};

const generates: Record<FiveElement, FiveElement> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

const controls: Record<FiveElement, FiveElement> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

const sixSpiritBase: SixSpirit[] = ["青龙", "朱雀", "勾陈", "腾蛇", "白虎", "玄武"];

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${pick("year")}年${pick("month")}月${pick("day")}日 ${pick("hour")}:${pick("minute")}`;
}

export function createRandomCoins(): [CoinFace, CoinFace, CoinFace] {
  return Array.from({ length: 3 }, () => (Math.random() > 0.5 ? "back" : "character")) as [
    CoinFace,
    CoinFace,
    CoinFace
  ];
}

export function evaluateCoins(coins: [CoinFace, CoinFace, CoinFace], position: YaoLine["position"]): YaoLine {
  const backCount = coins.filter((coin) => coin === "back").length;
  const valueByBackCount: Record<number, YaoValue> = {
    0: 6,
    1: 7,
    2: 8,
    3: 9
  };

  const value = valueByBackCount[backCount];
  const nature: YaoNature = value === 7 || value === 9 ? "yang" : "yin";
  const labelByValue: Record<YaoValue, YaoLine["label"]> = {
    6: "老阴",
    7: "少阳",
    8: "少阴",
    9: "老阳"
  };

  return {
    position,
    coins,
    value,
    nature,
    isMoving: value === 6 || value === 9,
    label: labelByValue[value]
  };
}

export function changedNature(line: YaoLine): YaoNature {
  if (!line.isMoving) {
    return line.nature;
  }

  return line.nature === "yang" ? "yin" : "yang";
}

export function resolveTrigram(natures: YaoNature[]): TrigramName {
  const pattern = natures.map((nature) => (nature === "yang" ? "1" : "0")).join("");
  const trigram = trigramPatterns[pattern];

  if (!trigram) {
    throw new Error(`无法识别三爻组合：${pattern}`);
  }

  return trigram;
}

export function resolveHexagram(lines: YaoLine[], useChangedLines = false): Hexagram {
  if (lines.length !== 6) {
    throw new Error("排盘需要完整的六爻数据。");
  }

  const natures = lines.map((line) => (useChangedLines ? changedNature(line) : line.nature));
  const lower = resolveTrigram(natures.slice(0, 3));
  const upper = resolveTrigram(natures.slice(3, 6));
  const hexagram = hexagramByTrigrams.get(`${lower}-${upper}`);

  if (!hexagram) {
    throw new Error(`未找到上${upper}下${lower}对应的卦象数据。`);
  }

  return hexagram;
}

function resolveRelative(selfElement: FiveElement, lineElement: FiveElement): SixRelative {
  if (selfElement === lineElement) {
    return "兄弟";
  }

  if (generates[selfElement] === lineElement) {
    return "子孙";
  }

  if (generates[lineElement] === selfElement) {
    return "父母";
  }

  if (controls[selfElement] === lineElement) {
    return "妻财";
  }

  return "官鬼";
}

function resolveWorldPosition(lines: YaoLine[]) {
  const firstMoving = lines.find((line) => line.isMoving);
  return firstMoving?.position ?? 6;
}

function resolveResponsePosition(worldPosition: number) {
  return (((worldPosition + 2) % 6) + 1) as YaoLine["position"];
}

export function buildLineDetails(lines: YaoLine[], hexagram: Hexagram): YaoLineDetail[] {
  const selfElement = trigramElements[hexagram.lower];
  const worldPosition = resolveWorldPosition(lines);
  const responsePosition = resolveResponsePosition(worldPosition);

  return lines.map((line) => {
    const trigram = line.position <= 3 ? hexagram.lower : hexagram.upper;
    const element = trigramElements[trigram];

    return {
      position: line.position,
      positionName: positionNames[line.position - 1],
      relation: resolveRelative(selfElement, element),
      spirit: sixSpiritBase[line.position - 1],
      worldResponse:
        line.position === worldPosition ? "世" : line.position === responsePosition ? "应" : null,
      element,
      basis: "基础盘面：六亲以本卦内卦五行为基准，六神按初爻起青龙顺排。"
    };
  });
}

export function buildOneLineConclusion(primary: Hexagram, changed: Hexagram | null, lines: YaoLine[]) {
  const movingCount = lines.filter((line) => line.isMoving).length;
  const changePart = changed ? `动而之${changed.name}` : "六爻皆静，重在看本卦";
  const pace =
    movingCount === 0
      ? "宜先把眼前条件看清"
      : movingCount >= 3
        ? "中间变量较多，不宜一下定死"
        : "变化点已经露出，宜先问清关键条件";

  return `${primary.name}，${changePart}；此事看得到机会或方向，但成败多落在细节能否落实，${pace}。`;
}

type DivinationTopic = "work" | "relationship" | "wealth" | "cooperation" | "travel" | "exam" | "general";

type TopicProfile = {
  label: string;
  focus: string;
  current: string;
  moving: string;
  risk: string;
  advice: string;
  questions: string[];
};

const trigramImages: Record<TrigramName, string> = {
  乾: "乾为天，主原则、推动、上层要求与主动性",
  兑: "兑为泽，主口头沟通、承诺、交换与说法",
  离: "离为火，主明处、文书、名目、看得见的条件",
  震: "震为雷，主动作、启动、突发变化与执行力",
  巽: "巽为风，主细节、传达、渗透、反复沟通",
  坎: "坎为水，主阻隔、隐情、风险、压力与反复",
  艮: "艮为山，主门槛、停止、边界、审核与迟滞",
  坤: "坤为地，主承载、配合、制度、整体安排与落实"
};

const hexagramImages: Partial<Record<string, string>> = {
  地水师: "师有队伍、规则、调度之象，外坤主组织与制度，内坎主压力、风险和不明之处",
  火水未济: "未济有事情尚未完全成形之象，火在上、水在下，方向看得见，但中间仍有阻隔",
  山火贲: "贲有修饰、包装、门面之象，外艮主界限与门槛，内离主明处条件与可见信息",
  地火明夷: "明夷有光被遮蔽之象，内里有明，但外部环境不一定让真实情况完全显露",
  水雷屯: "屯为初生受阻之象，事情刚起头就有杂乱和阻力，需先理清条件",
  山水蒙: "蒙为未明之象，信息不全，容易因不懂规则或听信片面说法而判断偏差",
  水天需: "需为等待之象，事情有方向，但时机和条件还未完全到位",
  天水讼: "讼为争执之象，主意见不合、边界不清、证据和说法容易相冲",
  水地比: "比为亲附选择之象，重点在谁可靠、关系是否稳定、是否值得跟随",
  风天小畜: "小畜为小有积蓄而未足之象，条件有一点起色，但力量尚不够大",
  天泽履: "履为行于规则之象，走得稳不稳，关键看分寸、礼法和边界",
  地天泰: "泰为上下相通之象，沟通顺、条件通，事情较容易形成配合",
  天地否: "否为上下不交之象，上下说法或利益难接上，容易各想各的",
  天火同人: "同人为同道相聚之象，主公开协作、共同目标和彼此认同",
  火天大有: "大有为资源在手之象，条件不弱，但也考验能否稳妥使用",
  地山谦: "谦为低处守正之象，宜把姿态放稳，不宜过度张扬或冒进",
  雷地豫: "豫为预备和动员之象，人心已动，但安排未必都细",
  泽雷随: "随为跟随变化之象，主顺势而动，也要看所随之人事是否可靠",
  山风蛊: "蛊为旧弊待修之象，表面推进前，先要处理遗留问题",
  地泽临: "临为事情临近之象，机会靠近，但需要承接能力和边界",
  风地观: "观为观察审视之象，宜先看全局和对方真实表现",
  火雷噬嗑: "噬嗑为咬合清障之象，有阻碍要靠规则、处分或明确要求来解决",
  山地剥: "剥为基础被削之象，主条件减弱、资源流失或下盘不稳",
  地雷复: "复为转机初回之象，事情有恢复苗头，但还在起步",
  天雷无妄: "无妄为不妄动之象，宜按事实和正当路径走，不宜投机",
  山天大畜: "大畜为大力蓄养之象，资源和能力要先沉淀，不能只看一时冲劲",
  山雷颐: "颐为养正之象，主供养、输入输出和日常节律",
  泽风大过: "大过为负担过重之象，结构承压，容易硬撑",
  坎为水: "坎为重险之象，风险反复出现，先保底线和安全",
  离为火: "离为重明之象，主文书、名目、可见条件，也容易依附他物",
  泽山咸: "咸为感应之象，关系有触动，重在真实互动和分寸",
  雷风恒: "恒为长久之象，事情成不成看持续性、承诺和稳定节奏",
  天山遁: "遁为退避之象，形势不宜强争，保留余地更稳",
  雷天大壮: "大壮为势强之象，行动力足，但过强则容易失度",
  火地晋: "晋为进展上升之象，适合显露能力、争取位置和推进",
  风火家人: "家人为内部秩序之象，分工、规矩、责任比外表热闹更重要",
  火泽睽: "睽为分歧之象，彼此立场不同，难以完全同频",
  水山蹇: "蹇为行路受阻之象，前方有难，宜回头调整路径或求助",
  雷水解: "解为困局松开之象，问题有解法，但要及时行动",
  山泽损: "损为取舍之象，有所减损才可能换来清楚",
  风雷益: "益为增益之象，主互相扶助、增加资源和顺势扩展",
  泽天夬: "夬为决断去弊之象，拖延不如把话说开",
  天风姤: "姤为偶遇新因之象，机会来得突然，也要防诱因不稳",
  泽地萃: "萃为聚合之象，人、资源、信息集中，需有共同规则",
  地风升: "升为循序上升之象，适合由下而上、一步一步做实",
  泽水困: "困为受限之象，资源或处境不宽，先看能不能撑住",
  水风井: "井为稳定供给之象，资源可用，但制度和维护方式很关键",
  泽火革: "革为变革之象，旧方式要换，但时机和理由必须足",
  火风鼎: "鼎为整合成器之象，主重新配置资源、方法和位置",
  震为雷: "震为重动之象，事情有震动和惊醒，先稳住再处理",
  艮为山: "艮为重止之象，主暂停、边界、审核和自我控制",
  风山渐: "渐为渐进之象，慢慢成形，急不得",
  雷泽归妹: "归妹为关系位置未正之象，名分、角色和先后次序要分清",
  雷火丰: "丰为盛大之象，表面光亮、信息多，但过满则易乱",
  火山旅: "旅为过渡在外之象，环境不熟，宜轻装、守礼、少依赖",
  巽为风: "巽为重入之象，主沟通渗透、反复确认和慢慢影响",
  兑为泽: "兑为重悦之象，说法好听、沟通顺，但也要看实质",
  风水涣: "涣为离散疏通之象，阻隔可解，但先要把散乱处收拢",
  水泽节: "节为设限成序之象，规则、额度、时间表很重要",
  风泽中孚: "中孚为诚信在中之象，能否互信是关键",
  雷山小过: "小过为细节过度之象，小事可动，大事宜谨慎",
  水火既济: "既济为阶段已成之象，越接近完成越要防松懈"
};

const topicProfiles: Record<DivinationTopic, TopicProfile> = {
  work: {
    label: "工作类占事",
    focus: "岗位、团队、薪资、制度、承诺落地与入职风险",
    current:
      "重点不在“有没有机会”这一句，而在岗位规则、人员安排、薪资制度、管理方式是否清楚。若对方说法很多但细节不明，就要先看制度和承诺能不能落地。",
    moving:
      "工作问题里，动爻常对应入职前后的条件确认、岗位内容变化、负责人态度、工资结算或实际执行安排。",
    risk:
      "风险多在规则不清。若只强调待遇好、机会快，却对薪资结构、合同、休息、住宿、离职结算说得含糊，就要谨慎。",
    advice:
      "可以继续接触，但先把工资、工时、住宿、押金、合同、结算方式问清楚，最好留下聊天记录。条件清楚再决定，条件含糊就不要急着过去。",
    questions: [
      "工资是底薪、提成还是综合收入，结算周期怎么写？",
      "岗位内容、工时、休息、住宿、押金和离职结算是否明确？",
      "是谁负责招聘承诺，入职后是否还由同一套规则执行？"
    ]
  },
  relationship: {
    label: "感情类占事",
    focus: "关系主动性、对方态度、沟通阻力与后续变化",
    current:
      "重点在双方态度是否同向。若一方热、一方慢，或说法好听但行动不足，就要看对方是否愿意持续投入，而不是只看一时表达。",
    moving:
      "感情问题里，动爻多落在态度变化、沟通转折、见面安排或关系定位上。",
    risk:
      "风险在话说得多、行动跟不上，或关系名分、边界没有说清，容易反复拉扯。",
    advice:
      "不要急着逼结论，先看对方是否稳定回应、是否愿意安排见面、是否能把关系说清。若长期只有暧昧表达而无实际行动，就要保留距离。",
    questions: [
      "对方是否主动联系，还是主要由你推动？",
      "关系定位是否说清，是否存在回避承诺的情况？",
      "近期是否有明确见面、沟通或解决矛盾的安排？"
    ]
  },
  wealth: {
    label: "财运类占事",
    focus: "回款、投入、风险、现金流与是否适合推进",
    current:
      "重点在钱能不能回到手里，以及投入和收益是否匹配。表面有利不代表能马上变现，要看流程、周期和责任方。",
    moving:
      "财运问题里，动爻常对应付款节点、投入变化、对方资金状况或回款时间。",
    risk:
      "风险在先投入、后承诺，或收益说得清楚但退出机制不明，容易形成资金占压。",
    advice:
      "涉及投入要控制额度，先确认回款时间、违约责任、费用明细和退出方式，不要为了赶机会把资金一次压满。",
    questions: [
      "钱从哪里来，什么时候能到账，有无书面凭据？",
      "投入后如何退出，亏损或延期由谁承担？",
      "费用、税费、手续费、分成比例是否逐项写清？"
    ]
  },
  cooperation: {
    label: "合作类占事",
    focus: "对方可靠度、规则清楚度、责任边界与执行落地",
    current:
      "重点在双方怎么分工、谁承担责任、规则能不能先写清。若只谈愿景和收益，却不谈交付、费用和违约，卦象就偏向提醒先定规则。",
    moving:
      "合作问题里，动爻常对应谈判后段、合同确认、资源到位、分工调整或责任边界变化。",
    risk:
      "风险在责任含糊。对方越急着推进，越要看费用、交付、验收、退出和违约责任是否写得明白。",
    advice:
      "可以继续谈，但要把分工、费用、交付标准、验收方式、退出机制写下来。对方若回避这些细节，就不宜马上投入资源。",
    questions: [
      "双方各自负责什么，交付标准怎么验收？",
      "费用、分成、垫资、违约和退出机制是否写清？",
      "对方已有资源是否真实到位，还是只停留在口头承诺？"
    ]
  },
  travel: {
    label: "出行类占事",
    focus: "行程安排、交通住宿、时间节点与临时变动",
    current:
      "重点在路线、时间和中转安排是否稳。若卦中有阻象，通常不是完全不能走，而是提示中间环节要多预留。",
    moving:
      "出行问题里，动爻常对应临出发、路途中、到达前后的变化。",
    risk:
      "风险在延误、改签、证件遗漏、住宿或接应安排不清。",
    advice:
      "提前确认车票机票、证件、住宿、天气和备用路线，关键节点留出缓冲时间。",
    questions: [
      "交通、住宿、证件是否已确认？",
      "是否有备用路线或改签方案？",
      "到达后谁接应，时间地点是否明确？"
    ]
  },
  exam: {
    label: "考试类占事",
    focus: "准备程度、临场发挥、规则细节与复盘空间",
    current:
      "重点在准备是否扎实、薄弱处是否已经补上。卦象若见阻，常提示规则、时间分配或细节失分。",
    moving:
      "考试问题里，动爻多对应复习后段、临场状态、成绩公布或补救机会。",
    risk:
      "风险在会的题不稳、时间安排失衡、材料证件或考试规则忽略。",
    advice:
      "把高频题、错题和考试流程再过一遍，临近考试少换大方向，多稳住能拿分的部分。",
    questions: [
      "薄弱题型是否已经集中处理？",
      "考试时间、证件、地点、规则是否确认？",
      "临场时间分配和答题顺序是否已有方案？"
    ]
  },
  general: {
    label: "综合占事",
    focus: "条件是否成形、责任是否清楚、推进节奏是否合适",
    current:
      "重点在事情的真实结构。看起来有机会时，也要分清哪些已经落地，哪些还只是说法或预期。",
    moving:
      "动爻代表事情已经有变化点，通常落在相应阶段的条件转换、态度变化或执行安排上。",
    risk:
      "风险在关键条件没有说清就提前投入，后续容易因为边界不明而反复。",
    advice:
      "先把时间、责任、费用、交付和退出条件问明白，再决定推进力度。",
    questions: [
      "这件事最关键的条件是否已经明确？",
      "谁负责推进，谁承担结果？",
      "若后续不顺，有没有退出或调整方案？"
    ]
  }
};

function detectTopic(title: string): DivinationTopic {
  const text = title.toLowerCase();

  if (/工作|岗位|入职|求职|上班|薪资|工资|面试|公司|老板|职业|兼职/.test(text)) {
    return "work";
  }

  if (/感情|恋爱|复合|婚姻|喜欢|对象|男友|女友|前任|暧昧|关系/.test(text)) {
    return "relationship";
  }

  if (/财|钱|回款|投资|收入|生意|借款|贷款|收益|项目款|付款/.test(text)) {
    return "wealth";
  }

  if (/合作|合伙|客户|合同|项目|谈判|对方|签约/.test(text)) {
    return "cooperation";
  }

  if (/出行|旅行|搬家|外出|路程|行程|车票|机票/.test(text)) {
    return "travel";
  }

  if (/考试|考证|升学|面试|录取|成绩/.test(text)) {
    return "exam";
  }

  return "general";
}

function describeHexagram(hexagram: Hexagram) {
  const image = hexagramImages[hexagram.name];

  if (image) {
    return `本卦为${hexagram.name}，${image}。`;
  }

  return `本卦为${hexagram.name}，上卦${hexagram.upper}、下卦${hexagram.lower}；${trigramImages[hexagram.upper]}，${trigramImages[hexagram.lower]}。`;
}

function describeChangedHexagram(hexagram: Hexagram | null) {
  if (!hexagram) {
    return "本次六爻皆静，没有形成变卦，说明盘面重点仍落在本卦所示的当前状态。";
  }

  const image = hexagramImages[hexagram.name];
  return image
    ? `变卦为${hexagram.name}，${image}。`
    : `变卦为${hexagram.name}，上卦${hexagram.upper}、下卦${hexagram.lower}；后续会转向${trigramImages[hexagram.upper]}与${trigramImages[hexagram.lower]}所对应的局面。`;
}

function describeMovingStage(lines: YaoLine[], topic: TopicProfile) {
  const moving = lines.filter((line) => line.isMoving);

  if (moving.length === 0) {
    return `本次无动爻，盘面偏静，${topic.label}里更像是条件尚未明显转动，先看本卦所呈现的状态。`;
  }

  const stages: Record<YaoLine["position"], string> = {
    1: "初爻发动，变化在开端，多应在刚接触、刚起念、刚谈条件的时候",
    2: "二爻发动，变化在实际接触层面，多应在沟通、试探、初步条件摆出来的时候",
    3: "三爻发动，变化在中段执行处，容易卡在细节、压力或临时调整上",
    4: "四爻发动，变化偏在后段，常应在临近确认、外部对接或正式执行之前",
    5: "五爻发动，变化贴近核心位置，多应在负责人、关键承诺或最终拍板处",
    6: "上爻发动，变化已到末段，多应在收尾、定局前后或结果即将显露时"
  };
  const stageText = moving.map((line) => stages[line.position]).join("；");

  return `${moving.map((line) => positionNames[line.position - 1]).join("、")}发动。${stageText}。${topic.moving}`;
}

function buildCurrentJudgment(primary: Hexagram, topic: TopicProfile) {
  return `${primary.name}落在${topic.label}上，${topic.current}`;
}

function buildTrendJudgment(changed: Hexagram | null, topic: TopicProfile) {
  if (!changed) {
    return `没有变卦，说明这件事短线不见明显转向。${topic.label}里可先按目前条件判断，不必因一句新说法就改主意。`;
  }

  return `${changed.name}落在${topic.label}上，后续不是简单地“成”或“不成”，而是会进入${topic.focus}这些实际环节。`;
}

export function buildInterpretation(
  primary: Hexagram,
  changed: Hexagram | null,
  lines: YaoLine[],
  title: string
): ReadingSection[] {
  const moving = lines.filter((line) => line.isMoving);
  const movingNames = moving.map((line) => positionNames[line.position - 1]);
  const movingText =
    moving.length === 0
      ? "本次无动爻"
      : `动爻在${movingNames.join("、")}`;
  const changeName = changed?.name ?? "无变卦";
  const titleText = title.trim() || "未命名占事";
  const topic = topicProfiles[detectTopic(titleText)];
  const currentJudgment = buildCurrentJudgment(primary, topic);
  const trendJudgment = buildTrendJudgment(changed, topic);
  const movingStage = describeMovingStage(lines, topic);
  const movingRisk =
    moving.length >= 2
      ? "动爻不止一处，说明这件事不只一个环节会变，前后说法可能会出现调整。"
      : moving.length === 1
        ? `变化集中在${movingNames[0]}，先盯住这个阶段对应的问题。`
        : "盘面不动，风险多在你以为事情会自然推进，但对方或环境暂时没有实际动作。";

  return [
    {
      title: "核心判断",
      tag: "判断",
      evidence: `占事「${titleText}」得${primary.name}，${movingText}，变卦为${changeName}。`,
      judgment: `${describeHexagram(primary)}这件事放在${topic.label}里，重点会落到${topic.focus}。${changed ? `后面又变为${changed.name}，表示局面还会转到另一层问题上。` : "没有变卦，说明眼下的判断主要看本卦，不宜把未出现的变化想得太满。"}`,
      advice: topic.advice
    },
    {
      title: "卦象依据",
      tag: "依据",
      evidence: `上卦为${primary.upper}，下卦为${primary.lower}。${trigramImages[primary.upper]}；${trigramImages[primary.lower]}。`,
      judgment: `上卦多看外部环境和对方呈现，下卦多看内里条件与真实压力。${primary.name}在这里不是单看吉凶，而是提示：外面看到的形势与里面能不能承接，要分开判断。`,
      advice: `因此此事要先抓${topic.focus}，不要只看表面说法。`
    },
    {
      title: "当前局势",
      tag: "局势",
      evidence: `${describeHexagram(primary)}`,
      judgment: currentJudgment,
      advice: topic.advice
    },
    {
      title: "变化趋势",
      tag: "趋势",
      evidence: changed
        ? `${movingText}，由${primary.name}变为${changed.name}。${describeChangedHexagram(changed)}`
        : "本次未见老阴、老阳，六爻不变。",
      judgment: trendJudgment,
      advice: changed ? "如果后续对方说法改变、条件延后或需要重新确认，就与变卦之象相合，宜把节奏放慢一档。" : "目前不必频繁追问结果，先把已经摆出来的条件逐项核清。"
    },
    {
      title: "动爻分析",
      tag: "趋势",
      evidence: moving.length > 0 ? `${movingNames.join("、")}发动。` : "本次无动爻。",
      judgment: movingStage,
      advice: moving.length > 0 ? `先核对${topic.focus}中最靠近动爻阶段的部分。` : "若后续出现新的承诺、变动或催促，可以重新起卦看变化。"
    },
    {
      title: "风险点",
      tag: "风险",
      evidence: `${primary.name}${changed ? `变${changed.name}` : "无变"}，${movingText}。`,
      judgment: `${topic.risk}${movingRisk}`,
      advice: "凡是对方回避细节、催你马上决定、或关键条款前后不一致的地方，都要单独记下来。"
    },
    {
      title: "可执行建议",
      tag: "建议",
      evidence: `排盘显示本卦为${primary.name}${changed ? `，后续转为${changed.name}` : "，且无变卦"}。`,
      judgment: `${topic.label}不怕慢一点，怕的是在关键条件没问清时先投入时间、钱或承诺。`,
      advice: topic.advice
    },
    {
      title: "需要核实的问题",
      tag: "核实",
      evidence: `占事类型按「${titleText}」归入${topic.label}，盘面为${primary.name}${changed ? `之${changed.name}` : ""}。`,
      judgment: `下面这些问题若答不上来，卦象里的阻隔或反复就容易在现实中显出来。`,
      questions: topic.questions
    }
  ];
}

type CalculateInput = {
  title: string;
  question: string;
  method: DivinationMethod;
  castTime?: string;
  lines: YaoLine[];
};

export function calculateDivination(input: CalculateInput): DivinationResult {
  const primaryHexagram = resolveHexagram(input.lines);
  const changedLines = input.lines.filter((line) => line.isMoving).map((line) => line.position);
  const changedHexagram = changedLines.length > 0 ? resolveHexagram(input.lines, true) : null;
  const lineDetails = buildLineDetails(input.lines, primaryHexagram);

  return {
    id: createId(),
    title: input.title.trim() || "未命名占事",
    question: input.question.trim(),
    method: input.method,
    castTime: input.castTime ?? formatDateTime(),
    lines: input.lines,
    lineDetails,
    changedLines,
    primaryHexagram,
    changedHexagram,
    oneLineConclusion: buildOneLineConclusion(primaryHexagram, changedHexagram, input.lines),
    interpretation: buildDeepInterpretation(primaryHexagram, changedHexagram, input.lines, input.title)
  };
}

// ==================== 增强功能 ====================

export const DAY_CYCLE = [
  "甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉",
  "甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未",
  "甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳",
  "甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯",
  "甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑",
  "甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"
];

/**
 * 时间起卦
 * 年 + 月 → 上卦，年 + 月 + 日 → 下卦，年 + 月 + 日 + 时 → 动爻
 */
export function createTimeBasedCoins(date?: Date): YaoLine[] {
  const now = date || new Date();
  const year = now.getFullYear() % 100;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const shiChen = Math.floor((hour + 1) / 2) % 12 + 1;

  const upperNum = (year + month) % 8;
  const lowerNum = (year + month + day) % 8;
  const movingYao = ((year + month + day + shiChen) % 6) || 6;

  const trigramNatures = (n: number): [YaoNature, YaoNature, YaoNature] => {
    const bits = [
      n === 0 ? 0 : (n - 1) & 4 ? 1 : 0,
      n === 0 ? 0 : (n - 1) & 2 ? 1 : 0,
      n === 0 ? 0 : (n - 1) & 1 ? 1 : 0
    ];
    return bits.map(b => b === 1 ? "yang" as const : "yin" as const) as [YaoNature, YaoNature, YaoNature];
  };

  const upper = trigramNatures(upperNum);
  const lower = trigramNatures(lowerNum);
  const allNatures = [...lower, ...upper];

  return allNatures.map((nature, i) => {
    const position = (i + 1) as YaoLine["position"];
    const isMoving = position === movingYao;
    const value: YaoValue = isMoving
      ? (nature === "yang" ? 9 : 6)
      : (nature === "yang" ? 7 : 8);
    return {
      position,
      coins: ["back", "back", "back"] as [CoinFace, CoinFace, CoinFace],
      value,
      nature,
      isMoving,
      label: value === 9 ? "老阳" as const : value === 6 ? "老阴" as const : value === 7 ? "少阳" as const : "少阴" as const
    };
  });
}

/**
 * 获取当前日干支（用于排六神）
 */
export function getDayStem(): string {
  const now = new Date();
  const start = new Date(2024, 0, 1);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return DAY_CYCLE[((diff % 60) + 60) % 60];
}
