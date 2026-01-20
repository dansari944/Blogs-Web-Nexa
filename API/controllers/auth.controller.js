const Admin = require("../models/Admin.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const admin = new Admin(req.body);
  await admin.save();
  res.json({ message: "Admin created" });
};

exports.login = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const valid = await bcrypt.compare(req.body.password, admin.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
};
