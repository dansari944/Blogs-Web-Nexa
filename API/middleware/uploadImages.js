const path = require("path");
const multer = require("multer");
const util = require("util");
const fs = require("fs");

const maxSize = 4 * 1024 * 1024;

const FilePath = path.join(process.cwd(), process.env.DOCPATH);

const fields = [
  { name: "image", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
];

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else {
    req.fileError = "fileTypeError";
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;

    const uploadPath = path.join(
      process.cwd(),
      process.env.DOCPATH,
      userId,
      "Image"
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];

    // Generate unique key
    const uniqueKey = Date.now() + "_" + Math.round(Math.random() * 1e9);

    if (file.fieldname === "image") {
      const fileName = `profile_${uniqueKey}.${ext}`;
      cb(null, fileName);
    }

    else if (file.fieldname === "coverImage") {
      const fileName = `cover_${uniqueKey}.${ext}`;

      // Save unique key so controller can use it
      req.uniqueKeyCoverImg = fileName;

      cb(null, fileName);
    }
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
}).fields(fields);

const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = { uploadFileMiddleware };