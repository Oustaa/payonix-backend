const router = require("../utils/createRouter")();

const { logIn, signIn } = require("../controllers/auth.controller");

router.post("/login", logIn);
router.post("/signin", signIn);

module.exports = router;
