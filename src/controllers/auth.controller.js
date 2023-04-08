require("dotenv").config();

const User = require("../models/user-sql");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

async function logIn(req, res) {
  const { u_email, u_password } = req.body;

  try {
    const user = await User.findOne({ where: { u_email } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", password: true, email: false });
    }

    const isMatch = await bcrypt.compare(u_password, user.u_password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", email: true, password: false });
    }

    const token = jwt.sign(
      { id: user.u_id, u_role: user.u_role, u_name: user.u_name },
      JWT_SECRET
    );
    res.cookie("LogInToken", token, {
      maxAge: 43200,
      secure: true,
      path: "http://localhost:3000/",
    });

    res.status(200).json({ accessToken: token, username: user.u_name });
  } catch (err) {
    res.status(500).json({ message_error: err.message, err });
  }
}

async function signIn(req, res) {
  if (Object.keys(req.body).length === 0 || !req?.body.u_password) {
    return res
      .status(404)
      .json({ message_error: "please provide a user credentials" });
  }

  const hashPassword = await bcrypt.hash(req.body.u_password, 10);

  try {
    const user = await User.findOne({ where: { u_email: req.body.u_email } });

    if (user) {
      return res.status(400).json({
        error_message:
          "can't create an account with the provided email, try loggin in!",
      });
    }

    const savedUser = await User.create({
      ...req.body,
      u_password: hashPassword,
    });
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.code === 11000)
      return res.status(300).json({
        existed_account: 1,
        error_message: `account already exists, try logging in`,
      });
    else if (err.name === "ValidationError") {
      return res.status(400).json({
        error_message: `missing required fields`,
      });
    } else return res.status(500).json(err);
  }
}

function isLoggedIn(req, res) {
  console.log("req.cookies", JSON.stringify(req.cookies));
  const token = req.cookies.access_token || req.headers["authorization"];

  jwt.verify(token, JWT_SECRET, function (err, user) {
    if (err || !user) {
      return res
        .status(401)
        .json({ isLoggedIn: false, error_message: "you must be logged in" });
    }

    return res.status(200).json({ isLoggedIn: true, username: user.u_name });
  });
}

module.exports = { logIn, signIn, isLoggedIn };
