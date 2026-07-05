import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "支付成功 | 玄曜阁",
};

export const dynamic = "force-dynamic";

/**
 * 后端校验：调用 Stripe API 确认 session 的支付状态，
 * 不依赖前端跳转来判断。
 */
async function verifySession(
  sessionId: string
): Promise<{ ok: boolean; productName?: string; amount?: number }> {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY 未配置");

    const stripe = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        ok: true,
        productName: session.metadata?.productName || "命理报告",
        amount: session.amount_total ? session.amount_total / 100 : 0,
      };
    }

    // 未支付成功 — 可能是用户手动跳到这个页面的
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

  if (session_id) {
    const result = await verifySession(session_id);
    verified = result.ok;
    productName = result.productName || productName;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      {verified ? (
        <>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-jade-400/15">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-serif text-3xl text-rice-50">支付成功</h1>
          <p className="mt-3 text-sm leading-7 text-rice-100/70">
            您已成功购买「{productName}」。完整报告已解锁，可随时查看。
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/bazi/result"
              className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
            >
              查看我的报告
            </Link>
            <Link
              href="/history"
              className="rounded-lg border border-brass-300/20 px-6 py-2.5 text-sm text-rice-100/70 hover:text-rice-50"
            >
              历史记录
            </Link>
          </div>

          <p className="mt-6 text-xs text-rice-100/30">订单编号：{session_id}</p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/10">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="font-serif text-3xl text-rice-50">支付验证中</h1>
          <p className="mt-3 text-sm leading-7 text-rice-100/70">
            如果已支付成功，报告将在几秒后自动解锁。如果遇到问题，请联系客服并提供订单号。
          </p>
          <p className="mt-4 text-xs text-rice-100/40">订单编号：{session_id || "无"}</p>
          <Link
            href="/bazi"
            className="mt-6 inline-block text-sm text-gold-400/70 hover:text-gold-300"
          >
            返回首页
          </Link>
        </>
      )}

      {/* 客户端脚本：标记解锁 */}
      {verified && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var unlocked = JSON.parse(localStorage.getItem('xuanyao-unlocked-products') || '[]');
                if (!unlocked.includes('bazi_report')) unlocked.push('bazi_report');
                localStorage.setItem('xuanyao-unlocked-products', JSON.stringify(unlocked));

                var orders = JSON.parse(localStorage.getItem('xuanyao-orders') || '[]');
                var idx = orders.findIndex(function(o) { return o.sessionId === '${session_id}'; });
                if (idx >= 0) orders[idx].status = 'paid';
                else orders.push({ sessionId: '${session_id}', productId: 'bazi_report', status: 'paid', amountCNY: ${verified ? "0" : "0"}, createdAt: new Date().toISOString(), paidAt: new Date().toISOString() });
                localStorage.setItem('xuanyao-orders', JSON.stringify(orders));
              } catch(e) {}
            `,
          }}
        />
      )}
    </div>
  );
}
