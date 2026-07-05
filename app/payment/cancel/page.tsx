import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "支付取消 | 玄曜阁",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brass-300/20">
        <span className="text-3xl text-rice-100/50">←</span>
      </div>
      <h1 className="font-serif text-3xl text-rice-50">支付已取消</h1>
      <p className="mt-3 text-sm leading-7 text-rice-100/70">
        您没有完成支付，报告仍处于锁定状态。如有任何疑问，可随时重新尝试。
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/bazi/result"
          className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
        >
          返回报告页
        </Link>
        <Link
          href="/bazi"
          className="rounded-lg border border-brass-300/20 px-6 py-2.5 text-sm text-rice-100/70 hover:text-rice-50"
        >
          重新排盘
        </Link>
      </div>
    </div>
  );
}
