"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 标准先天八卦罗盘 — 动态太极八卦图
 *
 * 结构（由外向内）：
 *   ① 外圈金环 + 60 道罗盘刻度
 *   ② 八卦符号环（先天八卦，圆周均匀分布）
 *   ③ 内圈金环
 *   ④ 中心太极阴阳鱼
 *
 * 所有元素以 SVG viewBox 0 0 500 500 为坐标系，
 * 圆心固定 cx=250, cy=250。
 *
 * 动效：
 *   - 外圈刻度+金环：60s 顺时针旋转
 *   - 中心太极：90s 逆时针旋转
 *   卦象符号始终固定不动、保持水平。
 *
 *  手机端自动缩小尺寸，降低动画强度。
 */

const CX = 250;
const CY = 250;

// 先天八卦：从顶部乾位开始，顺时针 45° 间隔
const TRIGRAMS = [
  { name: "乾", lines: [1, 1, 1], angle: -90 },
  { name: "巽", lines: [1, 1, 0], angle: -45 },
  { name: "坎", lines: [0, 1, 0], angle: 0 },
  { name: "艮", lines: [1, 0, 0], angle: 45 },
  { name: "坤", lines: [0, 0, 0], angle: 90 },
  { name: "震", lines: [0, 0, 1], angle: 135 },
  { name: "离", lines: [1, 0, 1], angle: 180 },
  { name: "兑", lines: [0, 1, 1], angle: 225 },
];

export default function MysticBaguaOrb({ size = 360 }: { size?: number }) {
  const [s, setS] = useState(size);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    setS(isMobile ? Math.min(size, 260) : size);
  }, [size]);

  const outerRef = useRef<SVGGElement>(null);
  const taijiRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let animId: number;
    let start = Date.now();

    function tick() {
      const elapsed = (Date.now() - start) / 1000;
      // 外圈刻度 60s 一圈（可看，不打扰）
      if (outerRef.current) {
        const deg = ((elapsed * 360) / 60) % 360;
        outerRef.current.setAttribute("transform", `rotate(${deg}, ${CX}, ${CY})`);
      }
      // 太极 90s 逆时针
      if (taijiRef.current) {
        const deg = 360 - ((elapsed * 360) / 90) % 360;
        taijiRef.current.setAttribute("transform", `rotate(${deg}, ${CX}, ${CY})`);
      }
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="relative select-none"
      style={{ width: s, height: s }}
    >
      {/* 背景微光 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 55%)`,
          filter: "blur(30px)",
        }}
      />

      <svg
        viewBox="0 0 500 500"
        width={s}
        height={s}
        className="drop-shadow-[0_0_30px_rgba(201,168,76,0.06)]"
      >
        {/* ========== 外圈刻度环（可旋转） ========== */}
        <g ref={outerRef}>
          {/* 外圈金环 */}
          <circle
            cx={CX} cy={CY} r={215}
            fill="none"
            stroke="rgba(201,168,76,0.18)"
            strokeWidth="0.8"
          />

          {/* 60 道刻度 */}
          {Array.from({ length: 60 }).map((_, i) => {
            const rad = ((i * 6 - 90) * Math.PI) / 180;
            const isMajor = i % 5 === 0;
            const rIn = isMajor ? 203 : 210;
            const rOut = 217;
            return (
              <line
                key={i}
                x1={CX + rIn * Math.cos(rad)}
                y1={CY + rIn * Math.sin(rad)}
                x2={CX + rOut * Math.cos(rad)}
                y2={CY + rOut * Math.sin(rad)}
                stroke={
                  isMajor
                    ? "rgba(201,168,76,0.3)"
                    : "rgba(201,168,76,0.08)"
                }
                strokeWidth={isMajor ? 0.8 : 0.3}
              />
            );
          })}

          {/* 弱外圈第二环 */}
          <circle
            cx={CX} cy={CY} r={205}
            fill="none"
            stroke="rgba(201,168,76,0.06)"
            strokeWidth="0.3"
          />
        </g>

        {/* ========== 内圈金环（固定） ========== */}
        <circle
          cx={CX} cy={CY} r={118}
          fill="none"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth="0.5"
        />
        <circle
          cx={CX} cy={CY} r={112}
          fill="none"
          stroke="rgba(201,168,76,0.04)"
          strokeWidth="0.3"
        />

        {/* ========== 八卦符号（固定、水平） ========== */}
        {TRIGRAMS.map((t) => {
          const rad = (t.angle * Math.PI) / 180;
          const x = CX + 168 * Math.cos(rad);
          const y = CY + 168 * Math.sin(rad);
          return <Trigram key={t.name} lines={t.lines} x={x} y={y} />;
        })}

        {/* ========== 中心太极（旋转） ========== */}
        <g ref={taijiRef}>
          {/* 太极外框 */}
          <circle
            cx={CX} cy={CY} r={76}
            fill="none"
            stroke="rgba(201,168,76,0.12)"
            strokeWidth="0.5"
          />

          {/* 白鱼（阳） */}
          <path
            d={`M ${CX},${CY - 76}
                A 38,38 0 0,1 ${CX + 38},${CY}
                A 38,38 0 0,1 ${CX},${CY + 76}
                A 76,76 0 0,0 ${CX},${CY - 76} Z`}
            fill="#f7f1e4"
            opacity="0.85"
          />

          {/* 黑鱼（阴） */}
          <path
            d={`M ${CX},${CY - 76}
                A 76,76 0 0,1 ${CX},${CY + 76}
                A 38,38 0 0,0 ${CX + 38},${CY}
                A 38,38 0 0,0 ${CX},${CY - 76} Z`}
            fill="#1a1915"
            opacity="0.92"
          />

          {/* 阴眼（白鱼中的黑点） */}
          <circle cx={CX} cy={CY - 38} r={7} fill="#1a1915" opacity="0.92" />
          {/* 阳眼（黑鱼中的白点） */}
          <circle cx={CX} cy={CY + 38} r={7} fill="#f7f1e4" opacity="0.85" />

          {/* 太极内圈微光 */}
          <circle
            cx={CX} cy={CY} r={76}
            fill="none"
            stroke="rgba(201,168,76,0.06)"
            strokeWidth="0.3"
          />
        </g>
      </svg>
    </div>
  );
}

/* ---------- 卦象 —— 三条水平线 ---------- */

function Trigram({
  lines,
  x,
  y,
}: {
  lines: number[];
  x: number;
  y: number;
}) {
  const w = 22;    // 每条线的总宽
  const h = 2.5;   // 线高
  const gap = 12;  // 线间距
  const segW = (w - 3) / 2; // 阴爻半段长度

  return (
    <g>
      {lines.map((isYang, i) => {
        const ly = y + (i - 1) * gap;
        if (isYang) {
          return (
            <rect
              key={i}
              x={x - w / 2}
              y={ly - h / 2}
              width={w}
              height={h}
              fill="rgba(201,168,76,0.5)"
              rx={1}
            />
          );
        }
        return (
          <g key={i}>
            <rect
              x={x - w / 2}
              y={ly - h / 2}
              width={segW}
              height={h}
              fill="rgba(247,241,228,0.35)"
              rx={1}
            />
            <rect
              x={x - segW / 2 + 1.5}
              y={ly - h / 2}
              width={segW}
              height={h}
              fill="rgba(247,241,228,0.35)"
              rx={1}
            />
          </g>
        );
      })}
    </g>
  );
}
