import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于 | 玄爻阁",
  description: "关于玄爻阁的缘起、理念与使用说明"
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">ABOUT</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">关于玄爻阁</h1>
      </div>

      <div className="space-y-6 text-sm leading-7 text-rice-100/70">
        <section className="bazi-card rounded-xl p-6">
          <h2 className="font-serif text-lg text-rice-50">缘起</h2>
          <p className="mt-3">
            玄爻阁源于对传统命理文化的尊重和好奇。在信息时代，很多人对八字、六爻等传统术数感兴趣，
            但苦于网络上充斥着粗制滥造的娱乐抽签式算命和「大师」营销。我们想做一款真正尊重传统、
            算法透明、术语准确、解读克制的工具。让需要的人能够获得专业、可靠的排盘参考。
          </p>
        </section>

        <section className="bazi-card rounded-xl p-6">
          <h2 className="font-serif text-lg text-rice-50">原则</h2>
          <div className="mt-3 space-y-3">
            <p><strong className="text-gold-300">算法透明</strong> — 排盘规则基于传统子平术数和周易六爻，所有计算逻辑可查可证。</p>
            <p><strong className="text-gold-300">术语准确</strong> — 不使用虚构概念，干支、五行、十神等术语严格对应传统定义。</p>
            <p><strong className="text-gold-300">克制解读</strong> — 不做绝对化预测，将命理分析表达为趋势和概率，留有余地。</p>
            <p><strong className="text-gold-300">隐私保护</strong> — 所有命理数据在本地计算，不上传服务器。</p>
          </div>
        </section>

        <section className="bazi-card rounded-xl p-6">
          <h2 className="font-serif text-lg text-rice-50">使用建议</h2>
          <div className="mt-3 space-y-2">
            <p>• 将命理分析视为一种观察问题和思考的角度，而非预言。</p>
            <p>• 涉及重大决策（财务、医疗、法律等）请务必咨询专业人士。</p>
            <p>• 同一问题短时间反复占卜不利于理性判断，建议给变化留出时间。</p>
            <p>• 出生时间越精准，八字排盘的参考价值越高。</p>
          </div>
        </section>

        <section className="bazi-card rounded-xl p-6">
          <h2 className="font-serif text-lg text-rice-50">技术说明</h2>
          <div className="mt-3 space-y-2">
            <p>• 八字排盘采用传统子平术数：节气定月柱、儒略日定日柱、五虎遁定月干、五鼠遁定时干。</p>
            <p>• 六爻起卦使用传统三枚铜钱法，纳甲、六神、世应定位均有完整规则。</p>
            <p>• 所有算法在客户端用 TypeScript 实现，无需服务端 API。</p>
            <p>• 基于 Next.js 15 + React 19 + Tailwind CSS 构建。</p>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <Link href="/faq" className="text-sm text-gold-400/70 hover:text-gold-300">
          查看 FAQ →
        </Link>
      </div>
    </div>
  );
}
