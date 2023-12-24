const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const path = require("path");

const {
  Signup,
  Login,
  Profile,
  AddToCart,
  MyListing,
  NewListing,
  DeleteItem,
  AllProducts,
  MyCart,
  RemoveCartItem,
  BuyItem,
  Restock,
  BuyAll,
  UserInformation,
} = require("./Controllers/controllers");

const corsOptions = {
  origin: "https://form-io.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join("uploads")));




// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

app.get("/profile", Profile);
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/userInfo/:userId", UserInformation);
app.get("/myCart/:userId", MyCart);
app.patch("/removeCartItem", RemoveCartItem);
app.get("/mylisting/:userId", MyListing);
app.get("/getProducts", AllProducts);
app.patch("/buyProduct", BuyItem);
app.post("/buyall", BuyAll);
app.patch("/restock", Restock);
app.post("/addToCart", AddToCart);
app.delete("/deleteItem/:itemId", DeleteItem);
// app.post("/newListing", upload.single("file"), NewListing);
app.use("/", (req, res) => {
  res.json({ message: "hello HTere" });
});
app.use((error, req, res, next) => {
  if (error) {
    if (error.message) {
      console.error(error.message);
    } else {
      console.error("An error occurred (no error message provided).");
    }

    const statusCode = error.code || 500;
    res
      .status(statusCode)
      .json({ error: error.message || "An error occurred." });
  } else {
    res.status(500).json({ error: "An error occurred." });
  }
});

mongoose
  .connect("mongodb+srv://tarundeepsaini037:Testing1234@location.in8fipa.mongodb.net/Forms?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Server because: ");
    console.log(err);
  });
app.listen(3000, () => {
  //   console.log('Express server is listening on port 3000');
});
