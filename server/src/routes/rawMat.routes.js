const router = require("../utils/createRouter")();

function getArtisans(req, res) {
  res.send("Get raw materials");
}

router.get("/", getArtisans);

module.exports = router;
