"use client";

import { useEffect, useRef } from "react";

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const flakes = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.8 + 0.3,
    }));

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = isDark
        ? "rgba(255,255,255,0.75)"
        : "rgba(255,255,255,0.55)";

      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 6;

      ctx.beginPath();
      flakes.forEach((f) => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      });
      ctx.fill();

      flakes.forEach((f) => {
        f.y += f.speed;
        if (f.y > height) {
          f.y = -5;
          f.x = Math.random() * width;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}
