"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[380px] text-center">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to ChatterBuzz
        </h1>

        <p className="text-gray-500 mb-6">
          Login or create an account
        </p>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 font-semibold hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width={20}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}