const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const {
  sendOtpMail,
  sendWelcomeMail,
  sendResetPassword,
} = require("../utils/sendmails");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User exists" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      isVerified: false,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, 
      provider: "credentials",
    });
    await sendOtpMail(email, otp);

    return res.json({ success: true, user });
  } catch (error) {
    console.log("error register : ", error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    if (user.isVerified) {
      const token = jwt.sign({ userId: user._id, name: user?.name }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const userData = user.toObject();
      delete userData.password;

      return res.json({
        success: true,
        token,
        user: userData,
      });
    }

    
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    
    try {
      await sendWelcomeMail(email, user?.name);
    } catch (err) {
      console.log("Mail failed:", err);
    }

    
    const token = jwt.sign({ userId: user._id, name: user?.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userData = user.toObject();
    delete userData.password;

    return res.json({
      success: true,
      message: "Account verified",
      token,
      user: userData,
    });
  } catch (error) {
    console.log("error verifyOTP: ", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id, name: user?.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    
    const userData = user.toObject();
    delete userData.password;

    
    return res.status(200).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otpExpires > Date.now() - 4 * 60 * 1000) {
      return res.status(400).json({
        msg: "Please wait before requesting new OTP",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtpMail(email, otp);

    return res.json({ success: true });
  } catch (error) {
    console.log("error resendOTP: ", error);
  }
};

exports.userGoogle = async (req, res) => {
  try {
    const { email, name, image } = req.body;

    let user = await User.findOne({ email });

    let isNewUser = false;

    if (!user) {
      user = await User.create({
        email,
        name,
        provider: "google",
        isVerified: true,
      });

      isNewUser = true;
    }
    if (image && !user.image) {
      const uploadPath = path.join(
        process.cwd(),
        process.env.DOCPATH,
        user._id.toString(),
        "Image",
      );

      fs.mkdirSync(uploadPath, { recursive: true });

      const highResImage = image.split("=")[0] + "=s400-c";

      const response = await axios({
        url: highResImage,
        method: "GET",
        responseType: "stream",
      });

      const fileName = `profile_${Date.now()}.jpeg`;
      const filePath = path.join(uploadPath, fileName);

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      user.image = `${user._id}/Image/${fileName}`;
      await user.save();
    }

    if (isNewUser) {
      try {
        await sendWelcomeMail(email, name);
      } catch (err) {
        console.log("Mail failed:", err);
      }
    }

    const token = jwt.sign({ userId: user._id, name: user?.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, user });
  } catch (error) {
    console.log("error userGoogle : ", error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.userId);

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) return res.status(400).json({ message: "Wrong password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.log("error changePassword : ", error);
  }
};

exports.sendResetPasswordMail = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const token = jwt.sign({ userId: user._id, name: user?.name }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    
    await sendResetPassword(user?.email, user?.name, resetLink);

    
    return res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.log("error sendResetPasswordMail : ", error);
  }
};

exports.setNewPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    await transporter.sendMail({
      from: `"WebNexa Blogs" <${process.env.EMAILID_FOR_OTP}>`,
      to: user.email,
      subject: "Password Updated Successfully",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Password Changed Successfully</h2>

          <p>Hello ${user.name},</p>

          <p>Your password has been successfully updated.</p>

          <p>If you did NOT make this change, please reset your password immediately.</p>

          <br/>

          <p style="color:#555">
            — WebNexa Security Team
          </p>
        </div>
      `,
    });
    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("error setNewPassword : ", error);
  }
};
