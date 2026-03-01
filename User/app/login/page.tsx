"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import GoogleIcon from "@/components/GoogleIcon";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [timer, setTimer] = useState(30);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  // LOGIN
  const login = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  // REGISTER
  const register = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

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
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    const res = await fetch(`http://localhost:7000/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
debugger
    if (data.success) {
      debugger
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } else {
      toast.error(data?.msg);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-20">
      <div className="text-black bg-white p-8 rounded-xl w-96 space-y-4 shadow-lg">
        {/* GOOGLE LOGIN */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 font-semibold hover:bg-gray-50"
        >
          <GoogleIcon size={22} />
          Continue with Google
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

            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full"
              onChange={(e) => setPassword(e.target.value)}
            />

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
              className="bg-indigo-600 text-white w-full p-2 rounded"
            >
              {isSignup ? "Register" : "Login"}
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
              className="bg-green-600 text-white w-full p-2 rounded"
            >
              Verify OTP
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
