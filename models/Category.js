//using mongoose to create Schemas
const mongoose = require("mongoose");

//Category schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
