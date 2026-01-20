require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./config/db");

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
