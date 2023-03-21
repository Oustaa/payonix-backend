const router = require("../utils/createRouter")();

const {
  getArtisans,
  postArtisan,
  putArtisanInfo,
  getArtisansCompta,
  getComptaByArtisan,
  postArtisanCompta,
} = require("../controllers/artisan.controller");

router.get("/", getArtisans);
router.post("/", postArtisan);
router.put("/:id", putArtisanInfo);
router.get("/comptas", getArtisansCompta);
router.get("/:id/comptas", getComptaByArtisan);
router.post("/compta", postArtisanCompta);

module.exports = router;
