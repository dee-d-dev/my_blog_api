const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE USER: updating a user need an id to identify the specific user for update, so and ID is sprecified in the route path
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    if (req.body.password) {
      //encrypt our password on the update route
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).send(updatedUser);
    } catch (err) {
      res.status(500).send(`this is the error: ${err}`);
    }
  } else {
    res.send(`you can only update your account`);
  }
});

//LOGIN USER
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

//DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        const updatedUser = await User.findByIdAndDelete(req.params.id);

        res.status(200).send("User has been deleted");
      } catch (err) {
        res.status(500).send(`this is the error: ${err}`);
      }
    } catch (err) {
      res.status(404).send("user not found");
    }
  } else {
    res.send(`you can only delete your account`);
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.send(others);
  } catch (err) {
    res.status(500).send(`This is the error: ${err}`);
  }
});

module.exports = router;
