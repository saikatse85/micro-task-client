"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
      className={
        "px-4 py-2 rounded-lg border transition-colors " +
        (isDark
          ? "bg-black text-white border-white/10"
          : "bg-white text-black border-black/10")
      }
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
