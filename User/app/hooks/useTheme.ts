"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useTheme() {
  const { data: session, update } = useSession();
  const [dark, setDark] = useState(false);

  // sync from session
  useEffect(() => {
    const isDark = session?.user?.preferences?.darkMode;
    setDark(!!isDark);
  }, [session]);

  // apply theme to html
  const applyTheme = (value: boolean) => {
    const root = document.documentElement;
    if (value) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // toggle theme
  const toggleTheme = async () => {
    const newValue = !dark;

    setDark(newValue);
    applyTheme(newValue);

    try {
      // save to backend
      await fetch("http://localhost:7000/api/user/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.backendToken}`,
        },
        body: JSON.stringify({
          darkMode: newValue,
        }),
      });

      await update();
    } catch (err) {
      console.error("Theme update failed", err);
    }
  };

  return { dark, toggleTheme };
}