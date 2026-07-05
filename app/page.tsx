import Link from "next/link";
import { HomeClientBagua, HomeClientEntryCards } from "@/components/HomeClient";

const FEATURES = [
  { label: "算法透明", desc: "排盘规则、节气计算、十神生成均有完整逻辑可追溯" },
  { label: "术语准确", desc: "基于传统子平术数，不使用虚构概念" },
  { label: "克制解读", desc: "不做绝对预测，分析趋势和条件，留有余地" },
  { label: "隐私保护", desc: "所有命理数据在本地计算，不上传服务器" },
];

const FAQ = [
  { q: "八字排盘准确吗？", a: "排盘算法基于传统子平术数的节气、干支、五行生克规则，计算过程可追溯。但命理分析本质上是趋势和概率判断，不作为现实决策的唯一依据。" },
  { q: "需要精确到分钟的出生时间吗？", a: "时柱以出生时辰（两小时一个时辰）为单位，不需要精确到分钟。如不确定时间，选择午时（11-13点）作为默认值即可。" },
  { q: "付费解锁的报告和免费内容有什么不同？", a: "免费内容包括四柱命盘、五行分布、日主强弱及性格分析。付费内容包含完整的事业、财运、感情、健康深度解读、大运时间轴详批及流年分析。" },
];

export default function HomePage() {
  return (
    <>
      {/* 首屏 */}
      <HomeHeroSection />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 核心能力 */}
        <section className="py-16">
          <div className="gold-line mb-8" />
          <h2 className="font-serif text-xl text-rice-50/60 tracking-wider">核心能力</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="bazi-card rounded-lg p-5 gold-corner">
                <h3 className="text-sm font-medium text-gold-300">{f.label}</h3>
                <p className="mt-2 text-sm leading-6 text-rice-100/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 排盘示例 */}
        <section className="py-16">
          <div className="gold-line mb-8" />
          <h2 className="font-serif text-xl text-rice-50/60 tracking-wider">排盘示例</h2>
          <div className="mt-6 bazi-card rounded-xl p-6 gold-corner">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "年柱", stem: "甲", branch: "子", color: "text-jade-400" },
                { label: "月柱", stem: "丙", branch: "寅", color: "text-cinnabar-400" },
                { label: "日柱", stem: "戊", branch: "辰", color: "text-gold-400" },
                { label: "时柱", stem: "庚", branch: "申", color: "text-rice-200" },
              ].map((p) => (
                <div key={p.label} className="text-center">
                  <p className="text-xs text-rice-100/40 tracking-widest">{p.label}</p>
                  <p className={`mt-1 font-serif text-2xl tracking-[0.15em] ${p.color}`}>
                    {p.stem}{p.branch}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-xs text-rice-100/40">
              日主戊土 · 偏弱 · 用神火 · 忌神木
              <span className="gold-inline" />
              基于节气 · 儒略日 · 五虎遁算法
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="gold-line mb-8" />
          <h2 className="font-serif text-xl text-rice-50/60 tracking-wider">常见问题</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="bazi-card rounded-lg group">
                <summary className="cursor-pointer px-5 py-3.5 text-sm font-medium text-rice-50 hover:text-gold-300 transition-colors">
                  <span className="text-gold-400/60 mr-2">{i + 1}.</span>
                  {item.q}
                </summary>
                <div className="border-t border-brass-300/8 px-5 py-3.5 text-sm leading-7 text-rice-100/60">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-xs text-gold-400/60 hover:text-gold-300 tracking-wider transition-colors">
              查看更多 FAQ →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------- 首屏 Hero（服务端 + 客户端混合） ---------- */

function HomeHeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
      {/* 背景微光 */}
      <div className="absolute inset-0 coin-pattern opacity-20" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* 左侧文字 */}
        <div className="flex-1 text-center sm:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/8 px-4 py-1.5 font-serif text-xs text-gold-300/80 tracking-[0.2em]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400/60" />
            传统命理 · 专业排盘
          </p>
          <h1 className="font-serif text-4xl font-light leading-[1.2] text-rice-50 sm:text-5xl lg:text-6xl">
            以阴阳
            <span className="text-gold-300">观人</span>
            <br />
            以五行
            <span className="text-gold-300">明事</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-rice-100/50">
            八字排盘 · 六爻起卦 · 流年运势 · 专题分析
          </p>
          <p className="mt-2 text-xs text-rice-100/30 leading-6">
            算法透明 · 术语准确 · 克制解读 · 隐私保护
          </p>
        </div>

        {/* 右侧八卦图 — 客户端渲染 */}
        <div className="flex-1 flex justify-center sm:justify-end">
          <HomeBaguaWrapper />
        </div>
      </div>

      {/* 入口卡片 */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeEntryCards />
      </div>

      {/* 向下提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] text-rice-100/40 tracking-widest">向下探索</span>
        <span className="block w-px h-8 bg-gradient-to-b from-rice-100/30 to-transparent" />
      </div>
    </section>
  );
}

/* ---------- 客户端包装器 ---------- */

function HomeBaguaWrapper() {
  return <HomeClientBagua />;
}

function HomeEntryCards() {
  return <HomeClientEntryCards />;
}
