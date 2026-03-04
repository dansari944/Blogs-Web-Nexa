const express = require("express");
const router = express.Router();
const errorHandler = require("../middleware/errorHandler");
const { uploadFileMiddleware } = require("../middleware/uploadImages");
const auth = require("../middleware/auth.middleware.js");
const ctrl = require("../controllers/blog.controller.js");
const user = require("../controllers/user.controller.js");

// router.post("/", auth, ctrl.createBlog);
// router.put("/:id", auth, ctrl.updateBlog);
// router.delete("/:id", auth, ctrl.deleteBlog);

router.get("/profile", auth, user.getUsersDetails);
router.post(
  "/profile",
  auth,
  uploadFileMiddleware,
  errorHandler,
  user.updateProfile,
);

router.post("/send-otp", auth, user.sendMobileOTP);
router.post("/verify-otp", auth, user.verifyOTP);
router.post("/update-preferences", auth, user.updatePreferences);
router.patch("/preferences", auth, user.updatePreferencesPatch);
router.post("/generate-ai-blog", auth, user.generateBlogByAI);

module.exports = router;
