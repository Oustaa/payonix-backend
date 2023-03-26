const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const {
  getArtisans,
  postArtisan,
  putArtisanInfo,
  getArtisansCompta,
  getComptaByArtisan,
  postArtisanCompta,
} = require("../controllers/artisan.controller");

router.get("/", authorization, getArtisans);
router.post("/", authorization, postArtisan);
router.put("/:id", authorization, putArtisanInfo);
router.get("/comptas", authorization, getArtisansCompta);
router.get("/:id/comptas", authorization, getComptaByArtisan);
router.post("/compta", authorization, postArtisanCompta);

module.exports = router;
