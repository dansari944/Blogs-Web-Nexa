const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ verify once
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user info
    req.user = decoded;          // full payload
    req.userId = decoded.userId; // shortcut (BEST PRACTICE)

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
