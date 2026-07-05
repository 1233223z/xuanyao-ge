"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReportData, isReportPaid, markReportPaid, markProductUnlocked, saveLocalOrder } from "@/lib/payment";

type Props = {
  verified: boolean;
  productName: string;
  reportId?: string;
  sessionId: string;
};

export function PaymentSuccessClient({ verified, productName, reportId, sessionId }: Props) {
  const [reportName, setReportName] = useState("");
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (!verified || !reportId) return;

    // 标记产品为已解锁
    markProductUnlocked("bazi_report");
    markProductUnlocked("full_report");
    markReportPaid(reportId);

    // 保存订单
    saveLocalOrder({
      sessionId,
      productId: "bazi_report",
      status: "paid",
      amountCNY: 0,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });

    // 尝试从 localStorage 找报告数据
    const data = getReportData(reportId);
    if (data) {
      const name = (data as any).name || (data as any).title || "";
      setReportName(name);
      setFound(true);
    } else {
      // 可能数据已被清理，尝试从 sessionStorage 找
      try {
        const sessionRaw = sessionStorage.getItem("baziResult");
        if (sessionRaw) {
          const sessionData = JSON.parse(sessionRaw);
          if (sessionData.id === reportId) {
            setReportName(sessionData.name || "");
            setFound(true);
          }
        }
      } catch {}
    }
  }, [verified, reportId, sessionId]);

  if (!verified) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/10">
          <span className="text-3xl">⏳</span>
        </div>
        <h1 className="font-serif text-3xl text-rice-50">支付验证中</h1>
        <p className="mt-3 text-sm leading-7 text-rice-100/70">
          如果已支付成功，报告将在几秒后自动解锁。如果遇到问题，请联系客服并提供订单号。
        </p>
        <p className="mt-4 text-xs text-rice-100/40">订单编号：{sessionId || "无"}</p>
        <Link
          href="/history"
          className="mt-6 inline-block text-sm text-gold-400/70 hover:text-gold-300"
        >
          查看历史记录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-jade-400/15">
        <span className="text-4xl">✓</span>
      </div>
      <h1 className="font-serif text-3xl text-rice-50">支付成功</h1>
      <p className="mt-3 text-sm leading-7 text-rice-100/70">
        您已成功购买「{productName}」。完整报告已解锁，可随时查看。
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {found && reportId ? (
          <Link
            href={`/bazi/result?id=${reportId}&paid=true`}
            className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
          >
            查看{reportName || "我的"}报告
          </Link>
        ) : reportId ? (
          <Link
            href={`/bazi/result?id=${reportId}&paid=true`}
            className="rounded-lg bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-6 py-2.5 text-sm font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
          >
            查看报告
          </Link>
        ) : (
          <p className="text-sm text-rice-100/50">
            未找到原报告，请返回历史记录查看。
          </p>
        )}
        <Link
          href="/history"
          className="rounded-lg border border-brass-300/20 px-6 py-2.5 text-sm text-rice-100/70 hover:text-rice-50"
        >
          历史记录
        </Link>
      </div>

      {!found && reportId && (
        <p className="mt-4 text-xs text-rice-100/40">
          报告数据已保存，可在历史记录中查看。
        </p>
      )}

      {!found && !reportId && (
        <p className="mt-4 text-xs text-rice-100/40">
          未找到原报告，请返回历史记录查看。
          <br />
          <Link href="/history" className="text-gold-400/70 hover:text-gold-300">
            前往历史记录 →
          </Link>
        </p>
      )}

      <p className="mt-6 text-xs text-rice-100/30">订单编号：{sessionId}</p>
    </div>
  );
}
