"use client";

import { useEffect, useRef } from "react";

/**
 * 动态太极八卦图
 *
 * 纯 CSS/SVG 实现，无外部依赖。
 * 慢速旋转（16秒一圈），鼠标悬停加速至6秒。
 * 周围环绕8个卦象符号，带微光粒子环。
 * 手机端自动降级（减少粒子，降低旋转精度）。
 */
export default function TaijiBagua({ size = 280 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
  const actualSize = isMobile ? Math.min(size, 200) : size;

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ width: actualSize, height: actualSize }}
    >
      {/* 外层发光环 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* 粒子环 — 纯CSS实现 */}
      <ParticleRing count={isMobile ? 12 : 24} radius={actualSize * 0.48} />

      {/* 卦象环 */}
      <BaguaRing radius={actualSize * 0.38} size={actualSize} />

      {/* 太极主体 */}
      <div
        className="taiji-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: actualSize * 0.52,
          height: actualSize * 0.52,
        }}
      >
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          className="drop-shadow-[0_0_30px_rgba(201,168,76,0.15)]"
        >
          <defs>
            <radialGradient id="taiji-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f7f1e4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f7f1e4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 外圈 — 金线 */}
          <circle
            cx="60" cy="60" r="58"
            fill="none"
            stroke="rgba(201,168,76,0.25)"
            strokeWidth="0.5"
          />

          {/* 太极图 */}
          {/* 左半边（白鱼） */}
          <path
            d="M60 2 A58 58 0 0 0 60 118 A29 29 0 0 0 60 60 A29 29 0 0 1 60 2 Z"
            fill="rgba(247,241,228,0.85)"
          />
          {/* 右半边（黑鱼） */}
          <path
            d="M60 2 A58 58 0 0 1 60 118 A29 29 0 0 1 60 60 A29 29 0 0 0 60 2 Z"
            fill="rgba(16,16,14,0.92)"
          />

          {/* 阴眼（白鱼中的黑点） */}
          <circle cx="60" cy="31" r="7" fill="rgba(16,16,14,0.92)" />
          {/* 阳眼（黑鱼中的白点） */}
          <circle cx="60" cy="89" r="7" fill="rgba(247,241,228,0.85)" />

          {/* 内圈光泽 */}
          <circle
            cx="60" cy="60" r="58"
            fill="none"
            stroke="rgba(201,168,76,0.12)"
            strokeWidth="0.3"
          />
        </svg>
      </div>
    </div>
  );
}

/* ---------- 卦象环 ---------- */

const TRIGRAM_SYMBOLS = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
const TRIGRAM_NAMES = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];

function BaguaRing({ radius, size }: { radius: number; size: number }) {
  const center = size / 2;
  const charSize = Math.max(14, size * 0.055);

  return (
    <div className="absolute inset-0 bagua-ring">
      {TRIGRAM_SYMBOLS.map((symbol, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle) - charSize / 2;
        const y = center + radius * Math.sin(angle) - charSize / 2;

        return (
          <div
            key={i}
            className="absolute transition-all duration-500 hover:opacity-100 hover:scale-110"
            style={{
              left: x,
              top: y,
              width: charSize,
              height: charSize,
              opacity: 0.45 + i * 0.04,
              filter: `drop-shadow(0 0 ${4 + i}px rgba(201,168,76,0.08))`,
            }}
          >
            <svg viewBox="0 0 24 24" width={charSize} height={charSize}>
              <text
                x="12" y="18"
                textAnchor="middle"
                fill={
                  i % 2 === 0
                    ? "rgba(201,168,76,0.6)"
                    : "rgba(247,241,228,0.5)"
                }
                fontSize="18"
                fontFamily="serif"
              >
                {symbol}
              </text>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- 粒子环 ---------- */

function ParticleRing({ count, radius }: { count: number; radius: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = container.querySelectorAll<HTMLSpanElement>(".particle-dot");
    let frameId: number;
    let startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      particles.forEach((dot, i) => {
        const offset = (elapsed * 0.15 + i * (360 / count)) % 360;
        const rad = (offset * Math.PI) / 180;
        const x = radius + radius * 0.12 * Math.cos(rad * 2.3);
        const y = radius + radius * 0.12 * Math.sin(rad * 1.7);
        dot.style.transform = `translate(${x - 1}px, ${y - 1}px)`;
        dot.style.opacity = String(0.2 + 0.3 * (1 + Math.sin(offset * 0.7)));
      });
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [count, radius]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2, margin: "0 auto" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="particle-dot absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            background: i % 3 === 0
              ? "rgba(201,168,76,0.5)"
              : i % 3 === 1
                ? "rgba(247,241,228,0.35)"
                : "rgba(91,140,122,0.3)",
            left: radius - 1,
            top: radius - 1,
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  );
}
