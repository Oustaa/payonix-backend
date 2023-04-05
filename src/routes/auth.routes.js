const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");
const { logIn, signIn, isLoggedIn } = require("../controllers/auth.controller");

router.post("/login", logIn);
router.post("/signin", signIn);
router.get("/isLoggedIn", isLoggedIn);

module.exports = router;
