const Users = require("../models/Users.js");
const Category = require("../models/Mstd_Category");
const SubCategory = require("../models/Mstd_sub_category.js");
const { sendSms } = require("../utils/sendSms.js");
const path = require("path");
const fs = require("fs");

exports.createPublicBlog = async (req, res) => {
  try {
    const { name, email, dob, country, phone, phoneVerified, isVerified } =
      req.body;

    const uniqueSlug = `${slug}-${Date.now()}`;

    const blog = await Blog.create({
      title,
      content,
      category,
      authorName: authorName || "Anonymous",
      slug: uniqueSlug,
      published: true, // Automatically publish for now, or set to false for moderation
      publishedAt: new Date(),
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersDetails = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - userId missing",
      });
    }

    const user = await Users.findById(userId)
      .select("-password -otp -otpExpires")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    Object.keys(user).forEach((key) => {
      if (user[key] === null || user[key] === undefined) {
        user[key] = "";
      }
    });
    if (user.image) {
      user.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${user.image}`;
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getUsersDetails error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.dob = req.body.dob || user.dob;
    user.country = req.body.country || user.country;
    user.phone = req.body.phone || user.phone;

    if (req.files?.image?.length > 0) {
      const uploadedFile = req.files.image[0];

      // 🔥 delete old image if exists
      if (user.image) {
        const oldPath = path.join(
          process.cwd(),
          process.env.DOCPATH || "uploads/",
          user.image,
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // save new image reference only
      user.image = `${userId}/Image/${uploadedFile.filename}`;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("error updateProfile : ", error);
  }
};

exports.sendMobileOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await Users.findById(req.userId);

    user.phoneOtp = otp;
    user.phoneOtpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendSms(phone, `Your OTP is ${otp}. Valid for 5 minutes.`);
    res.json({ success: true });
  } catch (error) {
    console.log("error sendMobileOTP: ", error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await Users.findById(req.userId);

    if (user.phoneOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.phoneVerified = true;
    user.phoneOtp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.log("error verifyOTP : ", error);
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      blogNotifications,
      emailNotifications,
      darkMode,
      marketingEmails,
    } = req.body;

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Update preferences safely
    user.preferences = {
      ...user.preferences,
      blogNotifications,
      emailNotifications,
      darkMode,
      marketingEmails,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Update Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};