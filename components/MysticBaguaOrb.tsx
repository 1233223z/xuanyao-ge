"use client";

import { useRef } from "react";

/**
 * 高级东方命理罗盘 — 动态八卦图
 *
 * 结构（由内向外）：
 *   1. 中心太极（暖白象牙色 + 暗金黑，直径占比 35%）
 *   2. 内圈金环（细线）
 *   3. 八符环：八个卦象符号均匀分布在圆周上
 *   4. 刻度外圈：60 道细刻度线，像罗盘
 *   5. 外圈细金环
 *
 * 动效：
 *   - 外圈八卦盘：40s 顺时针旋转
 *   - 中心太极：80s 逆时针（视觉上保持稳定）
 *   - 金线呼吸光效
 *   - Hover：scale 1.02 + 金色光晕增强
 *   手机端自动降级
 */
export default function MysticBaguaOrb({ size = 360 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
  const s = isMobile ? Math.min(size, 240) : size;
  const cx = s / 2;
  const cy = s / 2;

  // 太极直径
  const taijiR = s * 0.175;
  // 八符环半径
  const symbolR = s * 0.38;
  // 刻度外圈半径
  const tickR = s * 0.46;
  // 外圈半径
  const outerR = s * 0.49;

  const trigrams = [
    { symbol: "☰", name: "乾", angle: 0 },
    { symbol: "☱", name: "兑", angle: 45 },
    { symbol: "☲", name: "离", angle: 90 },
    { symbol: "☳", name: "震", angle: 135 },
    { symbol: "☴", name: "巽", angle: 180 },
    { symbol: "☵", name: "坎", angle: 225 },
    { symbol: "☶", name: "艮", angle: 270 },
    { symbol: "☷", name: "坤", angle: 315 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ width: s, height: s }}
    >
      {/* 背景微光晕 — 罗盘光晕 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />

      {/* 旋转外圈（八卦盘整体） */}
      <div className="absolute inset-0 bagua-outer-spin">
        <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="drop-shadow-[0_0_40px_rgba(201,168,76,0.08)]">
          <defs>
            {/* 外圈呼吸发光滤镜 */}
            <filter id="bagua-glow-outer">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* === 最外圈金环 === */}
          <circle
            cx={cx} cy={cy} r={outerR}
            fill="none"
            stroke="rgba(201,168,76,0.18)"
            strokeWidth="0.8"
            filter="url(#bagua-glow-outer)"
            className="bagua-outer-glow"
          />

          {/* === 刻度圈：60 道细刻度 === */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const innerR = i % 5 === 0 ? tickR - s * 0.025 : tickR - s * 0.012;
            const outerR2 = i % 5 === 0 ? tickR + s * 0.008 : tickR + s * 0.004;
            return (
              <line
                key={i}
                x1={cx + innerR * Math.cos(angle)}
                y1={cy + innerR * Math.sin(angle)}
                x2={cx + outerR2 * Math.cos(angle)}
                y2={cy + outerR2 * Math.sin(angle)}
                stroke={
                  i % 5 === 0
                    ? "rgba(201,168,76,0.3)"
                    : "rgba(201,168,76,0.12)"
                }
                strokeWidth={i % 5 === 0 ? 0.8 : 0.3}
              />
            );
          })}

          {/* === 八符号环 === */}
          {trigrams.map((t) => {
            const rad = (t.angle - 90) * (Math.PI / 180);
            const x = cx + symbolR * Math.cos(rad);
            const y = cy + symbolR * Math.sin(rad);
            const fontSize = s * 0.045;

            return (
              <g key={t.name}>
                {/* 符号 */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={
                    t.name === "乾" || t.name === "离" || t.name === "震" || t.name === "艮"
                      ? "rgba(201,168,76,0.55)"
                      : "rgba(247,241,228,0.4)"
                  }
                  fontSize={fontSize}
                  fontFamily="serif"
                  className="bagua-symbol"
                >
                  {t.symbol}
                </text>
                {/* 名称（小字标注） */}
                <text
                  x={x}
                  y={y + fontSize * 0.7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(201,168,76,0.2)"
                  fontSize={fontSize * 0.38}
                  fontFamily="sans-serif"
                >
                  {t.name}
                </text>
              </g>
            );
          })}

          {/* === 内圈金环 === */}
          <circle
            cx={cx} cy={cy} r={taijiR * 1.6}
            fill="none"
            stroke="rgba(201,168,76,0.12)"
            strokeWidth="0.5"
          />

          {/* === 内圈第二环 === */}
          <circle
            cx={cx} cy={cy} r={taijiR * 1.3}
            fill="none"
            stroke="rgba(201,168,76,0.06)"
            strokeWidth="0.3"
          />
        </svg>

        {/* === 中心太极（独立反方向旋转） === */}
        <div
          className="absolute taiji-inner-spin"
          style={{
            width: taijiR * 2,
            height: taijiR * 2,
            left: cx - taijiR,
            top: cy - taijiR,
          }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <radialGradient id="taiji-bg-light" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f7f1e4" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#e8ddc8" stopOpacity="0.82" />
              </radialGradient>
              <radialGradient id="taiji-bg-dark" cx="60%" cy="60%" r="60%">
                <stop offset="0%" stopColor="#2a2822" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#181714" stopOpacity="0.92" />
              </radialGradient>
            </defs>

            {/* 太极外圈 */}
            <circle
              cx="50" cy="50" r="49"
              fill="none"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="0.5"
            />

            {/* 白鱼 */}
            <path
              d="M50 1 A49 49 0 0 0 50 99 A24.5 24.5 0 0 0 50 50 A24.5 24.5 0 0 1 50 1 Z"
              fill="url(#taiji-bg-light)"
            />
            {/* 黑鱼 */}
            <path
              d="M50 1 A49 49 0 0 1 50 99 A24.5 24.5 0 0 1 50 50 A24.5 24.5 0 0 0 50 1 Z"
              fill="url(#taiji-bg-dark)"
            />

            {/* 阴眼（白鱼中的黑点） */}
            <circle cx="50" cy="25.5" r="6" fill="rgba(24,23,20,0.9)" />
            {/* 阳眼（黑鱼中的白点） */}
            <circle cx="50" cy="74.5" r="6" fill="rgba(247,241,228,0.85)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
