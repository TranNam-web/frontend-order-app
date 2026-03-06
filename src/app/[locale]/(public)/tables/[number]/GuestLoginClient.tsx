"use client";

import Snowfall from "@/components/effects/Snowfall";
import FoodFloating from "@/components/effects/FoodFloating";
import GuestLoginForm from "./guest-login-form";

function isSnowSeason() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  if (m === 12 && d >= 15) return true;
  if (m === 1 || (m === 2 && d <= 20)) return true;
  return false;
}

export default function GuestLoginClient() {
  return (
    <>
      {/* ❄️ Tuyết (Noel / Tết) */}
      {isSnowSeason() && <Snowfall />}

      {/* 🍜 Icon đồ ăn bay */}
      <FoodFloating />

      {/* 👤 Login khách */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <GuestLoginForm />
      </div>
    </>
  );
}
