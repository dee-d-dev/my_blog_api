const Category = require("../models/Category");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(200).send(savedCategory);
  } catch (err) {
    res.status(500).send(`this is the error: ${err}`);
  }
});

router.get("/", async (req, res)=>{
   try {
     const categories = await Category.find();
     res.status(200).send(categories);
   } catch (err) {
     res.status(500).send(`this is the error: ${err}`);
   }
})

module.exports = router;
