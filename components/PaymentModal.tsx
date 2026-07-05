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

    // 支付前保存报告数据
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bazi-card mx-4 w-full max-w-sm rounded-xl overflow-hidden">
        {/* 顶部装饰 */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        <div className="px-6 pt-6 pb-5">
          {/* 锁图标 + 标题 */}
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5">
              <span className="text-lg text-gold-300/80">⟡</span>
            </div>
            <h3 className="font-serif text-lg text-rice-50">{title}</h3>
            <p className="mt-1 text-sm text-rice-100/50">{description}</p>
          </div>

          {/* 价格 */}
          <div className="text-center mb-5">
            <span className="text-4xl font-light text-rice-50">
              <span className="text-lg text-rice-100/40 align-top">¥</span>
              {price.toFixed(1)}
            </span>
          </div>

          {/* 权益列表 */}
          <div className="mb-5 bazi-card rounded-lg px-4 py-3 space-y-2">
            {[
              "事业 · 财运 · 感情 · 健康完整分析",
              "大运时间轴 · 流年趋势详解",
              "一次付费，永久查看",
              "新功能持续更新",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <span className="text-gold-400/60 mt-0.5">✦</span>
                <span className="text-rice-100/60">{item}</span>
              </div>
            ))}
          </div>

          {/* 安全提示 */}
          <div className="mb-4 flex items-center gap-2 justify-center text-[10px] text-rice-100/30">
            <span>🔒</span>
            <span>支付由 Stripe 安全处理</span>
            <span className="w-1 h-1 rounded-full bg-rice-100/20" />
            <span>支持 Visa / 支付宝</span>
          </div>

          {/* 支付按钮 */}
          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="w-full rounded-lg bg-gradient-to-r from-gold-400/90 to-brass-300/70 py-2.5 text-sm font-medium text-ink-950 transition-all hover:from-gold-400 hover:to-brass-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] disabled:opacity-50"
          >
            {processing ? "正在跳转支付页面…" : `确认支付 ¥${price.toFixed(1)}`}
          </button>

          {/* 错误提示 */}
          {error && (
            <div className="mt-3 rounded-md border border-cinnabar-400/25 bg-cinnabar-400/8 px-3 py-2 text-xs text-cinnabar-400/80">
              {error}
            </div>
          )}
        </div>

        {/* 底部关闭 */}
        <button
          type="button"
          onClick={onClose}
          className="w-full border-t border-brass-300/8 py-2.5 text-xs text-rice-100/30 hover:text-rice-100/60 transition-colors"
        >
          稍后再说
        </button>
      </div>
    </div>
  );
}
