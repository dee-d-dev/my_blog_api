const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const homeRoute = require("./routes/homeRoute");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const bodyparser = require("body-parser");
const multer = require("multer"); 

//create environment variable for port
dotenv.config();
let PORT = process.env.PORT || 3000;

//connect mongo using mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log("mongodb connected successfully"))
  .catch((err) => {
    console.log(`this is the ${err} with Mongo connection`);
  });

//body parser
app.use(bodyparser.urlencoded({ extended: true }));

//multer used for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  }, filename: (req, file, cb)=> {
    cb(null, req.body.name);
  }
})

const upload = multer({storage: storage})

app.post("/api/uploads", upload.single('file'), (req, res)=> {
  res.status(200).send(`File has been uploaded`)
})

app.use(express.json());

//home
app.use("/", homeRoute);

//auth router
app.use("/api/auth", authRoute);

//user route
app.use("/api/users", userRoute);

//Post Route
app.use("/api/posts", postRoute);

//category routes
app.use("/api/categories", categoryRoute);
//server
app.listen(PORT, () => {
  console.log(`backend is running on http://localhost:${PORT}`);
});
