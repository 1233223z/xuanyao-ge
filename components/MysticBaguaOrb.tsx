"use client";

/* ============================================================
 * 标准先天八卦罗盘
 *
 * viewBox 0 0 500 500 | cx=250 cy=250
 *
 * 结构：
 *   ⑤ 外圈金环 r=230
 *   ④ 八符号环（圆周 r=185，先天八卦，水平不倾斜）
 *   ③ 中层刻度环 r=95-108
 *   ② 内圈金环 r=82
 *   ① 中心标准太极 r=72
 *
 * 太极绘制方案（大圆+右半+两个小圆覆盖法）：
 *   1. 整圆 (r=72)：浅色底
 *   2. 右半圆：深色底
 *   3. 上方小圆 (r=36, cy=214)：浅色 — 白鱼头部
 *   4. 下方小圆 (r=36, cy=286)：深色 — 黑鱼头部
 *   5. 鱼眼
 *
 * 这个方法100%可重现标准太极 S 形阴阳鱼。
 * ============================================================ */

const CX = 250;
const CY = 250;
const BIG = 72;
const SMALL = 36;

const TRIGRAMS = [
  { bits: [1, 1, 1], angle: -90 },  // 乾
  { bits: [1, 1, 0], angle: -45 },  // 巽
  { bits: [0, 1, 0], angle: 0 },    // 坎
  { bits: [1, 0, 0], angle: 45 },   // 艮
  { bits: [0, 0, 0], angle: 90 },   // 坤
  { bits: [0, 0, 1], angle: 135 },  // 震
  { bits: [1, 0, 1], angle: 180 },  // 离
  { bits: [0, 1, 1], angle: 225 },  // 兑
];

export default function MysticBaguaOrb({ size = 420 }: { size?: number }) {
  const s = size;

  return (
    <div className="relative select-none" style={{ width: s, height: s }}>
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.04), transparent 55%)",
          filter: "blur(40px)",
        }}
      />

      <svg viewBox="0 0 500 500" width={s} height={s}>

        {/* ===== ⑤ 外圈金环 r=230 ===== */}
        <circle cx={CX} cy={CY} r={230} fill="none" stroke="rgba(201,168,76,0.22)" strokeWidth="1.2" />

        {/* ===== ④ 八卦符号环 ===== */}
        {/* 环线装饰 */}
        <circle cx={CX} cy={CY} r={205} fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="0.3" />
        <circle cx={CX} cy={CY} r={168} fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="0.3" />
        {/* 符号 */}
        {TRIGRAMS.map((t) => {
          const rad = (t.angle * Math.PI) / 180;
          const x = CX + 186 * Math.cos(rad);
          const y = CY + 186 * Math.sin(rad);
          return <Trigram key={t.angle} bits={t.bits} x={x} y={y} />;
        })}

        {/* ===== ③ 中层刻度环 r=95-108 ===== */}
        <circle cx={CX} cy={CY} r={108} fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={95} fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="0.3" />
        {Array.from({ length: 36 }).map((_, i) => {
          const rad = ((i * 10) * Math.PI) / 180;
          const len = i % 3 === 0 ? 10 : 5;
          return (
            <line
              key={i}
              x1={CX + 108 * Math.cos(rad)}
              y1={CY + 108 * Math.sin(rad)}
              x2={CX + (108 - len) * Math.cos(rad)}
              y2={CY + (108 - len) * Math.sin(rad)}
              stroke={i % 3 === 0 ? "rgba(201,168,76,0.18)" : "rgba(201,168,76,0.06)"}
              strokeWidth={i % 3 === 0 ? 0.6 : 0.3}
            />
          );
        })}

        {/* ===== ② 内圈金环 r=82 ===== */}
        <circle cx={CX} cy={CY} r={82} fill="none" stroke="rgba(201,168,76,0.13)" strokeWidth="0.5" />

        {/* ===== ① 中心标准太极 r=72 ===== */}

        {/* 0. 太极外圈 */}
        <circle cx={CX} cy={CY} r={72} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5" />

        {/* 1. 整圆底 — 浅色（白鱼底） */}
        <circle cx={CX} cy={CY} r={72} fill="#f0e8d8" />

        {/* 2. 右半圆 — 深色（黑鱼底） */}
        <path d="M 250 178 A 72 72 0 0 1 250 322 Z" fill="#1a1915" />

        {/* 3. 上方小圆 (r=36, cy=214) — 浅色，形成白鱼头部 */}
        <circle cx={CX} cy={CY - SMALL} r={SMALL} fill="#f0e8d8" />

        {/* 4. 下方小圆 (r=36, cy=286) — 深色，形成黑鱼头部 */}
        <circle cx={CX} cy={CY + SMALL} r={SMALL} fill="#1a1915" />

        {/* 5. 鱼眼 */}
        {/* 白鱼眼中的黑点（在上方小圆内） */}
        <circle cx={CX} cy={CY - SMALL} r={7} fill="#1a1915" />
        {/* 黑鱼眼中的白点（在下方小圆内） */}
        <circle cx={CX} cy={CY + SMALL} r={7} fill="#f0e8d8" />

      </svg>
    </div>
  );
}

/* ===== 卦象绘制 ===== */
function Trigram({ bits, x, y }: { bits: number[]; x: number; y: number }) {
  const w = 36;
  const h = 4.5;
  const gap = 11;
  const gapW = 6;
  const seg = (w - gapW) / 2;
  const c = "rgba(201,168,76,0.65)";

  return (
    <g>
      {bits.map((bit, i) => {
        const ly = y + (i - 1) * gap;
        if (bit === 1) {
          return <rect key={i} x={x - w / 2} y={ly - h / 2} width={w} height={h} fill={c} rx={1.5} />;
        }
        return (
          <g key={i}>
            <rect x={x - w / 2} y={ly - h / 2} width={seg} height={h} fill={c} rx={1.5} />
            <rect x={x + gapW / 2} y={ly - h / 2} width={seg} height={h} fill={c} rx={1.5} />
          </g>
        );
      })}
    </g>
  );
}
