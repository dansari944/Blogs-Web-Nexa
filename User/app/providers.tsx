"use client";

import { SessionProvider, useSession } from "next-auth/react";

function SessionGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  // GLOBAL LOADING STATE
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
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
