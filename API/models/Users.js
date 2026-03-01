const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,
    default: null,
  },
  dob: { type: String },
  provider: { type: String, enum: ["google", "credentials"] },
  providerId: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  phone: { type: String, trim: true },
  phoneVerified: { type: String, trim: true },
  country: { type: String },
  refreshToken: { type: String },
  otp: { type: String },
  phoneOtp: { type: String },
  phoneOtpExpires: { type: Date },
  otpExpires: { type: Date },
  isVerified: { type: Boolean },
  subscription: { type: Number },
  preferences: {
    blogNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
  },
},
  {
    timestamps: true, // createdAt & updatedAt
  },
);

module.exports = mongoose.model("User", UserSchema);
