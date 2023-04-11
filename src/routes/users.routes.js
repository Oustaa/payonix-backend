const router = require("../utils/createRouter")();

const { authorization } = require("../middlewares/auth");
const { getUsers } = require("../controllers/users.controller");

router.get("/", authorization, getUsers);

module.exports = router;
