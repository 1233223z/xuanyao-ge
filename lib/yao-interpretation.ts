import type {
  Hexagram, YaoLine, TrigramName, ReadingSection,
  DivinationTopic
} from "@/types/yao";
import { hexagramByTrigrams } from "@/data/hexagrams";
import { positionNames } from "./yao";

// ==================== 八卦基础意象 ====================

const TRIGRAM: Record<TrigramName, {
  name: string; element: string; nature: string;
  image: string; work: string; relationship: string; wealth: string; general: string;
}> = {
  乾: {
    name: "乾", element: "金", nature: "刚健",
    image: "天行健。乾卦六阳，主原则、上层、主动性。代表推动力、规则制定者、最终决策方。",
    work: "乾在工作类占事中多指上层要求或主动推进的力量。条件不缺推动力，缺的是执行细节和落地安排。",
    relationship: "乾在感情中代表主动方或原则性强的一方。过重则关系容易一方主导、缺乏弹性。",
    wealth: "乾在财运中主主动求财、靠能力赚钱。来路正但周期偏长，不宜急功近利。",
    general: "乾象主导时，外部条件、规则框架、上层态度是关键变量。"
  },
  坤: {
    name: "坤", element: "土", nature: "柔顺",
    image: "地势坤。坤卦六阴，主承载、配合、制度与整体安排。",
    work: "坤在工作类占事中代表制度、团队配合或稳定执行。适合在体系内稳步推进。",
    relationship: "坤在感情中代表包容、稳定和长期付出。重则稳定但可能缺乏激情。",
    wealth: "坤在财运中主稳定收入、制度性收益。来得不猛但持久。",
    general: "坤象主导时，重点看承载能力和配合是否顺畅。"
  },
  震: {
    name: "震", element: "木", nature: "动荡",
    image: "震为雷，主动作、启动、突发变化。",
    work: "震在工作类占事中代表变动或新启动。原有节奏被打破，宜快速响应。",
    relationship: "震在感情中主波动或新的吸引力。过重则关系稳定性不足。",
    wealth: "震在财运中主意外之财或突发支出。宜快进快出。",
    general: "震象主导时，事情有突然的变化或启动信号。"
  },
  巽: {
    name: "巽", element: "木", nature: "渗透",
    image: "巽为风，主沟通、渗透、反复和细节。",
    work: "巽在工作类占事中代表沟通协调、细节执行。推进靠耐心，不是一蹴而就。",
    relationship: "巽在感情中主温和的追求、逐渐深入。宜慢慢来。",
    wealth: "巽在财运中主细水长流或靠信息差获利。需要持续关注和灵活调整。",
    general: "巽象主导时，关键在细节、沟通和反复确认。"
  },
  坎: {
    name: "坎", element: "水", nature: "险陷",
    image: "坎为水，主阻隔、隐情、风险与反复。",
    work: "坎在工作类占事中代表阻力、不明朗或潜在风险。表面机会背后可能有隐藏条件。",
    relationship: "坎在感情中主波折、隐瞒或不确定因素。有些情况对方没有完全说明。",
    wealth: "坎在财运中主流动性问题或资金占压。来得慢走得快。",
    general: "坎象主导时，先确认风险边界和隐藏条件。"
  },
  离: {
    name: "离", element: "火", nature: "依附",
    image: "离为火，主明处、文书、名目与看得见的条件。",
    work: "离在工作类占事中代表公开信息或合同文书。事情已摆到台面上。",
    relationship: "离在感情中代表公开关系或明面互动。关系透明但可能缺乏深度默契。",
    wealth: "离在财运中主看得见的收益或合同保障。名分清楚但需防虚有其表。",
    general: "离象主导时，事情已公开化，重点在看明面条件是否真实。"
  },
  艮: {
    name: "艮", element: "土", nature: "静止",
    image: "艮为山，主门槛、停止、边界与迟滞。",
    work: "艮在工作类占事中代表门槛、审核或阶段性暂停。不宜强行突破。",
    relationship: "艮在感情中主边界感强或关系停滞。有一方在保持距离。",
    wealth: "艮在财运中主资金沉淀或回报周期偏长。适合长线布局。",
    general: "艮象主导时，事情处于暂停或等待状态。"
  },
  兑: {
    name: "兑", element: "金", nature: "悦纳",
    image: "兑为泽，主口头沟通、承诺、交换与双方满意。",
    work: "兑在工作类占事中代表面试、谈判、口头承诺。沟通氛围好但要看承诺能否落地。",
    relationship: "兑在感情中代表言语表达和吸引力。热闹但要看行动是否跟得上语言。",
    wealth: "兑在财运中主通过沟通或社交获得收入。机会多但需辨别真实交易。",
    general: "兑象主导时沟通顺畅，但兑为缺——要留意说得太好听的部分。"
  }
};

// ==================== 64卦深度条目 ====================

type HexagramEntry = {
  name: string; sequence: number;
  overall: string;
  gui_xiang: string;
  by_topic: Partial<Record<DivinationTopic, {
    focus: string; analysis: string; risk: string; advice: string; questions: string[];
  }>>;
  moving_notes: Partial<Record<number, string>>;
};

const PROFILES: Record<string, HexagramEntry> = {
  "乾为天": {
    name: "乾为天", sequence: 1,
    overall: "六阳纯刚，天道运行之象。乾卦不是单纯的吉卦，而是提示你：这件事的主导权在你手上，但权力越大越需要自我约束。",
    gui_xiang: "上乾下乾，天外有天。六爻皆阳，事物处于高度主动和可见的状态。但阳刚过盛则易折，爻辞从潜龙到亢龙讲的全是对力量的控制。",
    by_topic: {
      work: {
        focus: "主动权与制度约束",
        analysis: "乾卦在工作类占事中是一个强信号：你或对方掌握着主要决策权。事情不缺推动力，缺的是对节奏和分寸的控制。乾卦提示：不要因为自己能推动就一路往前冲。如果是在求职或谈判中，乾卦说明你处于相对有利位置，但有利不等于对方一定会让步。",
        risk: "最大的风险是自信过度。六阳容易高估自己的掌控力，低估制度和他人意见的约束。",
        advice: "利用你的主动权去确认具体条件，而不是继续施压。把话说清楚、把条件写下来。",
        questions: ["你目前掌握的信息是否全面？", "对方的真实意图和你理解的是否一致？", "如果推进不顺利，你的备用方案是什么？"]
      },
      relationship: {
        focus: "主导权与弹性",
        analysis: "乾卦在感情中代表主动方和原则性较强的一方。乾象过重时，关系容易变成一方主导、另一方配合的模式。短期效率高，长期则缺乏弹性。乾卦提示：问问自己在这段关系里是在带领还是在控制。",
        risk: "感情中的乾卦风险在自己太明白——你很清楚想要什么，但对方可能不完全认同。",
        advice: "留出让对方表达的空间。在关键问题上先问对方的想法再做决定。",
        questions: ["对方在这段关系中的真实感受是什么？", "你们对关系的定位和期待是否一致？", "最近有没有你主导决策但对方其实不同意的时刻？"]
      },
      wealth: {
        focus: "主动求财与节奏控制",
        analysis: "乾卦在财运上是主动求财之象。你或团队在积极推动某个收入来源。乾卦提示三个关键：第一，收入来得猛不代表来得稳；第二，扩张节奏要匹配承接能力；第三，合同和规则要先于投入。",
        risk: "扩张过快、杠杆过高。阳极为阴，盛极则衰。不要在看起来最好的时候把筹码全部押上。",
        advice: "控制投入节奏，确认回款周期和退出机制后再加码。现金流比增长率更重要。",
        questions: ["这个收入的可持续性如何？", "如果回款延迟三个月你的资金链能否撑住？", "合同和退出机制是否已经明确？"]
      },
      general: {
        focus: "条件成熟度与推进节奏",
        analysis: "乾卦在综合占事中是力量充足的信号。有力量不等于该用力，要看推动的方向是否正确、配套条件是否到位。爻辞从潜龙勿用到亢龙有悔讲的是一个克制的过程。",
        risk: "条件越好越容易忽略风险。容易在条件不完全具备时就开始大规模行动。",
        advice: "先确认三个问题：条件是否全部到位？各方是否已有共识？退出方案是否清晰？",
        questions: ["关键条件是否已经完全具备？", "各方对这件事的理解是否一致？", "如果推进不顺利调整或退出的空间有多大？"]
      }
    },
    moving_notes: {
      1: "初爻动「潜龙勿用」。事情还在萌芽阶段，不宜大张旗鼓。",
      2: "二爻动「见龙在田」。机会已浮现，适合适度展现能力和意图。",
      3: "三爻动「终日乾乾」。需要持续努力，不可松懈。",
      4: "四爻动「或跃在渊」。面临进退选择，不可犹豫太久。",
      5: "五爻动「飞龙在天」。条件成熟，适合全力推进。",
      6: "上爻动「亢龙有悔」。过犹不及，注意收敛和控制。"
    }
  },
  "坤为地": {
    name: "坤为地", sequence: 2,
    overall: "六阴纯柔，大地承载之象。坤卦不是被动，而是以柔承刚的智慧。事情需要耐心和配合。",
    gui_xiang: "上坤下坤，地地相连。六爻皆阴，代表事情处于承载、配合、积淀的阶段。先迷后得主——开始时方向可能不清晰，但坚持下去会找到路径。",
    by_topic: {
      work: {
        focus: "制度环境与长期积累",
        analysis: "坤卦在工作类占事中是一个稳的信号。当前环境偏重制度和稳定性，不是靠突破或创新取胜的局面，而是靠扎实执行、配合制度来推进。如果考虑跳槽或转行，坤卦提示不要只看表面待遇，要看公司制度是否健全。",
        risk: "过于保守、被动等待。柔顺过度容易变成缺乏主见。",
        advice: "做好本职工作的同时主动梳理自己的成果和价值，在制度框架内合理展现。",
        questions: ["你的价值在现有体系内是否被充分认可？", "当前环境的上升通道是否清晰？", "你是在主动选择稳定还是被动接受现状？"]
      },
      relationship: {
        focus: "包容度与长期稳定性",
        analysis: "坤卦在感情中代表包容和长期陪伴。这段关系的基础是相互支持和务实相处。坤卦提示：感情温度可能不是最高的，但稳定性和可持续性是优势。",
        risk: "关系变得平淡或一方付出过多。柔顺过度容易变成单方面迁就。",
        advice: "主动创造一些新鲜的互动方式，同时注意双方付出的对等性。",
        questions: ["你们最近的互动是否变得模式化？", "你的付出和获得是否平衡？", "你是在包容对方还是在委屈自己？"]
      },
      wealth: {
        focus: "稳定收益与制度性收入",
        analysis: "坤卦在财运上代表稳定的制度性收入。工资、固定收益、长期合约——来得不猛但持久。如果考虑投资或创业，优先选择成熟行业或已有现金流的项目。",
        risk: "收入渠道单一，缺乏弹性。稳定但不易突破。",
        advice: "在稳住现有收入来源的基础上逐步开辟副线。",
        questions: ["你的收入来源是否过于单一？", "有没有不冒大风险也能开拓的收入渠道？", "当前收入是否跟上了支出增长？"]
      },
      general: {
        focus: "基础建设和长期布局",
        analysis: "坤卦在综合占事中传递的是先打好基础的信息。事情可能看起来进展不快，但这恰恰是在打地基的阶段。先迷后得主——随着深入了解，路径会逐渐清晰。",
        risk: "把耐心误认为停滞。坤卦的静容易让人焦躁。",
        advice: "把注意力从结果转移到系统上——先建立流程、维护关系、收集信息。",
        questions: ["基础条件是否已经具备？", "你是在打基础还是在被动等待？", "如果把结果放一放先做扎实过程会有什么不同？"]
      }
    },
    moving_notes: {
      1: "初爻动「履霜坚冰至」。小信号已出现，防微杜渐。",
      2: "二爻动「直方大」。保持正直和包容，自然有收获。",
      3: "三爻动「含章可贞」。有才华但不宜急于表现。",
      4: "四爻动「括囊」。谨言慎行，不要轻易表态。",
      5: "五爻动「黄裳元吉」。低调谦逊反而能赢得最大认可。",
      6: "上爻动「龙战于野」。长期积累到临界点，必然有变化。"
    }
  },
  "水雷屯": {
    name: "水雷屯", sequence: 3,
    overall: "屯为初生受堵之象。事情刚起步就遇到阻力，但这不一定是坏事——初期受阻反而能帮你避免在基础不牢时匆忙推进。",
    gui_xiang: "上坎下震，水上雷下。坎为险在外，震为动在内。外面有压力阻碍，里面有行动动力。你想推动但条件不配合，这就是屯卦的核心矛盾。",
    by_topic: {
      work: {
        focus: "起步期阻力与条件梳理",
        analysis: "屯卦在工作类占事中非常典型：要么新工作入职初期各种不顺，要么项目刚启动就遇到意外阻力。核心判断是：不是方向错了，是条件还没有理顺。先把人的关系、事的流程、资源的到位情况逐一核查。",
        risk: "急于求成导致动作变形。因为初期不顺而用力过猛，反而把关系搞僵。",
        advice: "把当前卡住的点按人的问题、流程的问题、资源的问题分类列出，逐项解决。",
        questions: ["哪些条件和你之前了解的不一样？", "最大阻力来自制度流程还是人的配合？", "你有足够的时间来度过这个适应期吗？"]
      },
      relationship: {
        focus: "初期磨合与耐心培养",
        analysis: "屯卦在感情中代表关系的初期阶段。坎为隐，说明双方都有一些没完全表达的想法；震为动，说明有一方想推动关系前进。屯卦提示：不要急着确定关系，给彼此时间把实际情况看清楚。",
        risk: "沟通不到位，误判对方意图。一方急着推进、另一方还没准备好。",
        advice: "放缓节奏，多创造轻松交流的机会。关键问题上有话直说但不要逼对方表态。",
        questions: ["你们对这段关系的期待是否一致？", "有什么话还没说开？", "如果暂时不推进关系你能接受吗？"]
      },
      wealth: {
        focus: "资金占压与流动性管理",
        analysis: "屯卦在财运上代表资金被占压或回款周期偏长。钱还没回来但投入已经出去了。这不是赚不到钱的卦，而是回款周期比预期长的卦。",
        risk: "现金流断裂。最大财务风险是投入和回款之间的时间差。",
        advice: "先确认已投入资金的回款时间表，再决定是否增加新投入。保留至少三个月流动资金。",
        questions: ["投入是否有明确的回款计划？", "如果回款延迟三个月能否撑住？", "有没有办法缩短投入到回款的周期？"]
      },
      general: {
        focus: "条件成熟度与启动时机",
        analysis: "屯卦的核心提示是条件不够全不要硬推。卦象本身不凶，但要求你在启动前把必要条件准备好。坎为险在外——现实条件可能比你以为的复杂。",
        risk: "在条件不具备的情况下强行启动，导致后续问题不断。",
        advice: "列出推进此事必需的三个条件，逐一核实是否到位。有一个不具备就先解决它。",
        questions: ["最关键的条件是什么？到位了吗？", "有没有因为急于启动而忽略准备工作？", "如果推迟两周条件会更成熟吗？"]
      }
    },
    moving_notes: {
      1: "初爻动「盘桓」。起步不顺，宜暂缓脚步重新审视。",
      2: "二爻动「屯如邅如」。前进艰难但非无路。",
      3: "三爻动「即鹿无虞」。冒进易失手，需要有人指引。",
      4: "四爻动「乘马班如」。选择多但条件不全，适合观望。",
      5: "五爻动「屯其膏」。资源有但分配不均。",
      6: "上爻动「泣血涟如」。问题集中显现，需从根源解决。"
    }
  }
};

// ==================== 通用条目的自动生成 ====================

const TRIGRAM_ELEMENT: Record<TrigramName, string> = {
  乾: "金", 兑: "金", 离: "火", 震: "木",
  巽: "木", 坎: "水", 艮: "土", 坤: "土"
};

function makeProfile(h: Hexagram): HexagramEntry {
  const up = TRIGRAM[h.upper];
  const low = TRIGRAM[h.lower];
  const n = h.name;
  if (PROFILES[n]) return PROFILES[n];

  return {
    name: n, sequence: h.sequence,
    overall: `${n}。上${h.upper}下${h.lower}。${up.image}${low.image}`,
    gui_xiang: `上卦${h.upper}（${up.element}）主外在环境与条件呈现，下卦${h.lower}（${low.element}）主内在状态与执行力。`,
    by_topic: {
      work: {
        focus: "内外条件的配合",
        analysis: `${n}在工作类占事中，以${low.element}为内部执行力基础、${up.element}为外部环境条件。当前判断的关键是看内外是否匹配——外部的机会或压力，内部的执行能否接得住。`,
        risk: "内外不匹配。外部条件和内部状态如果不能协调，事情容易卡在中间环节。",
        advice: "先把外部条件摸清，再评估内部执行能力。二者匹配再推进。",
        questions: ["外部条件和内部能力是否匹配？", "你对外部环境的判断是否过于乐观？", "如果条件变化你的调整速度够快吗？"]
      },
      relationship: {
        focus: "外在表现与内在状态",
        analysis: `${n}在感情中，外卦${h.upper}代表关系呈现的样貌，内卦${h.lower}代表真实的互动状态。外${up.nature}内${low.nature}，外在表现和内在实际可能不完全一致。`,
        risk: "表面和谐下的需求差异。内外性质不同时关系容易看起来不错但实际有问题。",
        advice: "安排一次不受干扰的深入交流，把各自对关系的期待和顾虑摊开。",
        questions: ["关系的外在表现和内在感受是否一致？", "最近有没有觉得没问题但总感觉不太对的时刻？", "你们对未来的规划是否真的在同一条线上？"]
      },
      wealth: {
        focus: `${up.element}${low.element}的配合与财运走势`,
        analysis: `${n}在财运上，外卦代表外部经济环境和机会来源，内卦代表个人的财务管理和执行能力。二者之间的生克关系决定了财运的基本走势。`,
        risk: "内外部条件不协调导致的机会浪费或资金损失。",
        advice: "在确认外部机会真实可靠之前控制投入规模。优先保现金流再考虑收益。",
        questions: ["当前的收入来源是否稳定？", "有没有新的收入渠道值得尝试？", "支出和收入是否在合理范围内？"]
      },
      general: {
        focus: "条件配合与关键变量",
        analysis: `${n}在综合占事中，外卦代表外部条件和环境呈现，内卦代表自身能力和执行力。走势取决于二者能否协调——外部条件成熟时内部能否承接。`,
        risk: "只看卦名吉凶，忽略内外条件的匹配度。",
        advice: "逐项列出外部条件，再评估资源是否足够。条件不足就等或换路径。",
        questions: ["做这件事目前最缺什么？", "如果条件变化你的备用方案是什么？", "你是因为条件成熟在做还是因为想做在做？"]
      }
    },
    moving_notes: {
      1: `初爻动。外部条件开始出现变化信号。`,
      2: `二爻动。内在条件或核心关系出现调整。`,
      3: `三爻动。执行层或中间环节出现变化。`,
      4: `四爻动。制度或关键人物的态度开始变化。`,
      5: `五爻动。决策层或核心条件有重要变动。`,
      6: `上爻动。事情接近定局，变化不会太大。`
    }
  };
}

// ==================== 话题检测 ====================

function detectTopic(title: string): DivinationTopic {
  const t = title.toLowerCase();
  if (/工作|岗位|入职|求职|上班|薪资|工资|面试|公司|老板|职业|兼职/.test(t)) return "work";
  if (/感情|恋爱|复合|婚姻|喜欢|对象|男友|女友|前任|暧昧|关系/.test(t)) return "relationship";
  if (/财|钱|回款|投资|收入|生意|借款|贷款|收益|项目款|付款/.test(t)) return "wealth";
  if (/合作|合伙|客户|合同|项目|谈判|对方|签约/.test(t)) return "cooperation";
  if (/出行|旅行|搬家|外出|路程|行程|车票|机票/.test(t)) return "travel";
  if (/考试|考证|升学|面试|录取|成绩/.test(t)) return "exam";
  if (/健康|疾病|看病|身体/.test(t)) return "health";
  return "general";
}

const TOPIC_LABEL: Record<DivinationTopic, string> = {
  work: "工作", relationship: "感情", wealth: "财运",
  cooperation: "合作", travel: "出行", exam: "考试",
  health: "健康", general: "综合"
};

// ==================== 解读入口 ====================

export function buildDeepInterpretation(
  primary: Hexagram,
  changed: Hexagram | null,
  lines: YaoLine[],
  title: string
): ReadingSection[] {
  const profile = makeProfile(primary);
  const moving = lines.filter(l => l.isMoving);
  const movingPos = moving.map(l => l.position);
  const topic = detectTopic(title);
  const label = TOPIC_LABEL[topic];

  const topicData = profile.by_topic[topic] || profile.by_topic.general!;

  const sections: ReadingSection[] = [];

  // 1
  sections.push({
    title: "核心判断",
    tag: "判断",
    evidence: `占出${primary.name}${changed ? "之" + changed.name : "，六爻不动"}`,
    judgment: `此卦落在${label}上。${profile.overall}${changed ? " 动而之" + changed.name + "，局面会向另一个状态转化。" : " 六爻皆静，短期内不会出现大的转折。"}`,
    advice: topicData.advice
  });

  // 2
  sections.push({
    title: "卦象依据",
    tag: "依据",
    evidence: profile.gui_xiang,
    judgment: `${primary.name}。${profile.gui_xiang} 落在${label}上，${topicData.focus}是判断的关键。`,
    advice: topicData.advice
  });

  // 3
  sections.push({
    title: "当前局势",
    tag: "局势",
    evidence: `当前盘面为${primary.name}。`,
    judgment: topicData.analysis,
    advice: topicData.advice
  });

  // 4 动爻
  if (movingPos.length > 0) {
    const notes = movingPos.map(p =>
      `${positionNames[p - 1]}：${profile.moving_notes?.[p] || "此爻发动，对应事情的具体环节。"}`
    ).join(" ");
    sections.push({
      title: "动爻分析",
      tag: "趋势",
      evidence: movingPos.map(p => positionNames[p - 1]).join("、") + "发动。",
      judgment: `${notes} 在${label}上，对应${topicData.focus}中的变化点。`,
      advice: movingPos.length >= 2
        ? "动爻不止一处，说明不只一个环节会变。先盯住最关键的动爻位置。"
        : "先核对最靠近动爻阶段的条件和安排。"
    });
  } else {
    sections.push({
      title: "动爻分析",
      tag: "趋势",
      evidence: "本次无动爻",
      judgment: "六爻皆静，盘面无变化信号。无动爻时重点看本卦卦象——条件还没到变化的时候。",
      advice: "不必频繁追问结果，先把已有条件逐项核清。若有新信息可重新起卦。"
    });
  }

  // 5 变卦
  if (changed) {
    const cp = makeProfile(changed);
    const ct = cp.by_topic[topic] || cp.by_topic.general!;
    sections.push({
      title: "变化趋势",
      tag: "趋势",
      evidence: `由${primary.name}变为${changed.name}。`,
      judgment: `本卦${primary.name}转向${changed.name}，事情会从当前状态过渡到另一个局面。${cp.overall} 在${label}上：${ct.analysis}`,
      advice: "变卦提示了发展方向。若后续出现与变卦之象相合的信号，说明变化已在路上。"
    });
  }

  // 6 风险
  sections.push({
    title: "风险点",
    tag: "风险",
    evidence: `${primary.name}${changed ? " 之" + changed.name : " 无变卦"}，${movingPos.length}处动爻。`,
    judgment: `${topicData.risk}${movingPos.length >= 2 ? " 多方面同时变化可能带来复杂局面。" : movingPos.length === 1 ? " 变化集中在一个环节。" : " 盘面不动时最大的风险是以为事情会自然推进但实际没有。"}`,
    advice: "对方回避细节、催你马上决定、或关键条款前后不一致的地方，都要单独记下来。"
  });

  // 7 建议
  sections.push({
    title: "可执行建议",
    tag: "建议",
    evidence: `本卦${primary.name}${changed ? " 之" + changed.name : " 无变卦"}。`,
    judgment: topicData.advice,
    advice: topicData.advice
  });

  // 8 核实问题
  sections.push({
    title: "需要核实的问题",
    tag: "核实",
    evidence: `占「${title.trim() || "未命名"}」得${primary.name}${changed ? " 之" + changed.name : ""}，归入${label}类。`,
    judgment: "以下问题如果答不上来，卦象中的阻隔就容易在现实中显出来：",
    questions: topicData.questions
  });

  return sections;
}
