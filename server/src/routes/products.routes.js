const router = require("../utils/createRouter")();

function getArtisans(req, res) {
  res.send("Get products");
}

router.get("/", getArtisans);

module.exports = router;