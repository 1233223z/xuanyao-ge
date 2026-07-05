"use client";

import { useEffect, useRef } from "react";

/**
 * 背景氛围层
 *
 * 极轻量的星空/流影效果，纯 Canvas 实现。
 * 不影响页面交互（pointer-events: none）。
 * 手机端自动减少粒子数。
 */
export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const count = isMobile ? 20 : 50;
    const stars: { x: number; y: number; r: number; speed: number; alpha: number; drift: number }[] = [];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        speed: 0.0003 + Math.random() * 0.0008,
        alpha: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.15,
      });
    }

    // 微光团
    const glows = [
      { x: w * 0.2, y: h * 0.3, r: Math.max(w, h) * 0.25, color: "rgba(201,168,76," },  // 金
      { x: w * 0.8, y: h * 0.6, r: Math.max(w, h) * 0.2, color: "rgba(91,140,122," },   // 玉
      { x: w * 0.5, y: h * 0.8, r: Math.max(w, h) * 0.18, color: "rgba(169,67,53," },   // 微朱
    ];

    let time = 0;

    function draw() {
      time += 0.002;
      ctx!.clearRect(0, 0, w, h);

      // 微光团
      glows.forEach((g) => {
        const pulse = 0.6 + 0.4 * Math.sin(time * 0.5 + g.x);
        const gradient = ctx!.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r * pulse);
        gradient.addColorStop(0, g.color + "0.025)");
        gradient.addColorStop(0.5, g.color + "0.012)");
        gradient.addColorStop(1, g.color + "0)");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      });

      // 星点
      stars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(time * 3 + s.x * 0.01 + s.y * 0.01);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(247,241,228,${s.alpha * flicker})`;
        ctx!.fill();

        // 极慢漂移
        s.y -= s.speed * 0.5;
        s.x += s.drift * 0.3;
        if (s.y < -10) { s.y = h + 10; s.x = Math.random() * w; }
        if (s.x < -10 || s.x > w + 10) s.drift *= -1;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
