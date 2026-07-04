import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "付费说明 | 玄爻阁",
  description: "玄爻阁各功能的免费与付费内容说明"
};

const PLANS = [
  {
    name: "免费",
    price: "0",
    desc: "基础排盘与核心分析",
    features: [
      "八字四柱排盘",
      "五行分布查看",
      "日主强弱分析",
      "十神关系透视",
      "性格分析"
    ],
    cta: "开始使用",
    href: "/bazi",
    highlighted: false
  },
  {
    name: "单次解锁",
    price: "9.9",
    unit: "元/份",
    desc: "解锁一份完整报告",
    features: [
      "包含免费版所有内容",
      "事业深度分析",
      "财运格局详解",
      "感情婚姻分析",
      "健康调理建议",
      "大运流年时间线"
    ],
    cta: "解锁报告",
    href: "#",
    highlighted: true
  },
  {
    name: "月度会员",
    price: "29.9",
    unit: "元/月",
    desc: "无限查看所有报告",
    features: [
      "无限次八字详批",
      "无限次六爻解读",
      "流年运势更新",
      "优先新功能体验",
      "无广告体验"
    ],
    cta: "即将开放",
    href: "#",
    highlighted: false
  }
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">PRICING</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">付费说明</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          所有基础排盘功能免费使用。高级报告按需付费，清晰透明。
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`bazi-card rounded-xl p-6 ${
              plan.highlighted ? "border-gold-400/40 ring-1 ring-gold-400/20" : ""
            }`}
          >
            {plan.highlighted && (
              <p className="mb-3 text-center text-xs text-gold-400">推荐</p>
            )}
            <h3 className="text-center font-serif text-lg text-rice-50">{plan.name}</h3>
            <p className="mt-1 text-center text-sm text-rice-100/50">{plan.desc}</p>
            <div className="my-5 text-center">
              <span className="text-3xl font-bold text-rice-50">¥{plan.price}</span>
              {plan.unit && (
                <span className="ml-1 text-sm text-rice-100/50">{plan.unit}</span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-rice-100/60">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-gold-400">✦</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              {plan.href !== "#" ? (
                <Link
                  href={plan.href}
                  className="inline-block w-full rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
                >
                  {plan.cta}
                </Link>
              ) : (
                <span className="inline-block w-full rounded-lg border border-brass-300/20 bg-ink-800 py-2.5 text-sm text-rice-100/50">
                  {plan.cta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-brass-300/10 bg-ink-850 p-4 text-xs text-rice-100/40">
        <p>
          ⚠️ 支付功能目前处于开发阶段。在正式上线之前，所有高级报告内容均可免费预览。
          付费功能会通过 Stripe 或其他合规支付渠道处理，您的支付信息安全由第三方支付平台保障。
        </p>
      </div>
    </div>
  );
}
