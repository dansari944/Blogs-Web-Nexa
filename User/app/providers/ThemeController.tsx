"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ThemeController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const darkMode = session?.user?.preferences?.darkMode;

    const root = document.documentElement;

    console.log('darkMode: ', darkMode);
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [session, status]);

  return <>{children}</>;
}