"use client";

import { signIn } from "next-auth/react";

export default function LoginModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">

      <div className="bg-white rounded-2xl p-8 w-[400px] relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          Welcome to WebNexa Blogs
        </h2>

        <button
          onClick={() => signIn("google")}
          className="
            w-full flex items-center justify-center gap-3
            border rounded-lg py-3
            hover:bg-gray-50 transition
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}