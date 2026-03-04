const express = require("express");
const router = express.Router();
const errorHandler = require("../middleware/errorHandler");
const { uploadFileMiddleware } = require("../middleware/uploadImages");
const auth = require("../middleware/auth.middleware.js");
const ctrl = require("../controllers/blog.controller.js");

// Public route for random users
router.post(
  "/public",
  auth,
  uploadFileMiddleware,
  errorHandler,
  ctrl.createPublicBlog,
);
router.post("/approve",  ctrl.approveBlog);

// CRUD
// router.post("/", auth, ctrl.createBlog);
router.put("/:id", auth, ctrl.updateBlog);
router.delete("/:id", auth, ctrl.deleteBlog);

// IMPORTANT: specific routes BEFORE dynamic ones
router.get("/blog-masters", ctrl.getBlogMasters);
router.get("/sub-cat-masters", ctrl.getSubCatgMasters);
router.get("/blogs/:category/:subcategory?page=1", ctrl.getBlogsByCategory);

// Dynamic slug route LAST
// router.get("/:slug", ctrl.getBlogBySlug);

module.exports = router;
