import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ · 免责声明 | 玄爻阁",
  description: "关于八字排盘、六爻起卦的常见问题与使用须知。"
};

const FAQ_ITEMS = [
  {
    q: "玄爻阁是什么？",
    a: "玄爻阁是一个基于传统命理文化（八字、六爻、八卦）的排盘与分析工具。我们提供八字四柱排盘、六爻起卦、流年运势等功能，所有算法均基于传统子平术数和周易六爻规则。"
  },
  {
    q: "排盘结果准确吗？",
    a: "排盘算法基于节气、干支、五行生克等传统规则，计算过程透明可追溯。但命理分析本质上是文化观察和趋势判断，不承诺与现实完全吻合，不宜作为重大决策的唯一依据。"
  },
  {
    q: "八字排盘需要精确到分钟的出生时间吗？",
    a: "不需要。八字时柱以两小时为一个时辰，您只需选择大概的时间段即可。如果完全不知道出生时间，系统会默认使用午时（11:00-13:00）作为参考。"
  },
  {
    q: "什么是真太阳时？",
    a: "真太阳时是根据出生地的经度对北京时间进行修正后的时间。中国统一使用东八区时间（北京时间），但不同城市的实际日照时间有差异。修正后的时间更符合传统命理的时辰划分逻辑。"
  },
  {
    q: "六爻起卦的几种方式有什么区别？",
    a: "手动起卦需要您逐次记录三枚铜钱的正反面，最符合传统仪式。随机起卦由系统模拟抛掷过程。时间起卦则根据起卦时间计算卦象，适合无法用铜钱时快速起卦。三种方式在规则上都是有效的。"
  },
  {
    q: "付费解锁的报告包含什么内容？",
    a: "免费内容包含四柱命盘、五行分布、日主强弱、十神关系和性格分析。付费内容额外包含事业分析、财运分析、感情婚姻分析、健康分析、大运时间轴详批以及流年分析。"
  },
  {
    q: "你们如何使用我的个人信息？",
    a: "所有命理数据均在您的浏览器本地计算并存储，我们不会将您的姓名、出生日期等信息上传到任何服务器。当未来推出付费功能时，数据传输将单独说明并获得您的同意。"
  }
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center">
        <p className="font-serif text-xs tracking-widest text-gold-400/60">FAQ</p>
        <h1 className="mt-2 font-serif text-3xl text-rice-50">常见问题</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/60">
          关于玄爻阁的常见问题与使用须知
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="bazi-card rounded-lg">
            <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-rice-50">
              {item.q}
            </summary>
            <div className="border-t border-brass-300/10 px-5 py-4 text-sm leading-7 text-rice-100/70">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      {/* 免责声明 */}
      <div className="mt-12 bazi-card rounded-xl p-6">
        <h2 className="font-serif text-xl text-rice-50">免责声明</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-rice-100/60">
          <p>
            1. <strong>文化参考性质</strong>：命理是中国传统哲学文化的一部分，玄爻阁所提供的一切内容均属于文化参考和思维工具范畴，不代表科学结论。
          </p>
          <p>
            2. <strong>不承诺准确性</strong>：排盘算法基于传统命理规则，但命理分析本质上是概率和趋势判断，不保证与现实完全吻合。您不应将本网站内容作为决策的唯一依据。
          </p>
          <p>
            3. <strong>不替代专业意见</strong>：本网站内容不替代任何法律、医学、金融等专业建议。涉及重大决策时，请咨询持牌专业人士。
          </p>
          <p>
            4. <strong>用户自主判断</strong>：您对本网站所有内容的理解和运用，由您自行负责。我们不对因使用本网站内容而产生的任何直接或间接损失承担责任。
          </p>
          <p>
            5. <strong>隐私保护</strong>：所有命理数据在您的设备本地计算和存储。未来推出付费功能时，涉及的数据传输会单独告知并获得您的明确同意。
          </p>
          <p>
            6. <strong>年龄限制</strong>：建议18岁以上用户使用本网站。未成年人应在监护人指导下使用。
          </p>
        </div>
      </div>
    </div>
  );
}
