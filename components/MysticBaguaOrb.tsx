"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 九层金线罗盘 · 先天八卦图
 *
 * 基于参考图重构 — 多层同心金环结构，非单一圆盘。
 *
 * 结构由外向内（SVG 坐标系 500×500，cx=250, cy=250）：
 *   ⑨ 最外粗金环 (r=245)
 *   ⑧ 星轨点阵环 (r=235) — 48 个星点绕行
 *   ⑦ 金线三角纹环 (r=215-225) — 72 道斜线
 *   ⑥ 八卦符号环 (r=195) — 先天八卦，水平不倾斜
 *   ⑤ 宽幅暗金环 (r=128-175) — 带云纹肌理
 *   ④ 细金环 (r=115)
 *   ③ 金字环 (r=95-108) — 密集刻度
 *   ② 内圈金环 (r=78)
 *   ① 中心太极 (r=72)
 *
 * 动效：
 *   - 外层星轨：40s 顺时针
 *   - 金线三角纹：60s 逆时针
 *   - 中心太极：80s 逆时针
 *   卦象始终固定水平。
 */

const CX = 250;
const CY = 250;
const R = 250;

// 先天八卦：从顶部乾位起，顺时针 45°
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

export default function MysticBaguaOrb({ size = 380 }: { size?: number }) {
  const [s, setS] = useState(size);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    setS(isMobile ? Math.min(size, 280) : size);
  }, [size]);

  const outerBandRef = useRef<SVGGElement>(null);
  const starBandRef = useRef<SVGGElement>(null);
  const taijiRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let animId: number;
    let start = Date.now();

    function tick() {
      const t = (Date.now() - start) / 1000;

      if (outerBandRef.current) {
        const deg = ((t * 360) / 40) % 360;
        outerBandRef.current.setAttribute("transform", `rotate(${deg}, ${CX}, ${CY})`);
      }
      if (starBandRef.current) {
        const deg = 360 - ((t * 360) / 60) % 360;
        starBandRef.current.setAttribute("transform", `rotate(${deg}, ${CX}, ${CY})`);
      }
      if (taijiRef.current) {
        const deg = 360 - ((t * 360) / 80) % 360;
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
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 50%)`,
          filter: "blur(40px)",
        }}
      />

      <svg
        viewBox="0 0 500 500"
        width={s}
        height={s}
        className="drop-shadow-[0_0_40px_rgba(201,168,76,0.05)]"
      >
        {/* ========== ⑨ 最外粗金环 ========== */}
        <circle
          cx={CX} cy={CY} r={245}
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="1.5"
        />

        {/* ========== ⑧ 星轨点阵环（旋转） ========== */}
        <g ref={outerBandRef}>
          <circle
            cx={CX} cy={CY} r={235}
            fill="none"
            stroke="rgba(201,168,76,0.04)"
            strokeWidth="0.3"
          />
          {Array.from({ length: 48 }).map((_, i) => {
            const rad = ((i * 7.5) * Math.PI) / 180;
            const rDot = 235;
            const size = i % 4 === 0 ? 1.8 : 1;
            return (
              <circle
                key={i}
                cx={CX + rDot * Math.cos(rad)}
                cy={CY + rDot * Math.sin(rad)}
                r={size}
                fill={
                  i % 8 === 0
                    ? "rgba(201,168,76,0.4)"
                    : i % 4 === 0
                      ? "rgba(247,241,228,0.25)"
                      : "rgba(201,168,76,0.1)"
                }
              />
            );
          })}
        </g>

        {/* ========== ⑦ 金线三角纹环（反向旋转） ========== */}
        <g ref={starBandRef}>
          {/* 环线 */}
          <circle
            cx={CX} cy={CY} r={225}
            fill="none"
            stroke="rgba(201,168,76,0.08)"
            strokeWidth="0.3"
          />
          <circle
            cx={CX} cy={CY} r={215}
            fill="none"
            stroke="rgba(201,168,76,0.08)"
            strokeWidth="0.3"
          />
          {/* 72 道斜线 */}
          {Array.from({ length: 72 }).map((_, i) => {
            const innerR = 215;
            const outerR = 225;
            const rad = ((i * 5) * Math.PI) / 180;
            const offsetRad = ((i * 5 + 2) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={CX + innerR * Math.cos(rad)}
                y1={CY + innerR * Math.sin(rad)}
                x2={CX + outerR * Math.cos(offsetRad)}
                y2={CY + outerR * Math.sin(offsetRad)}
                stroke="rgba(201,168,76,0.06)"
                strokeWidth="0.3"
              />
            );
          })}
          {/* 第二层交叉线 */}
          {Array.from({ length: 36 }).map((_, i) => {
            const rad = ((i * 10 + 3) * Math.PI) / 180;
            return (
              <line
                key={`x${i}`}
                x1={CX + 218 * Math.cos(rad)}
                y1={CY + 218 * Math.sin(rad)}
                x2={CX + 222 * Math.cos(rad + 0.3)}
                y2={CY + 222 * Math.sin(rad + 0.3)}
                stroke="rgba(201,168,76,0.04)"
                strokeWidth="0.3"
              />
            );
          })}
        </g>

        {/* ========== ⑥ 八卦符号环（固定） ========== */}
        {/* 环线 */}
        <circle
          cx={CX} cy={CY} r={208}
          fill="none"
          stroke="rgba(201,168,76,0.06)"
          strokeWidth="0.3"
        />
        <circle
          cx={CX} cy={CY} r={183}
          fill="none"
          stroke="rgba(201,168,76,0.06)"
          strokeWidth="0.3"
        />
        {/* 八方向定位标记 */}
        {TRIGRAMS.map((t) => {
          const rad = (t.angle * Math.PI) / 180;
          const rIn = 183;
          const rOut = 208;
          return (
            <line
              key={t.name}
              x1={CX + rIn * Math.cos(rad)}
              y1={CY + rIn * Math.sin(rad)}
              x2={CX + rOut * Math.cos(rad)}
              y2={CY + rOut * Math.sin(rad)}
              stroke="rgba(201,168,76,0.2)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* 八符号 */}
        {TRIGRAMS.map((t) => {
          const rad = (t.angle * Math.PI) / 180;
          const x = CX + 195 * Math.cos(rad);
          const y = CY + 195 * Math.sin(rad);
          return <Trigram key={t.name} lines={t.lines} x={x} y={y} />;
        })}

        {/* ========== ⑤ 宽幅暗金环（云纹肌理） ========== */}
        <circle
          cx={CX} cy={CY} r={175}
          fill="none"
          stroke="rgba(201,168,76,0.1)"
          strokeWidth="0.5"
        />
        <circle
          cx={CX} cy={CY} r={128}
          fill="none"
          stroke="rgba(201,168,76,0.1)"
          strokeWidth="0.5"
        />
        {/* 肌理网格 */}
        {Array.from({ length: 48 }).map((_, i) => {
          const innerR = 132;
          const outerR = 172;
          const rad = ((i * 7.5) * Math.PI) / 180;
          return (
            <line
              key={`w${i}`}
              x1={CX + innerR * Math.cos(rad)}
              y1={CY + innerR * Math.sin(rad)}
              x2={CX + outerR * Math.cos(rad)}
              y2={CY + outerR * Math.sin(rad)}
              stroke="rgba(201,168,76,0.03)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* 装饰原点 */}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={`d${i}`}
            cx={CX + 150 * Math.cos(((i * 15) * Math.PI) / 180)}
            cy={CY + 150 * Math.sin(((i * 15) * Math.PI) / 180)}
            r={1}
            fill="rgba(201,168,76,0.08)"
          />
        ))}

        {/* ========== ④ 细金环 ========== */}
        <circle
          cx={CX} cy={CY} r={115}
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="0.4"
        />

        {/* ========== ③ 金字环（密集刻度） ========== */}
        <circle
          cx={CX} cy={CY} r={108}
          fill="none"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth="0.3"
        />
        <circle
          cx={CX} cy={CY} r={95}
          fill="none"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth="0.3"
        />
        {/* 36 道金短线 */}
        {Array.from({ length: 36 }).map((_, i) => {
          const innerR = 96;
          const outerR = 107;
          const rad = ((i * 10) * Math.PI) / 180;
          return (
            <line
              key={`g${i}`}
              x1={CX + innerR * Math.cos(rad)}
              y1={CY + innerR * Math.sin(rad)}
              x2={CX + outerR * Math.cos(rad)}
              y2={CY + outerR * Math.sin(rad)}
              stroke={
                i % 3 === 0
                  ? "rgba(201,168,76,0.25)"
                  : "rgba(201,168,76,0.08)"
              }
              strokeWidth={i % 3 === 0 ? 0.7 : 0.3}
            />
          );
        })}

        {/* ========== ② 内圈金环 ========== */}
        <circle
          cx={CX} cy={CY} r={78}
          fill="none"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.5"
        />
        <circle
          cx={CX} cy={CY} r={74}
          fill="none"
          stroke="rgba(201,168,76,0.06)"
          strokeWidth="0.3"
        />

        {/* ========== ① 中心太极（旋转） ========== */}
        <g ref={taijiRef}>
          {/* 太极外框 */}
          <circle
            cx={CX} cy={CY} r={72}
            fill="none"
            stroke="rgba(201,168,76,0.15)"
            strokeWidth="0.5"
          />

          {/* S 形太极 — 白鱼（阳） */}
          <path
            d={`M ${CX},${CY - 72}
                A 36,36 0 0,1 ${CX + 36},${CY}
                A 36,36 0 0,1 ${CX},${CY + 72}
                A 72,72 0 0,0 ${CX},${CY - 72} Z`}
            fill="#f7f1e4"
            opacity="0.78"
          />

          {/* 黑鱼（阴） */}
          <path
            d={`M ${CX},${CY - 72}
                A 72,72 0 0,1 ${CX},${CY + 72}
                A 36,36 0 0,0 ${CX + 36},${CY}
                A 36,36 0 0,0 ${CX},${CY - 72} Z`}
            fill="#1c1b17"
            opacity="0.9"
          />

          {/* 阴眼（白鱼黑点） */}
          <circle cx={CX} cy={CY - 36} r={6.5} fill="#1c1b17" opacity="0.9" />
          {/* 阳眼（黑鱼白点） */}
          <circle cx={CX} cy={CY + 36} r={6.5} fill="#f7f1e4" opacity="0.75" />

          {/* 太极外围微光 */}
          <circle
            cx={CX} cy={CY} r={72}
            fill="none"
            stroke="rgba(201,168,76,0.06)"
            strokeWidth="0.3"
          />
        </g>
      </svg>
    </div>
  );
}

/* ========== 卦象绘制（三条水平线，永不倾斜） ========== */

function Trigram({
  lines,
  x,
  y,
}: {
  lines: number[];
  x: number;
  y: number;
}) {
  const w = 20;
  const h = 2.2;
  const gap = 10;
  const seg = (w - 2.5) / 2;

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
              fill="rgba(201,168,76,0.45)"
              rx={1}
            />
          );
        }
        return (
          <g key={i}>
            <rect
              x={x - w / 2}
              y={ly - h / 2}
              width={seg}
              height={h}
              fill="rgba(247,241,228,0.28)"
              rx={1}
            />
            <rect
              x={x - seg / 2 + 1.2}
              y={ly - h / 2}
              width={seg}
              height={h}
              fill="rgba(247,241,228,0.28)"
              rx={1}
            />
          </g>
        );
      })}
    </g>
  );
}
