"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionGate({ children }: { children: React.ReactNode }) {
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
  
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
        <h1 className="flex gap-1 text-3xl font-bold tracking-widest text-indigo-600">
          {"LOADING".split("").map((letter, i) => (
            <span
              key={i}
              className="animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGate>{children}</SessionGate>
    </SessionProvider>
  );
}