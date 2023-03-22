const fs = require("fs");
const path = require("path");

function createFolder() {
  // check if folder exists
  const imagesFolderPath = path.join(__dirname, "..", "..", "public", "images");

  if (!fs.existsSync(imagesFolderPath)) {
    // create a folder called "images"
    fs.mkdirSync(imagesFolderPath);
  }
  return imagesFolderPath;
}

module.exports = createFolder;
