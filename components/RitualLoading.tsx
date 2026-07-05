"use client";

import { useEffect, useState } from "react";

const STAGES = ["推演天干地支", "排定四柱命盘", "布算五行生克", "推演大运流年", "生成完整命盘"];

/**
 * 仪式感加载动画
 *
 * 八字/六爻计算时的过渡动画。
 * 显示八卦旋转 + 演算步骤文字。
 */
export default function RitualLoading({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete?: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      setStage(0);
      return;
    }

    setVisible(true);
    setStage(0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStage(i + 1);
          if (i === STAGES.length - 1 && onComplete) {
            setTimeout(onComplete, 600);
          }
        }, (i + 1) * 700)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/92 backdrop-blur-sm">
      <div className="text-center">
        {/* 旋转太极 */}
        <div className="mx-auto mb-8 h-20 w-20">
          <div className="taiji-spin-slow h-full w-full">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <path
                d="M40 1 A39 39 0 0 0 40 79 A19.5 19.5 0 0 0 40 40 A19.5 19.5 0 0 1 40 1 Z"
                fill="rgba(247,241,228,0.8)"
              />
              <path
                d="M40 1 A39 39 0 0 1 40 79 A19.5 19.5 0 0 1 40 40 A19.5 19.5 0 0 0 40 1 Z"
                fill="rgba(16,16,14,0.9)"
              />
              <circle cx="40" cy="21" r="4.5" fill="rgba(16,16,14,0.9)" />
              <circle cx="40" cy="59" r="4.5" fill="rgba(247,241,228,0.8)" />
              <circle
                cx="40" cy="40" r="39"
                fill="none"
                stroke="rgba(201,168,76,0.2)"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>

        {/* 演算步骤 */}
        <div className="space-y-3">
          {STAGES.slice(0, Math.min(stage, STAGES.length)).map((s, i) => (
            <p
              key={i}
              className={`text-sm transition-all duration-500 ${
                i === stage - 1
                  ? "text-gold-400 opacity-100"
                  : "text-rice-100/40 opacity-60"
              }`}
            >
              {i < stage - 1 ? "✓ " : "⟡ "}
              {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
