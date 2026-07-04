/* ============================================================
 * Stripe Checkout Session API Route
 *
 * 激活方式：
 *   1. 注册 Stripe 账户 → 获取密钥
 *   2. 在 Stripe Dashboard 创建三个产品，记下 Price ID
 *   3. 在 Vercel 设置环境变量
 * ============================================================ */
import { NextResponse } from "next/server";
import Stripe from "stripe";

// 价格映射表 — 把这里替换成你在 Stripe 创建的真实 Price ID
const PRICE_MAP: Record<string, string> = {
  bazi_report: "price_bazi_report",      // ¥9.9 八字报告
  liuyao_report: "price_liuyao_report",  // ¥9.9 六爻报告
  full_report: "price_full_report",      // ¥19.9 完整详批
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productType = "bazi_report", successUrl, cancelUrl } = body;

    const priceId = PRICE_MAP[productType];

    if (!priceId) {
      return NextResponse.json(
        { error: "无效的产品类型" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // 如果未配置密钥，返回友好提示
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error: "STRIPE_SECRET_KEY 未配置",
          message: "请在 Vercel 环境变量中设置 STRIPE_SECRET_KEY。去 stripe.com 注册获取密钥。"
        },
        { status: 501 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-06-24.dahlia",
    });

    const origin = request.headers.get("origin") || "https://xuanyao-ge.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "alipay"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${origin}/bazi/result?payment=success`,
      cancel_url: cancelUrl || `${origin}/bazi/result?payment=cancelled`,
      locale: "zh",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("创建支付会话失败:", error);
    return NextResponse.json(
      { error: "支付服务暂时不可用", detail: String(error) },
      { status: 500 }
    );
  }
}
