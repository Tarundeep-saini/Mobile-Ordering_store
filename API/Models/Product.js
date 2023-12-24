const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  price: Number,
  ram: Number,
  storage: Number,
  stock: Number,
  sold: Number,
  userId: String,
  path: String,
  productType: String,
  deleted: Boolean,
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
