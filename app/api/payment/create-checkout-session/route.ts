/* ============================================================
 * POST /api/payment/create-checkout-session
 *
 * 创建 Stripe Checkout Session，返回支付链接。
 * 客户端收到 url 后直接跳转。
 *
 * 请求体：{ productId, reportId }
 *   - reportId 由前端在用户点击解锁时传入，
 *     对应八字排盘或六爻结果的 id。
 *     写入 client_reference_id 和 metadata，
 *     支付成功页通过 session.metadata.reportId 找回原报告。
 *
 * 环境变量依赖：
 *   STRIPE_SECRET_KEY             必需
 *   STRIPE_PRICE_BAZI_REPORT      八字报告 Price ID
 *   STRIPE_PRICE_LIUYAO_REPORT    六爻报告 Price ID
 *   STRIPE_PRICE_FULL_REPORT      完整套餐 Price ID
 *   NEXT_PUBLIC_SITE_URL          用于 success_url / cancel_url
 * ============================================================ */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct, getStripePriceId, getSiteUrl } from "@/lib/payment";
import type { ProductId } from "@/lib/payment";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          error: "STRIPE_SECRET_KEY 未配置",
          message: "请在 Railway 环境变量中设置 STRIPE_SECRET_KEY。获取方式：Stripe Dashboard → Developers → API Keys → Secret key",
        },
        { status: 501 }
      );
    }

    const body = await request.json();
    const productId: ProductId = body.productId || "bazi_report";
    const reportId: string = body.reportId || "";
    const product = getProduct(productId);
    const priceId = getStripePriceId(productId);

    if (!reportId) {
      return NextResponse.json(
        { error: "缺少 reportId，请重新进入报告页再试" },
        { status: 400 }
      );
    }

    const siteUrl = getSiteUrl();

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-06-24.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "alipay"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: reportId,
      metadata: {
        productId,
        productName: product.name,
        reportId,
      },
      success_url: `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment/cancel`,
      locale: "zh",
    });

    if (!session.url) {
      throw new Error("Stripe 未返回支付链接");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("创建 Checkout Session 失败:", err);
    return NextResponse.json(
      {
        error: "创建支付会话失败",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
