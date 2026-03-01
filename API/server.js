require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path")
const connectDB = require("./config/db");

const app = express();
app.use(
  cors({
    origin: [
      "https://webnexainfo.online",
      "https://admin.webnexainfo.online",
      "http://localhost:4000",
      "https://admin.webnexainfo.online",
    ],
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), process.env.DOCPATH)
  )
);

app.use(express.json());
connectDB()
app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/blogs", require("./routes/blog.routes.js"));
app.use("/api/user", require("./routes/user.routes.js"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
