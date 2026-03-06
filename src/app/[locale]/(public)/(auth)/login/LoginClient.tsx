"use client";

import FoodFloating from "@/components/effects/FoodFloating";
import Snowfall from "@/components/effects/Snowfall";
import LoginForm from "./login-form";
import Logout from "./logout";

function isSnowSeason() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  if (m === 12 && d >= 15) return true; // Noel
  if (m === 1 || (m === 2 && d <= 20)) return true; // Tết
  return false;
}

export default function LoginClient() {
  return (
    <>
      {/* ❄️ Tuyết chỉ mùa Noel / Tết */}
      {isSnowSeason() && <Snowfall />}

      {/* 🍕 Icon đồ ăn bay */}
      <FoodFloating />

      {/* 🔐 Login UI */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <LoginForm />
        <Logout />
      </div>
    </>
  );
}
