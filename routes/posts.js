const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

//Create new post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (err) {
    res.send(`this is the err: ${err}`);
  }
});

//update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).send(updatedPost);
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(500).send(`You can only update your post :(`);
    }
  } catch (err) {
    res.status(500).send(`you can only update your post`);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.username === req.body.username) {
    try {
      await post.delete();
      res.send("Post deleted");
    } catch (err) {
      res.send(`this is the ${err}`);
    }
  } else {
    res.send(`you can only delete your post`);
  }
});

//GET ONE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (err) {
    res.status(500).send(`This is the error: ${err}`);
  }
});

//GET ALL POSTS or Conditional posts
router.get("/", async (req, res) => {
  const userNameId = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (userNameId) {
      posts = await Post.find({ username: userNameId });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.send(posts);
  } catch (err) {}
});

module.exports = router;
