"use client";

import Link from "next/link";
import TaijiBagua from "./TaijiBagua";
import { AnimatedSection } from "./AnimatedSection";

export function HomeClientBagua() {
  return (
    <div className="flex items-center justify-center">
      <TaijiBagua size={320} />
    </div>
  );
}

const ENTRIES = [
  {
    href: "/bazi",
    title: "八字排盘",
    sub: "知命局 · 明五行 · 观大运",
    desc: "输入生辰，排四柱、定日主、查十神、推大运。基于节气与干支算法，输出专业命盘。",
    tag: "BAZI",
  },
  {
    href: "/divination",
    title: "六爻起卦",
    sub: "观事态 · 断吉凶 · 审变化",
    desc: "铜钱起卦或时间起卦，生成本卦变卦、动爻世应、六亲六神，结构化解读。",
    tag: "LIUYAO",
  },
  {
    href: "/liunian",
    title: "流年运势",
    sub: "审时势 · 知进退 · 应变化",
    desc: "排八字大运流年，分析岁运关系，判断每年运势的吉凶趋势和注意事项。",
    tag: "LIUNIAN",
  },
];

export function HomeClientEntryCards() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {ENTRIES.map((entry, i) => (
        <AnimatedSection key={entry.href} delay={i * 120}>
          <Link
            href={entry.href}
            className="entry-card glow-card rounded-xl p-5 block"
          >
            <p className="text-[10px] text-gold-400/50 tracking-[0.15em] mb-2">
              {entry.tag}
            </p>
            <p className="font-serif text-lg text-rice-50">{entry.title}</p>
            <p className="mt-1 text-xs text-gold-300/60">{entry.sub}</p>
            <p className="mt-2 text-sm leading-6 text-rice-100/50">{entry.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold-400/50 group-hover:text-gold-300 transition-colors">
              进入
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
