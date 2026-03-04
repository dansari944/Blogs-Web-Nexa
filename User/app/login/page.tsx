"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/GoogleIcon";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const resendOtp = async () => {
    await fetch(`http://localhost:7000/api/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setTimer(30);
  };

  const login = async () => {
    try {
      setLoading("login");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res.ok) {
        return null;
      }

      if (res?.status === 401) {
        toast.error("Invalid Credentials");
        return;
      }

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      router.push("/");
    } finally {
      setLoading("");
    }
  };

  const DotLoader = () => (
    <span className="flex items-center justify-center h-[24px]">
      <span className="flex gap-1 items-center">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
      </span>
    </span>
  );

  const register = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading("register");

      const res = await fetch(`http://localhost:7000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        toast.error(data?.msg);
      }
    } finally {
      setLoading("");
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading("verify");
      const res = await fetch(`http://localhost:7000/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        });
      } else {
        toast.error(data?.msg);
      }
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-20">
      <div className="text-black bg-white p-8 rounded-xl w-96 space-y-4 shadow-lg">
        <button
          onClick={async () => {
            setLoading("google");
            await signIn("google", { callbackUrl: "/" });
          }}
          disabled={loading === "google"}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 font-semibold hover:bg-gray-50"
        >
          {loading === "google" ? (
            <DotLoader />
          ) : (
            <>
              <GoogleIcon size={22} />
              Continue with Google
            </>
          )}
        </button>

        <hr />

        {!otpSent && (
          <>
            {isSignup && (
              <input
                placeholder="Full Name"
                className="border p-2 w-full"
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              placeholder="Email"
              className="border p-2 w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border p-2 w-full pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  /* Eye OFF */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a17.956 17.956 0 012.904-3.954M6.223 6.223A9.953 9.953 0 0112 5c5 0 9 4 10 7a18.033 18.033 0 01-4.293 5.077M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                    />
                  </svg>
                ) : (
                  /* Eye ON */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="border p-2 w-full"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {/* CAPTCHA placeholder */}
            {isSignup && (
              <div className="border rounded p-3 text-center text-sm text-gray-500">
                CAPTCHA HERE
              </div>
            )}

            <button
              onClick={isSignup ? register : login}
              disabled={loading === "login" || loading === "register"}
              className="bg-indigo-600 text-white h-11 w-full rounded flex justify-center items-center"
            >
              {(loading === "login" && !isSignup) ||
              (loading === "register" && isSignup) ? (
                <DotLoader />
              ) : isSignup ? (
                "Register"
              ) : (
                "Login"
              )}
            </button>

            <p
              className="text-sm text-center cursor-pointer text-indigo-600"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Login"
                : "Create new account"}
            </p>
          </>
        )}

        {/* OTP SECTION */}
        {otpSent && (
          <>
            <input
              placeholder="Enter OTP"
              className="border p-2 w-full"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading === "verify"}
              className="bg-green-600 text-white w-full h-11 rounded flex items-center justify-center"
            >
              {loading === "verify" ? <DotLoader /> : "Verify OTP"}
            </button>
            <button
              disabled={timer > 0}
              onClick={resendOtp}
              className="text-sm text-indigo-600"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
