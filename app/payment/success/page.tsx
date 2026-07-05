import type { Metadata } from "next";
import Stripe from "stripe";
import { PaymentSuccessClient } from "./client";

export const metadata: Metadata = {
  title: "支付成功 | 玄曜阁",
};

export const dynamic = "force-dynamic";

/**
 * 服务端校验：调用 Stripe API 确认 session 支付状态，
 * 并提取 metadata.reportId，不依赖前端跳转判断。
 */
async function verifySession(
  sessionId: string
): Promise<{
  ok: boolean;
  productName?: string;
  reportId?: string;
  amount?: number;
}> {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY 未配置");

    const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        ok: true,
        productName: session.metadata?.productName || "命理报告",
        reportId: session.metadata?.reportId || session.client_reference_id || undefined,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      };
    }

    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let verified = false;
  let productName = "命理报告";
  let reportId: string | undefined;

  if (session_id) {
    const result = await verifySession(session_id);
    verified = result.ok;
    productName = result.productName || productName;
    reportId = result.reportId;
  }

  return (
    <PaymentSuccessClient
      verified={verified}
      productName={productName}
      reportId={reportId}
      sessionId={session_id || ""}
    />
  );
}
