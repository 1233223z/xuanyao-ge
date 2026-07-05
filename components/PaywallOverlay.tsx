"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";
import type { ProductId } from "@/lib/payment";

type Props = {
  price?: number;
  title?: string;
  features?: string[];
  productId?: ProductId;
};

export default function PaywallOverlay({
  price = 9.9,
  title = "解锁完整报告",
  features,
  productId = "bazi_report",
}: Props) {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <div className="bazi-card rounded-xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/10 text-2xl">
          🔒
        </div>
        <h3 className="font-serif text-lg text-rice-50">{title}</h3>
        <p className="mt-2 text-sm text-rice-100/60">
          深度分析内容需付费解锁
        </p>

        {features && features.length > 0 && (
          <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left text-sm text-rice-100/70">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-gold-400">✦</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setShowPayment(true)}
          className="mt-5 w-full max-w-xs rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 py-2.5 text-sm font-medium text-ink-950 transition hover:from-gold-400 hover:to-brass-300"
        >
          ¥{price.toFixed(1)} 立即解锁
        </button>
        <p className="mt-2 text-xs text-rice-100/30">一次付费，永久查看</p>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        productId={productId}
        title={title}
        price={price}
      />
    </>
  );
}
