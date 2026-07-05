"use client";

import { useState } from "react";
import type { ProductId } from "@/lib/payment";
import { saveReportData } from "@/lib/payment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productId?: ProductId;
  reportId?: string;
  title?: string;
  price?: number;
  description?: string;
};

export default function PaymentModal({
  isOpen,
  onClose,
  productId = "bazi_report",
  reportId,
  title = "解锁完整报告",
  price = 9.9,
  description = "一次付费，永久查看",
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handlePay() {
    if (!reportId) {
      setError("缺少报告 ID，请重新进入报告页再试");
      return;
    }

    setProcessing(true);
    setError("");

    // 支付前把当前报告数据持久化到 localStorage
    try {
      const raw = sessionStorage.getItem("baziResult") || sessionStorage.getItem("xuanyao-current-result");
      if (raw) {
        saveReportData(reportId, JSON.parse(raw));
      }
    } catch (e) {
      console.error("保存报告数据失败:", e);
    }

    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, reportId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "支付请求失败");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("未返回支付链接");
      }
    } catch (err: any) {
      console.error("支付失败:", err);
      setError(err.message || "支付处理失败，请稍后重试。");
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bazi-card mx-4 w-full max-w-sm rounded-xl">
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
          {/* Price */}
          <div className="mb-5 text-center">
            <span className="text-4xl font-bold text-rice-50">¥{price.toFixed(1)}</span>
            <p className="mt-1 text-sm text-rice-100/50">{description}</p>
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="w-full rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 py-2.5 text-sm font-medium text-ink-950 transition hover:from-gold-400 hover:to-brass-300 disabled:opacity-50"
          >
            {processing ? "正在跳转支付页面…" : `¥${price.toFixed(1)} Stripe 支付`}
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-3 rounded-md border border-cinnabar-400/30 bg-cinnabar-400/10 px-3 py-2 text-xs text-cinnabar-400">
              {error}
            </div>
          )}

          <p className="mt-3 text-center text-xs text-rice-100/30">
            支付由 Stripe 安全处理。支持 Visa、Mastercard、支付宝。
          </p>
        </div>
      </div>
    </div>
  );
}
