"use client";

import { useState } from "react";

type Props = {
  originalText: string;
  context?: string;
  type?: "bazi" | "liuyao";
  label?: string;
};

export default function AIEnhanceToggle({ originalText, context, type = "bazi", label }: Props) {
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);

  async function handleEnhance() {
    if (enhanced) {
      setShowEnhanced(!showEnhanced);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enhance-interpretation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalText, context, type })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "请求失败");
      }

      const data = await res.json();
      setEnhanced(data.enhanced);
      setShowEnhanced(true);
    } catch (err: any) {
      alert(err.message || "AI 润色失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Toggle button */}
      <button
        type="button"
        onClick={handleEnhance}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-md border border-brass-300/20 px-3 py-1 text-xs text-rice-100/60 transition hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"
      >
        {loading ? (
          <>⏳ 处理中…</>
        ) : enhanced && showEnhanced ? (
          <>📜 查看原文</>
        ) : enhanced ? (
          <>✨ 查看 AI 润色版</>
        ) : (
          <>✨ AI 润色</>
        )}
      </button>

      {/* Enhanced content */}
      {showEnhanced && enhanced && (
        <div className="rounded-lg border border-gold-400/20 bg-gold-400/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-gold-400">✨ AI 润色</span>
            <span className="text-[10px] text-rice-100/30">语言已优化，判断不变</span>
          </div>
          <p className="text-sm leading-7 text-rice-100/80">{enhanced}</p>
        </div>
      )}
    </div>
  );
}
