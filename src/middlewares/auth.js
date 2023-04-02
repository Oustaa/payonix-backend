require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function authorization(req, res, next) {
  // const token = req.headers["authorization"];
  const token = req.cookies.access_token || req.headers["authorization"];

  jwt.verify(token, JWT_SECRET, function (err, user) {
    if (err || !user)
      return res
        .status(401)
        .json({ message: "you must be logged in", error: true });
    next();
  });
}

module.exports = { authorization };
