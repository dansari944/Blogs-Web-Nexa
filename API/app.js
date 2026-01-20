const express = require("express");
const cors = require("cors");
const Blog = require("./models/Blog.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/blogs", require("./routes/blog.routes.js"));

app.get("/:slug", async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    published: true,
  });
  if (!blog) return res.status(404).send("Not found");
  res.json(blog);
});
app.get("/blogs/:slug", async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return res.status(404).send("Not found");

  const html = await renderBlog(blog);
  res.send(html);
});

app.get("/", (_, res) => res.send("Blog API running"));

module.exports = app;
