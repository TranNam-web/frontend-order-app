"use client";

import { useEffect, useRef } from "react";

const FOOD_ICONS = ["🍕", "🍔", "🍟", "🍜", "🍣", "🥗", "🥤", "🍩"];

export default function FoodFloating() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const items = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      icon: FOOD_ICONS[Math.floor(Math.random() * FOOD_ICONS.length)],
      size: Math.random() * 14 + 18,
      speed: Math.random() * 0.3 + 0.15,
      rotate: Math.random() * Math.PI,
      rotateSpeed: Math.random() * 0.002 - 0.001,
      opacity: Math.random() * 0.4 + 0.25
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      items.forEach((item) => {
        ctx.save();
        ctx.globalAlpha = item.opacity;
        ctx.font = `${item.size}px serif`;
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotate);
        ctx.shadowColor = "rgba(255,255,255,0.4)";
        ctx.shadowBlur = 8;
        ctx.fillText(item.icon, 0, 0);
        ctx.restore();

        item.y -= item.speed;
        item.rotate += item.rotateSpeed;

        if (item.y < -50) {
          item.y = height + 50;
          item.x = Math.random() * width;
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
