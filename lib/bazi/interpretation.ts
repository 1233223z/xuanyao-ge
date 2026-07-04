/* ============================================================
 * 八字解读引擎
 *
 * 用规则引擎生成命理分析文案，非 LLM 随机生成。
 * 每条判断都有推理路径和命理依据。
 * ============================================================ */
import type { FourPillars, DayMasterAnalysis, DeityAdvice, DaYunResult, LiuNianAnalysis, WuXingCount, BaziReportSection } from "@/types/bazi";
import { STEM_WU_XING, STEM_YIN_YANG, stemIndex } from "./heavenly-stems";
import { BRANCH_WU_XING, BRANCH_MONTH } from "./earthly-branches";
import { GENERATES, CONTROLS } from "./five-elements";
import { calculateTenGod, tenGodNature, tenGodWuXingRelation } from "./ten-gods";

/**
 * 性格分析
 */
export function interpretPersonality(
  fourPillars: FourPillars,
  dayMaster: DayMasterAnalysis,
  deities: DeityAdvice
): string {
  const dmStem = dayMaster.stem;
  const dmWx = dayMaster.wuXing;
  const dmStrength = dayMaster.strength;

  const parts: string[] = [];

  // 日主特质
  const stemTraits: Record<string, string> = {
    甲: "甲木为阳木，如参天大树，有上进心，性格耿直、有主见。",
    乙: "乙木为阴木，如藤蔓花草，善于应变、有韧性，适应力强。",
    丙: "丙火为阳火，如太阳当空，热情开朗，善于表达，有感染力。",
    丁: "丁火为阴火，如灯烛之光，心思细腻，洞察力强，情感丰富。",
    戊: "戊土为阳土，如高山厚土，稳重可靠，有担当，讲信用。",
    己: "己土为阴土，如田园沃土，包容性强，善于协调，务实踏实。",
    庚: "庚金为阳金，如刀剑钢铁，果断刚毅，有魄力，原则性强。",
    辛: "辛金为阴金，如珠宝细金，精致敏锐，追求完美，有审美。",
    壬: "壬水为阳水，如江河湖海，胸怀宽广，有智慧，善于变通。",
    癸: "癸水为阴水，如雨露甘霖，含蓄内敛，直觉敏锐，有灵性。"
  };

  parts.push(stemTraits[dmStem] || `日主${dmStem}，五行属${dmWx}。`);

  // 强弱影响
  if (dmStrength === "偏强") {
    parts.push(`日主${dmStem}偏强，个性较为主动、独立，有自己的节奏和主张，不太容易受外界影响。但也要注意，过强则易显固执，在需要配合和让步的场合容易吃亏。`);
  } else if (dmStrength === "偏弱") {
    parts.push(`日主${dmStem}偏弱，性格相对内敛、敏感，善于体察他人情绪和环境变化。优点是谨慎周全，缺点是在压力和竞争面前容易犹豫退缩。`);
  } else {
    parts.push(`日主${dmStem}中和，性格较为平衡，既有主动性也有弹性，能够根据环境和对象调整自己的态度，适应力较好。`);
  }

  // 五行偏全
  const traits = analyzeFiveElementsTrait(fourPillars, dmWx);
  if (traits) parts.push(traits);

  // 十神参考
  const shenSha = describeShenSha(fourPillars);
  if (shenSha) parts.push(shenSha);

  return parts.join("");
}

/**
 * 五行偏全对性格的补充描述
 */
function analyzeFiveElementsTrait(fourPillars: FourPillars, dayMasterWx: string): string {
  const wzCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  // 统计各柱天干地支
  for (const pillar of [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]) {
    const sx = STEM_WU_XING[pillar.stem];
    wzCount[sx] = (wzCount[sx] || 0) + 1;
    const bx = BRANCH_WU_XING[pillar.branch];
    wzCount[bx] = (wzCount[bx] || 0) + 1;
  }

  // 找出最多的和最少的
  const sorted = Object.entries(wzCount).sort((a, b) => b[1] - a[1]);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];

  const parts: string[] = [];

  if (most[1] >= 4) {
    if (most[0] === "木") parts.push("八字中木气偏重，性格有正直、固执的一面，容易坚持己见。");
    else if (most[0] === "火") parts.push("八字中火气偏重，性格热情主动，但有时容易急躁冲动。");
    else if (most[0] === "土") parts.push("八字中土气偏重，性格稳重务实，但有时过于保守、缺乏变通。");
    else if (most[0] === "金") parts.push("八字中金气偏重，做事有原则、有决断力，但有时过于刚硬。");
    else if (most[0] === "水") parts.push("八字中水气偏重，聪明善变，适应力强，但有时难以坚持。");
  }

  if (least[1] <= 1 && least[0] !== most[0]) {
    if (least[0] === "木") parts.push("八字中缺木，在决断力和方向感上可能需要后天补足。");
    else if (least[0] === "火") parts.push("八字中缺火，在热情和表达力上可能需要更多主动激发。");
    else if (least[0] === "土") parts.push("八字中缺土，在稳定性和持久力上需要刻意培养。");
    else if (least[0] === "金") parts.push("八字中缺金，在原则性和决断力上可能需要加强。");
    else if (least[0] === "水") parts.push("八字中缺水，在应变和沟通上可能需要更多练习。");
  }

  return parts.join("");
}

/**
 * 十神组合神煞描述
 */
function describeShenSha(fourPillars: FourPillars): string {
  const dayMaster = fourPillars.day.stem;
  const parts: string[] = [];
  const stems = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.day.stem, fourPillars.hour.stem];

  // 统计十神出现情况
  const tenGodCount: Record<string, number> = {};
  for (const stem of stems) {
    const tg = calculateTenGod(dayMaster, stem);
    tenGodCount[tg] = (tenGodCount[tg] || 0) + 1;
  }

  if (tenGodCount["正官"] && tenGodCount["七杀"]) {
    parts.push("命带官杀混杂，在事业和人际关系上常有选择困难，容易面临两难局面。");
  }
  if ((tenGodCount["正财"] || 0) + (tenGodCount["偏财"] || 0) >= 2) {
    parts.push("财星透出，对赚钱和资源管理的敏感度较高。");
  }
  if (tenGodCount["伤官"] && tenGodCount["正官"]) {
    parts.push("伤官见官，个性中有不喜被约束的一面，在规则环境下容易感到压抑。");
  }
  if (tenGodCount["食神"] && tenGodCount["偏印"]) {
    parts.push("食神配偏印，思路独特，常有不同于常人的见解。");
  }

  return parts.join("");
}

/**
 * 事业财运分析
 */
export function interpretCareerWealth(
  fourPillars: FourPillars,
  dayMaster: DayMasterAnalysis,
  deities: DeityAdvice,
  daYun: DaYunResult
): string {
  const parts: string[] = [];
  const dm = dayMaster.stem;
  const dmWx = dayMaster.wuXing;

  // 官杀分析（事业）
  const guanShen = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.hour.stem]
    .map(s => ({ stem: s, tenGod: calculateTenGod(dm, s) }))
    .filter(x => x.tenGod === "正官" || x.tenGod === "七杀");

  if (guanShen.length > 0) {
    const guanTypes = guanShen.map(g => g.tenGod).join("");
    parts.push(`天干透出${guanShen.map(g => `${g.stem}（${g.tenGod}）`).join("、")}，对事业发展有较强的追求和责任心。`);
    if (guanShen.some(g => g.tenGod === "七杀")) {
      parts.push("七杀透出，做事有冲劲、敢于承担压力，但也要注意压力过大时对身心的影响。");
    }
  } else {
    parts.push("天干不透官杀，在事业上可能主动性不够强，更适合稳扎稳打的路径。");
  }

  // 财星分析（财运）
  const caiShen = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.hour.stem]
    .map(s => ({ stem: s, tenGod: calculateTenGod(dm, s) }))
    .filter(x => x.tenGod === "正财" || x.tenGod === "偏财");

  if (caiShen.length > 0) {
    parts.push(`天干见财星${caiShen.map(g => `${g.stem}（${g.tenGod}）`).join("、")}，对财富有敏感度，`);
    const hasZheng = caiShen.some(g => g.tenGod === "正财");
    const hasPian = caiShen.some(g => g.tenGod === "偏财");
    if (hasZheng && hasPian) {
      parts.push("正偏财俱透，收入渠道多元，既有稳定收入也有机会性收益，但也要注意理财节奏。");
    } else if (hasZheng) {
      parts.push("正财透出，收入以稳定来源为主，适合靠专业技能或固定渠道获得收益。");
    } else {
      parts.push("偏财透出，常有计划外收入或投资机会，但风险也相对较高。");
    }
  } else {
    parts.push("天干不透财星，财运多体现在稳健积累上，不宜追求快速暴利。");
  }

  // 日主强弱对事业的影响
  if (dayMaster.strength === "偏弱") {
    parts.push(`日主偏弱，在事业上容易感到力不从心，建议先积累实力、打造核心竞争力，不要过早追求扩张。`);
    parts.push(`当前宜用${deities.favorable.join("、")}来补足自身能量，事业发展上可以在擅长的领域深耕。`);
  } else if (dayMaster.strength === "偏强") {
    parts.push(`日主偏强，有足够的能力和精力应对事业挑战，适合担当管理角色或独立负责项目。`);
    parts.push(`但也要注意${deities.unfavorable.join("、")}过旺带来的固执倾向，适度放权或听取他人意见更有利于长远发展。`);
  } else {
    parts.push("日主中和，事业发展较为平稳，具备适应不同环境的能力。");
  }

  // 大运影响简要
  const currentDy = daYun.records[daYun.currentIndex];
  if (currentDy) {
    parts.push(`当前行${currentDy.stem}${currentDy.branch}${currentDy.stemWuXing}运，${currentDy.tenGodOfDay}透出，未来十年的事业重心会围绕${currentDy.stemWuXing}五行相关领域展开。`);
  }

  return parts.join("");
}

/**
 * 感情婚姻分析
 */
export function interpretRelationship(
  fourPillars: FourPillars,
  dayMaster: DayMasterAnalysis,
  gender: string
): string {
  const parts: string[] = [];
  const dm = fourPillars.day.stem;

  // 夫妻宫（日支）
  const spouseBranch = fourPillars.day.branch;
  const spouseWx = BRANCH_WU_XING[spouseBranch];
  parts.push(`日支${spouseBranch}为夫妻宫，五行属${spouseWx}。`);

  // 男命看财星，女命看官杀
  if (gender === "男") {
    const caiS = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.hour.stem]
      .map(s => ({ stem: s, tenGod: calculateTenGod(dm, s) }))
      .filter(x => x.tenGod === "正财" || x.tenGod === "偏财");

    if (caiS.length > 0) {
      parts.push(`天干透出${caiS.map(g => `${g.stem}（${g.tenGod}）`).join("、")}，异性缘分较为明显。`);
      if (caiS.some(g => g.tenGod === "偏财")) {
        parts.push("偏财透出，感情上容易有多元选择，需要注意专注和投入度。");
      }
    } else {
      parts.push("天干不透财星，在感情上可能偏于内敛、不擅表达。");
    }

    // 日支克日干
    const dmWx = STEM_WU_XING[dm];
    if (CONTROLS[spouseWx] === dmWx) {
      parts.push(`日支${spouseBranch}（${spouseWx}）克日主${dm}（${dmWx}），在亲密关系中容易感到被约束或有压力。`);
    } else if (GENERATES[spouseWx] === dmWx) {
      parts.push(`日支${spouseBranch}（${spouseWx}）生日主${dm}（${dmWx}），配偶或伴侣对自己有支持和助益。`);
    }
  } else {
    // 女命
    const guanS = [fourPillars.year.stem, fourPillars.month.stem, fourPillars.hour.stem]
      .map(s => ({ stem: s, tenGod: calculateTenGod(dm, s) }))
      .filter(x => x.tenGod === "正官" || x.tenGod === "七杀");

    if (guanS.length > 0) {
      parts.push(`天干透出${guanS.map(g => `${g.stem}（${g.tenGod}）`).join("、")}，在感情上有自己的标准和期待。`);
      if (guanS.some(g => g.tenGod === "七杀")) {
        parts.push("七杀在感情中代表不稳定的吸引力，容易被有挑战性的对象吸引，但需要分辨是一时吸引还是真正合适。");
      }
    } else {
      parts.push("天干不透官杀，在感情上可能比较被动、随缘。");
    }

    const dmWx = STEM_WU_XING[dm];
    if (GENERATES[dmWx] === spouseWx) {
      parts.push(`日主${dm}生夫妻宫${spouseBranch}，说明在感情中愿意付出，但也要注意不要过度牺牲。`);
    }
  }

  return parts.join("");
}

/**
 * 健康分析
 */
export function interpretHealth(
  fourPillars: FourPillars,
  dayMaster: DayMasterAnalysis
): string {
  const parts: string[] = [];
  const wzCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  for (const pillar of [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]) {
    wzCount[STEM_WU_XING[pillar.stem]]++;
    wzCount[BRANCH_WU_XING[pillar.branch]]++;
  }

  // 偏旺的五行
  const maxWz = Math.max(...Object.values(wzCount));
  const overloaded = Object.entries(wzCount).filter(([_, v]) => v >= 4).map(([k]) => k);

  if (overloaded.includes("木")) parts.push("木气过旺，注意肝胆和筋骨的养护，避免过度劳累。");
  if (overloaded.includes("火")) parts.push("火气偏盛，注意心血管和血液循环，避免长期紧张和熬夜。");
  if (overloaded.includes("土")) parts.push("土气偏重，注意脾胃消化系统，饮食宜规律有节。");
  if (overloaded.includes("金")) parts.push("金气偏旺，注意呼吸系统和皮肤保养。");
  if (overloaded.includes("水")) parts.push("水气偏重，注意肾脏和泌尿系统，避免寒湿环境。");

  // 偏弱的五行
  const minWz = Math.min(...Object.values(wzCount));
  const weak = Object.entries(wzCount).filter(([_, v]) => v <= 1 && v < maxWz - 2).map(([k]) => k);

  if (weak.includes("木")) parts.push("木气不足，建议多运动、舒展筋骨。");
  if (weak.includes("火")) parts.push("火气不足，注意手脚保暖，适当增加有氧运动。");
  if (weak.includes("土")) parts.push("土气较弱，注意饮食调理，养成良好的作息习惯。");
  if (weak.includes("金")) parts.push("金气偏弱，注意提升免疫力，避免久坐少动。");
  if (weak.includes("水")) parts.push("水气偏弱，注意补水，保持规律作息。");

  if (parts.length === 0) {
    parts.push("五行分布较为均衡，没有明显的健康短板，但仍需保持良好的生活习惯。");
  }

  parts.push("需要提醒的是，命理分析仅供参考，如有具体健康问题请咨询专业医生。");

  return parts.join("");
}

/**
 * 生成八字报告的所有分段
 */
export function generateBaziReportSections(
  fourPillars: FourPillars,
  dayMaster: DayMasterAnalysis,
  deities: DeityAdvice,
  daYun: DaYunResult,
  lvNian: LiuNianAnalysis,
  gender: string
): BaziReportSection[] {
  return [
    {
      title: "核心格局",
      tag: "格局",
      content: `日主${dayMaster.stem}${dayMaster.yinYang}${dayMaster.wuXing}，生于${fourPillars.month.branch}月，${dayMaster.strength}。用神为${deities.favorable.join("、")}，忌神为${deities.unfavorable.join("、")}。${deities.tiáoHòu}`,
      isLocked: false
    },
    {
      title: "性格分析",
      tag: "性格",
      content: interpretPersonality(fourPillars, dayMaster, deities),
      isLocked: false
    },
    {
      title: "事业分析",
      tag: "事业",
      content: interpretCareerWealth(fourPillars, dayMaster, deities, daYun),
      isLocked: true,
      price: 9.9
    },
    {
      title: "财运分析",
      tag: "财运",
      content: interpretCareerWealth(fourPillars, dayMaster, deities, daYun),
      isLocked: true,
      price: 9.9
    },
    {
      title: "感情婚姻分析",
      tag: "感情",
      content: interpretRelationship(fourPillars, dayMaster, gender),
      isLocked: true,
      price: 9.9
    },
    {
      title: "健康分析",
      tag: "健康",
      content: interpretHealth(fourPillars, dayMaster),
      isLocked: true,
      price: 9.9
    },
    {
      title: "大运分析",
      tag: "大运",
      content: daYun.records.map(r =>
        `${r.description}：${r.stemWuXing}运`
      ).join("；"),
      isLocked: true,
      price: 9.9
    },
    {
      title: "流年分析",
      tag: "流年",
      content: lvNian.detail,
      isLocked: true,
      price: 9.9
    }
  ];
}
