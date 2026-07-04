"use client";

import { useState } from "react";

type PaymentMethod = "wechat" | "alipay" | "stripe";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  price?: number;
  description?: string;
};

const QR_CODE_PLACEHOLDER = "/api/payment/qr-placeholder";

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  title = "解锁完整报告",
  price = 9.9,
  description = "一次付费，永久查看"
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"select" | "pay">("select");

  if (!isOpen) return null;

  async function handlePay() {
    setProcessing(true);

    // Stripe 支付 — 调用真实 API
    if (method === "stripe") {
      try {
        const productType = productTypes[title] || "bazi_report";
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productType })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.message || "支付请求失败");
        }

        // 跳转到 Stripe Checkout 页面
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("未返回支付链接");
        }
      } catch (err: any) {
        console.error("支付失败:", err);
        alert(err.message || "支付处理失败，请重试。");
        setProcessing(false);
      }
      return;
    }

    // 微信/支付宝（走 Stripe 统一处理，或单独接入）
    if (method === "wechat" || method === "alipay") {
      try {
        const productType = productTypes[title] || "bazi_report";
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productType,
            paymentMethod: method === "wechat" ? "wechat_pay" : "alipay"
          })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("未返回支付链接");
        }
      } catch (err: any) {
        alert(err.message || "支付处理失败");
        setProcessing(false);
      }
      return;
    }

    // fallback
    setStep("pay");
    setProcessing(false);
  }

  // 根据标题猜测产品类型
  const productTypes: Record<string, string> = {
    "解锁完整报告": "bazi_report",
    "解锁完整详批报告": "full_report",
    "解锁感情深度分析": "bazi_report",
    "解锁财运事业深度分析": "bazi_report",
    "解锁健康深度分析": "bazi_report",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bazi-card mx-4 w-full max-w-md rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brass-300/10 px-6 py-4">
          <h3 className="font-serif text-lg text-rice-50">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-rice-100/40 hover:text-rice-50"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {step === "select" ? (
            <>
              {/* Price */}
              <div className="mb-5 text-center">
                <span className="text-4xl font-bold text-rice-50">¥{price.toFixed(1)}</span>
              </div>

              {/* Payment methods */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMethod("stripe")}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    method === "stripe"
                      ? "border-gold-400/50 bg-gold-400/10"
                      : "border-brass-300/10 bg-ink-850 hover:border-brass-300/20"
                  }`}
                >
                  <span className="text-lg">💳</span>
                  <div>
                    <p className="text-sm text-rice-50">Stripe 支付</p>
                    <p className="text-xs text-rice-100/40">支持 Visa / Mastercard 等国际卡</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("wechat")}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    method === "wechat"
                      ? "border-gold-400/50 bg-gold-400/10"
                      : "border-brass-300/10 bg-ink-850 hover:border-brass-300/20"
                  }`}
                >
                  <span className="text-lg">💚</span>
                  <div>
                    <p className="text-sm text-rice-50">微信支付</p>
                    <p className="text-xs text-rice-100/40">扫码支付，方便快捷</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("alipay")}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    method === "alipay"
                      ? "border-gold-400/50 bg-gold-400/10"
                      : "border-brass-300/10 bg-ink-850 hover:border-brass-300/20"
                  }`}
                >
                  <span className="text-lg">🔵</span>
                  <div>
                    <p className="text-sm text-rice-50">支付宝</p>
                    <p className="text-xs text-rice-100/40">扫码支付，支持花呗</p>
                  </div>
                </button>
              </div>

              {/* Pay button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="mt-5 w-full rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 py-2.5 text-sm font-medium text-ink-950 transition hover:from-gold-400 hover:to-brass-300 disabled:opacity-50"
              >
                {processing ? "处理中…" : `¥${price.toFixed(1)} 立即支付`}
              </button>

              {description && (
                <p className="mt-2 text-center text-xs text-rice-100/30">{description}</p>
              )}
            </>
          ) : (
            /* QR code mockup */
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-lg border border-brass-300/20 bg-ink-800">
                <div className="text-center">
                  <div className="text-4xl opacity-40">◈◈◈</div>
                  <p className="mt-2 text-xs text-rice-100/40">扫码支付区域</p>
                  <p className="text-[10px] text-rice-100/30">支付功能开发中</p>
                </div>
              </div>
              <p className="text-sm text-rice-100/60">请使用{ method === "wechat" ? "微信" : "支付宝"}扫码完成支付</p>
              <button
                type="button"
                onClick={() => setStep("select")}
                className="mt-3 text-xs text-gold-400/70 hover:text-gold-300"
              >
                返回选择支付方式
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
