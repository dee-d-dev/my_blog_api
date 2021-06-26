const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//bcrypt to hash passwords

//authentication, user register an account or login into an existing account

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRound);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(`this is the error: ${err}`);
  }
});


//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.send(`Wrong credentials`);
    }

    //comparing passwords using bcrypt
    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      res.send(`Wrong credentials`);
    }

    const { password, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {}
  res.status(400).send(`this is the error: ${err}`);
});

module.exports = router;
