const fs = require("fs");
const path = require("path");

const deleteImage = (filename) => {
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    filename
  );
  return new Promise((resolve, reject) => {
    fs.unlink(imagePath, (err) => {
      resolve();
    });
  });
};

deleteImage("1681212687160-PoufMarocainCuir_600x copy.jpg");

module.exports = deleteImage;
