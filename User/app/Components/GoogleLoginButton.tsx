"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-black text-white rounded-md"
    >
      Continue with Google
    </button>
  );
}