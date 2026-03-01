const express = require("express");
const router = express.Router();
const {
  register,
  login,
  userGoogle,
  verifyOTP,
  changePassword,
  sendResetPasswordMail,
  setNewPassword
} = require("../controllers/auth.controller.js");
const auth = require("../middleware/auth.middleware.js");
const { getCountryMasters }= require("../controllers/mstd.controller.js")

router.post("/register", register);
router.post("/login", login);
router.get("/mstd-countries", getCountryMasters);
router.post("/google-login", userGoogle);
router.post("/verify-otp", verifyOTP);
router.post("/change-password",auth, changePassword);
router.put("/send-reset-mail", sendResetPasswordMail);
router.put("/reset-password", setNewPassword);

module.exports = router;
