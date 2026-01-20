const router = require("express").Router();
const auth = require("../middleware/auth.middleware.js");
const ctrl = require("../controllers/blog.controller.js");

router.post("/", auth, ctrl.createBlog);
router.put("/:id", auth, ctrl.updateBlog);
router.delete("/:id", auth, ctrl.deleteBlog);

router.get("/", ctrl.getBlogs);
router.get("/:slug", ctrl.getBlogBySlug);

module.exports = router;
