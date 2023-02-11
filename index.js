require('dotenv').config()
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const conversationRoute = require("./routes/Conversation");
const messageRoute = require("./routes/Messages");
const PORT = process.env.PORT || 8000;
require("./mongoDB");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000"
}))


app.use("/images", express.static(path.join(__dirname, "public/images")));


app.get('/', function (req, res) {
  res.send('Hello World')
})

// middleware
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());


// for post img upload
const postImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);

  }
})

const upload = multer({ storage: postImg });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json("File Upload Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
})

// for profile img upload 

const profileImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/person");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);

  }
})
const profileImgUpload = multer({ storage: profileImg });

app.post("/api/profileImg", profileImgUpload.single("file"), (req, res) => {
  try {
    res.status(200).json("File Upload Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
})

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);



app.listen(PORT, () => {
  console.log("Backend Server is running");
});