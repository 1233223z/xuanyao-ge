"use client";

import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  tag?: string;
  children: ReactNode;
  className?: string;
  locked?: boolean;
  onUnlock?: () => void;
  price?: number;
};

export default function ReportSection({
  title,
  tag,
  children,
  className = "",
  locked,
  price
}: SectionProps) {
  return (
    <div className={`report-section ${className}`}>
      <div className="flex items-center gap-2">
        {title && (
          <h3 className="text-base font-medium text-rice-50">{title}</h3>
        )}
        {tag && (
          <span className="rounded border border-brass-300/20 px-2 py-0.5 text-[11px] text-brass-300">
            {tag}
          </span>
        )}
      </div>

      <div className={`text-sm leading-7 text-rice-100/80 ${locked ? "paywall-blur max-h-32" : ""}`}>
        {children}
      </div>

      {locked && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-gold-400/20 bg-gold-400/5 px-4 py-3">
          <div>
            <p className="text-sm text-gold-300">🔒 解锁完整内容</p>
            {price && price > 0 && (
              <p className="mt-0.5 text-xs text-rice-100/50">¥{price.toFixed(1)} 解锁本模块</p>
            )}
          </div>
          <button
            type="button"
            className="rounded-md bg-gradient-to-r from-gold-400/80 to-brass-300/60 px-4 py-1.5 text-xs font-medium text-ink-950 hover:from-gold-400 hover:to-brass-300"
          >
            解锁
          </button>
        </div>
      )}
    </div>
  );
}
