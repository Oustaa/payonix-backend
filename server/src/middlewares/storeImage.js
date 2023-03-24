const fs = require("fs");
const multer = require("multer");
const createFolder = require("../utils/createFolder");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, createFolder());
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

async function storeImage(req, res, next) {
  try {
    const upload = multer({
      storage,
      fileFilter: function (req, file, cb) {
        // Only allow image files
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
      },
    });

    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(400).json({ error: "Error uploading file" });
      }

      // Check if the file already exists
      //   const regex = new RegExp(`req.file.filename$`);
      //   console.log(req.file.path);
      //   const filePath = req.file.path;
      //   if (fs.existsSync(regex)) {
      //     fs.unlinkSync(filePath); // Delete the file
      //     return res.status(400).json({ error: "File already exists!" });
      //   }

      // The file was uploaded successfully.
      next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { storeImage };
