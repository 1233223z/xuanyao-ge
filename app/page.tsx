import Link from "next/link";

const HERO_ENTRIES = [
  {
    href: "/bazi",
    title: "八字排盘",
    sub: "知命局 · 明五行 · 观大运",
    desc: "输入生辰，排四柱、定日主、查十神、推大运。基于节气与干支算法，输出专业命盘。"
  },
  {
    href: "/divination",
    title: "六爻起卦",
    sub: "观事态 · 断吉凶 · 审变化",
    desc: "铜钱起卦或时间起卦，生成本卦变卦、动爻世应、六亲六神，结构化解读。"
  },
  {
    href: "/liunian",
    title: "流年运势",
    sub: "审时势 · 知进退 · 应变化",
    desc: "排八字大运流年，分析岁运关系，判断每年运势的吉凶趋势和注意事项。"
  }
];

const FEATURES = [
  { label: "算法透明", desc: "排盘规则、节气计算、十神生成均有完整逻辑可追溯" },
  { label: "术语准确", desc: "基于传统子平术数，不使用虚构概念" },
  { label: "克制解读", desc: "不做绝对预测，分析趋势和条件，留有余地" },
  { label: "隐私保护", desc: "所有命理数据在本地计算，不上传服务器" }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <div className="absolute inset-0 coin-pattern opacity-30" />
        <p className="relative mb-4 inline-flex rounded border border-gold-400/30 bg-gold-400/8 px-3 py-1 font-serif text-xs text-gold-300 tracking-widest">
          传统命理 · 专业排盘
        </p>
        <h1 className="relative max-w-3xl font-serif text-4xl font-light leading-tight text-rice-50 sm:text-5xl lg:text-6xl">
          以阴阳观人
          <br />
          <span className="text-gold-300">以五行明事</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-base leading-8 text-rice-100/60">
          八字排盘 · 六爻起卦 · 流年运势 · 专题分析
        </p>

        {/* Quick entry cards */}
        <div className="relative mt-10 grid w-full gap-4 sm:grid-cols-3">
          {HERO_ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="entry-card rounded-xl p-5 text-left"
            >
              <p className="font-serif text-lg text-rice-50">{entry.title}</p>
              <p className="mt-1 text-xs text-gold-300/80">{entry.sub}</p>
              <p className="mt-2 text-sm leading-6 text-rice-100/50">{entry.desc}</p>
              <span className="mt-3 inline-block text-xs text-gold-400/60">进入 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-16">
        <div className="gold-line mb-8" />
        <h2 className="font-serif text-2xl text-rice-50">为什么选择玄爻阁</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="bazi-card rounded-lg p-5">
              <h3 className="text-sm font-medium text-gold-300">{f.label}</h3>
              <p className="mt-2 text-sm leading-6 text-rice-100/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample preview */}
      <section className="py-16">
        <div className="gold-line mb-8" />
        <h2 className="font-serif text-2xl text-rice-50">排盘示例</h2>
        <div className="mt-6 bazi-card rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-xs text-rice-100/50">年柱</p>
              <p className="mt-1 font-serif text-xl text-jade-400">甲子</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-rice-100/50">月柱</p>
              <p className="mt-1 font-serif text-xl text-cinnabar-400">丙寅</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-rice-100/50">日柱</p>
              <p className="mt-1 font-serif text-xl text-gold-400">戊辰</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-rice-100/50">时柱</p>
              <p className="mt-1 font-serif text-xl text-rice-200">庚申</p>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-rice-100/40">
            日主戊土 · 偏弱 · 用神火 · 忌神木
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16">
        <div className="gold-line mb-8" />
        <h2 className="font-serif text-2xl text-rice-50">常见问题</h2>
        <div className="mt-6 space-y-4">
          {[
            { q: "八字排盘准确吗？", a: "排盘算法基于传统子平术数的节气、干支、五行生克规则，计算过程可追溯。但命理分析本质上是趋势和概率判断，不作为现实决策的唯一依据。" },
            { q: "需要精确到分钟的出生时间吗？", a: "时柱以出生时辰（两小时一个时辰）为单位，不需要精确到分钟。如不确定时间，选择午时（11-13点）作为默认值即可。" },
            { q: "付费解锁的报告和免费内容有什么不同？", a: "免费内容包括四柱命盘、五行分布、日主强弱及性格分析。付费内容包含完整的事业、财运、感情、健康深度解读、大运时间轴详批及流年分析。" }
          ].map((item, i) => (
            <details key={i} className="bazi-card rounded-lg">
              <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-rice-50">
                {item.q}
              </summary>
              <div className="border-t border-brass-300/10 px-5 py-3 text-sm leading-7 text-rice-100/60">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-sm text-gold-400/70 hover:text-gold-300">
            查看更多 FAQ →
          </Link>
        </div>
      </section>
    </div>
  );
}
