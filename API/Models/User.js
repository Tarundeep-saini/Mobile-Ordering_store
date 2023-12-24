const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  isSeller: Boolean,
  inCart: [String],
  myListing: [String],
  Purchased: [
    {
      id:String,
      title: String,
      price: Number,
      path: String,
      quantity: Number,
      productType: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
