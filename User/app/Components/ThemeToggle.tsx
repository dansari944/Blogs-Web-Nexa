"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-indigo-600 transition-colors duration-300"
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
          dark ? "translate-x-7" : ""
        }`}
      />
    </button>
  );
}