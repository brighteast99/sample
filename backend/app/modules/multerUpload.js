const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

try {
  // Check designated directory exists
  fs.readdirSync(process.env.MULTER_DIR_NAME);
} catch (err) {
  // Create directory if it doesn't exist
  fs.mkdirSync(process.env.MULTER_DIR_NAME);
}

// Define storage, file name
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.env.MULTER_DIR_NAME}/`);
  },
  filename: (req, file, cb) => {
    // Prepend random string to original file name to prevent duplication
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file) {
    cb({ message: "no such file" }, false);
  }
  if (
    // Allow svg, png, jpg, jpeg files only
    file.mimetype == "image/svg+xml" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Only *.svg, png, jpg, jpeg files can be uploaded!" }, false);
  }
};

// Multer definition
const multerUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

module.exports = multerUpload;
