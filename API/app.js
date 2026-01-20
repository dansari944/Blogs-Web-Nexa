const express = require("express");
const cors = require("cors");
const Blog = require("./models/Blog.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/blogs", require("./routes/blog.routes.js"));

app.get("/", (_, res) => res.send("Blog API running"));

module.exports = app;
