"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ChangePassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =====================
  // CHANGE PASSWORD
  // =====================
  const updatePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return toast.success("Passwords do not match");
    }

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:7000/api/auth/change-password`,
        form,
        { withCredentials: true }
      );

      toast.success("Password Updated Successfully");

      // logout & redirect
      router.push("/login");
    } catch (err: any) {
      toast.success(err.response?.data?.message || "Error updating password");
    }

    setLoading(false);
  };

  // =====================
  // EMAIL RESET OPTION
  // =====================
  const sendResetMail = async () => {
    await axios.post(
      `http://localhost:7000/api/auth/send-reset-mail`,
      {},
      { withCredentials: true }
    );

    toast.success('Reset password link sent to your email');
  };

  return (
    <div className="max-w-lg space-y-6">

      <h1 className="text-2xl font-bold">Security Settings</h1>

      {/* CURRENT PASSWORD */}
      <div>
        <label className="label">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* NEW PASSWORD */}
      <div>
        <label className="label">New Password</label>
        <input
          type="password"
          name="newPassword"
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <label className="label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* UPDATE BUTTON */}
      <button
        onClick={updatePassword}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

      {/* DIVIDER */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* RESET VIA EMAIL */}
      <button
        onClick={sendResetMail}
        className="text-indigo-600 font-medium hover:underline"
      >
        Send password reset link to my email
      </button>
    </div>
  );
}

export default ChangePassword;