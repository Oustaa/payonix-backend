const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");

const {
  getArtisans,
  postArtisan,
  putArtisanInfo,
  getArtisansCompta,
  getComptaByArtisan,
  postArtisanCompta,
  deleteArtisan,
  deleteArtisanCompta,
} = require("../controllers/artisan.controller");

router.get("/", authorization, getArtisans);
router.post("/", authorization, postArtisan);
router.put("/:id", authorization, putArtisanInfo);
router.delete("/:id", authorization, deleteArtisan);

router.get("/comptas", authorization, getArtisansCompta);
router.get("/:id/comptas", authorization, getComptaByArtisan);
router.post("/comptas", authorization, postArtisanCompta);
router.delete("/comptas/:id", authorization, deleteArtisanCompta);

module.exports = router;
