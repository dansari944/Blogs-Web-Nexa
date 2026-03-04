"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Switch from "@mui/material/Switch";
import DummyProfile from "../fonts/Avatar.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AccountSettings() {
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const { data: session, status, update } = useSession();
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [preferences, setPreferences] = useState({
    blogNotifications: true,
    emailNotifications: true,
    darkMode: false,
    marketingEmails: false,
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    dob: "",
    imageUrl: "",
    phone: "",
    country: "",
    phoneVerified: false,
    isVerified: false,
  });
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (form?.preferences) {
      setPreferences(form.preferences);
    }
  }, [form]);

  useEffect(() => {
    if (!session?.backendToken) return;

    const fetchUser = async () => {
      try {
        axios
          .get("http://localhost:7000/api/auth/mstd-countries")
          .then((res) => setCountries(res.data.data));
        const res = await axios.get("http://localhost:7000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        });
        setForm({
          ...res.data,
          imageUrl: res.data.imageUrl,
        });
        setPreview(res.data.image);
        setLoading(false);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchUser();
  }, [session]);

  const savePreferences = async () => {
    try {
      const res = await fetch(
        "http://localhost:7000/api/user/update-preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.backendToken}`,
          },
          body: JSON.stringify(preferences),
        },
      );
      const data = await res.json();
      await update({
        user: {
          ...session?.user,
          preferences: data.preferences.darkMode,
        },
      });

      if (!res.ok) throw new Error(data.message);

      toast.success("Preferences saved");
    } catch (err) {
      toast.error("Failed to save preferences");
    }
  };
  const sendOTP = async () => {
    try {
      setOtpLoading(true);

      await axios.post(
        "http://localhost:7000/api/user/send-otp",
        { phone: form.phone },
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        },
      );

      toast.success("OTP sent successfully");
      setOtpModal(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setOtpLoading(true);

      const res = await axios.post(
        "http://localhost:7000/api/user/verify-otp",
        {
          phone: form.phone,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        },
      );

      toast.success("Phone verified!");

      setForm((prev) => ({
        ...prev,
        phoneVerified: true,
      }));

      setOtpModal(false);
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSelfie = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;

      const context = canvas.getContext("2d");

      setTimeout(() => {
        context?.drawImage(video, 0, 0, 300, 300);
        const imageData = canvas.toDataURL("image/png");

        setPreview(imageData);

        stream.getTracks().forEach((track) => track.stop());
        setShowImageModal(false);
      }, 2000);
    } catch (err) {
      alert("Camera permission denied");
    }
  };

  function StatusBadge({ verified }: { verified: boolean }) {
    return verified ? (
      <span className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
        ✓ Verified
      </span>
    ) : (
      <span className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
        ✕ Not Verified
      </span>
    );
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    try {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        toast.error("All fields are required");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const res = await fetch(
        "http://localhost:7000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.backendToken}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password updated successfully");

      // Optional: clear form
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const updateProfile = async () => {
    if (!session?.backendToken) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("dob", form.dob);
      formData.append("country", form.country);
      formData.append("phone", form.phone);

      if (file) {
        formData.append("image", file); // same like your previous project
      }

      const res = await axios.post(
        "http://localhost:7000/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 🔒 Validate file size (4MB max)
    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error("Image size should not exceed 4MB");
      return;
    }

    // 🔒 Validate type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setFile(selectedFile);
    setImage(URL.createObjectURL(selectedFile));
  };
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 12px",
    },
  };
  const completion = (Object.values(form).filter(Boolean).length / 6) * 50;

  return (
    <div className="flex justify-center">
      <div className="w-full  rounded-2xl shadow-xl flex">
        <div className="w-64 border-r p-3 position-fixed  space-y-4">
          <h2 className="text-xl font-bold  mb-6">Settings</h2>

          {["profile", "Change Password", "Preferences"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                tab === t ? "bg-indigo-600" : "hover:bg-gray-500"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-8 md:w-2/5 flex justify-center">
          <div className="w-full max-w-xl">
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <>
                <h1 className="text-xl font-semibold mb-6">Profile Settings</h1>

                {/* COMPLETION BAR */}
                <div className="mb-6">
                  <p className="text-sm mb-2">
                    Profile Completion {Math.round(completion)}%
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                {/* AVATAR */}
                <div className="flex justify-start mb-6">
                  <div className="relative w-28 h-28">
                    <img
                      src={image || form.imageUrl || DummyProfile.src}
                      className="w-28 h-28 p-3 rounded-full object-cover border cursor-pointer hover:opacity-80 transition"
                      onClick={() => fileInputRef.current?.click()}
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImage}
                    />

                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-xs px-2 py-1 rounded-full">
                      Edit
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                  {/* NAME */}
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    size="small"
                    value={form.name || ""}
                    onChange={handleChange}
                    sx={inputStyle}
                  />

                  {/* EMAIL */}
                  <div>
                    <label className="label">Email</label>

                    <div className="flex items-center gap-3">
                      <TextField
                        fullWidth
                        size="small"
                        value={form.email || ""}
                        disabled
                        sx={inputStyle}
                      />

                      <StatusBadge verified={form.isVerified} />
                    </div>
                  </div>

                  {/* DOB + COUNTRY */}
                  <div className="flex gap-4">
                    {/* DOB */}
                    <div className="flex-1">
                      <TextField
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        fullWidth
                        size="small"
                        value={form.dob || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={inputStyle}
                      />
                    </div>

                    {/* COUNTRY */}
                    <div className="flex-1">
                      <TextField
                        select
                        label="Country"
                        name="country"
                        fullWidth
                        size="small"
                        value={form.country || ""}
                        onChange={handleChange}
                        sx={inputStyle}
                      >
                        {countries?.map((item) => (
                          <MenuItem key={item._id} value={item.country}>
                            {item.country}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  {/* PHONE */}
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    size="small"
                    value={form.phone || ""}
                    onChange={handleChange}
                    sx={inputStyle}
                  />
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="mt-8 w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

            {/* SECURITY TAB */}
            {tab === "Change Password" && (
              <>
                <h1 className="text-xl font-semibold mb-6">Change Password</h1>

                <div className="space-y-4">
                  {/* CURRENT PASSWORD */}
                  <TextField
                    label="Current Password"
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    fullWidth
                    size="small"
                    value={form.currentPassword || ""}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            edge="end"
                          >
                            {showPassword.current ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* NEW PASSWORD */}
                  <TextField
                    label="New Password"
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    fullWidth
                    size="small"
                    value={form.newPassword || ""}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            edge="end"
                          >
                            {showPassword.new ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* CONFIRM PASSWORD */}
                  <TextField
                    label="Confirm New Password"
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    fullWidth
                    size="small"
                    value={form.confirmPassword || ""}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            edge="end"
                          >
                            {showPassword.confirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="mt-8 w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </>
            )}

            {/* Preferences */}
            {tab === "Preferences" && (
              <>
                <h1 className="text-xl font-semibold mb-6">Preferences</h1>

                <div className="space-y-6">
                  {/* BLOG NOTIFICATIONS */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">New Blog Notifications</p>
                      <p className="text-sm text-gray-500">
                        Get notified when new blogs are published.
                      </p>
                    </div>

                    <Switch
                      checked={preferences.blogNotifications}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          blogNotifications: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  {/* EMAIL NOTIFICATIONS */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive important updates via email.
                      </p>
                    </div>

                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  {/* DARK MODE */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">
                        Switch between light and dark theme.
                      </p>
                    </div>

                    <Switch
                      checked={preferences.darkMode}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          darkMode: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  {/* MARKETING EMAILS */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">
                        Receive offers and announcements.
                      </p>
                    </div>

                    <Switch
                      checked={preferences.marketingEmails}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketingEmails: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  disabled={loading}
                  onClick={savePreferences}
                  className="mt-8 w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {loading ? "Saving" : "Save Preferences"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  {
    showImageModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Update Profile Picture</h2>

          <div className="space-y-3">
            {/* Take Selfie */}
            <button
              onClick={() => handleSelfie()}
              className="w-full border rounded-lg py-2 hover:bg-gray-100"
            >
              📷 Take a Selfie
            </button>

            {/* Upload */}
            <label className="block w-full border rounded-lg py-2 text-center cursor-pointer hover:bg-gray-100">
              🖼 Upload from Device
              <input
                type="file"
                hidden
                onChange={(e) => {
                  handleImage(e);
                  setShowImageModal(false);
                }}
              />
            </label>

            {/* Google Drive (UI only for now) */}
            <button
              onClick={() => alert("Google Drive integration coming soon")}
              className="w-full border rounded-lg py-2 hover:bg-gray-100"
            >
              ☁️ Import from Google Drive
            </button>

            {/* Remove */}
            <button
              onClick={() => {
                setPreview("");
                setShowImageModal(false);
              }}
              className="w-full text-red-600 py-2"
            >
              Remove Photo
            </button>

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  {
    otpModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-80">
          <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <button
            onClick={verifyOTP}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            Verify OTP
          </button>

          <button
            onClick={() => setOtpModal(false)}
            className="w-full mt-2 text-sm text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
