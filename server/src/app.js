const express = require("express");

const User = require("./models/user");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

app.post("/", async (req, res) => {
  const user = await User.create(req.body);

  res.json(user);
});

module.exports = app;
