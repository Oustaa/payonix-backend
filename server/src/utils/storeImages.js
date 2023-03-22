const multer = require("multer");
const createFolder = require("./createFolder");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, createFolder());
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

module.exports = upload;
