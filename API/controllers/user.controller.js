const Users = require("../models/Users.js");
const Category = require("../models/Mstd_Category");
const SubCategory = require("../models/Mstd_sub_category.js");
const { sendSms } = require("../utils/sendSms.js");
const path = require("path");
const fs = require("fs");

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

    const { blogNotifications, emailNotifications, darkMode, marketingEmails } =
      req.body;

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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

exports.updatePreferencesPatch = async (req, res) => {
  const userId = req.user.id;

  const user = await Users.findByIdAndUpdate(
    userId,
    {
      "preferences.darkMode": req.body.darkMode,
    },
    { new: true },
  );

  res.json({
    success: true,
    user,
  });
};

exports.generateBlogByAI = async (req, res) => {
  try {
    const userId = req?.userId;
    const { title, categoryId } = req.body;

    // 1. Validation
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!title || !categoryId) {
      return res
        .status(400)
        .json({ message: "Title and category are required" });
    }

    // 2. Database Checks
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 3. Rate Limiting Logic
    if (user.aiUsageCount >= 3) {
      return res.status(429).json({
        message: "Free daily limit reached (3/day)",
      });
    }

    const prompt = `
You are a professional tech blog writer.

Write a high-quality blog about "${title}" in the category "${category}".

Return ONLY valid JSON with this structure:

{
  "content": "Full blog content in markdown format with headings (H2/H3)",
  "excerpt": "Short blog summary under 200 characters",
  "seoMetaTitle": "SEO optimized title under 60 characters",
  "seoMetaDescription": "SEO meta description under 160 characters",
  "tags": ["tag1","tag2","tag3","tag4"],
  "coverImagePrompt": "Prompt describing a modern blog cover image related to the article"
}

Requirements:
- Content length: 800-1000 words
- Use clear headings
- Add bullet points where useful
- Make it engaging and informative
- Return only JSON (no explanation)
`;
    const newRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await newRes.json();

    let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    user.aiUsageCount = user.aiUsageCount + 1;

    await user.save();

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let blogData;

    try {
      blogData = JSON.parse(aiText);
    } catch (error) {
      console.error("AI JSON parse failed:", aiText);
      return res.status(500).json({ message: "AI response format error" });
    }

    return res.json({
      content: blogData.content,
      excerpt: blogData.excerpt,
      seoMetaTitle: blogData.seoMetaTitle,
      seoMetaDescription: blogData.seoMetaDescription,
      tags: blogData.tags,
      coverImagePrompt: blogData.coverImagePrompt,
    });
  } catch (error) {
    console.error("generateBlogByAI error:", error);
    return res.status(500).json({
      message: "AI generation failed",
      error: error.message,
    });
  }
};
