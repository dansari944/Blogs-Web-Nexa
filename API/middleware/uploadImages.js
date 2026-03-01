const path = require("path");
const multer = require("multer");
const util = require("util");
const fs = require("fs");
const maxSize = 4 * 1024 * 1024;
const FilePath = path.join(process.cwd(), process.env.DOCPATH);
const fields = [{ name: "image", maxCount: 1 }];
/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else {
    req.fileError = "fileTypeError";
    cb(null, false);
  }
};

let storage;

storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;

    const uploadPath = path.join(
      process.cwd(),
      process.env.DOCPATH,
      userId,
      "Image",
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `profile_${Date.now()}.${ext}`);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
}).fields(fields);

const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = { uploadFileMiddleware };
