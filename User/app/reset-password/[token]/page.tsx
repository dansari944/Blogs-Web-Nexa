"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!password || !confirmPassword) return toast.error('Please fill all fields');

    if (password !== confirmPassword) return toast.error('Sorry entered password do not match');

    setLoading(true);

    try {
      await axios.post(`http://localhost:7000/api/auth/reset-password`, {
        token,
        password,
      });

      toast.success('Password updated successfully');
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired reset link");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[420px] space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>

        <p className="text-sm text-gray-500 text-center">
          Enter your new password below
        </p>

        {/* NEW PASSWORD */}
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            className="input"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
