/* ============================================================
 * POST /api/payment/webhook
 *
 * Stripe Webhook — 验证支付成功事件。
 * 收到 checkout.session.completed 后：
 *   1. 读取 metadata.productId
 *   2. 更新订单状态
 *   3. 将来接入数据库后写入订单表
 *
 * 环境变量依赖：
 *   STRIPE_WEBHOOK_SECRET         从 Stripe Dashboard 获取
 *   STRIPE_SECRET_KEY             必需
 *
 * 本地测试：
 *   stripe listen --forward-to localhost:3000/api/payment/webhook
 * ============================================================ */
import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * App Router 下 request.text() 直接获得原始 body，无需 bodyParser 配置。
 */

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
      console.error("缺少 Stripe 环境变量配置");
      return NextResponse.json({ error: "服务端配置不完整" }, { status: 501 });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-06-24.dahlia",
    });

    // 读取原始 body
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "缺少 stripe-signature 头" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook 签名验证失败:", err.message);
      return NextResponse.json({ error: "签名验证失败" }, { status: 400 });
    }

    // 处理事件
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const productId = session.metadata?.productId || "未知";
        const amount = session.amount_total ? session.amount_total / 100 : 0;
        const currency = session.currency?.toUpperCase() || "CNY";

        console.log(
          `[PAYMENT SUCCESS] session=${session.id} product=${productId} amount=${amount}${currency}`
        );

        // 将来在此处写入数据库
        // await db.insertOrder({ sessionId: session.id, productId, status: 'paid', ... });

        // 返回给 Stripe 200 确认收到
        return NextResponse.json({ received: true });
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[PAYMENT EXPIRED] session=${session.id}`);
        return NextResponse.json({ received: true });
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.error(`[PAYMENT FAILED] pi=${pi.id} ${pi.last_payment_error?.message}`);
        return NextResponse.json({ received: true });
      }

      default:
        console.log(`[WEBHOOK] 未处理的事件类型: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (err: any) {
    console.error("Webhook 处理异常:", err);
    return NextResponse.json({ error: "内部错误" }, { status: 500 });
  }
}
