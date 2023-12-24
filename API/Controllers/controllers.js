const User = require("../Models/User");
const Product = require("../Models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { useSearchParams } = require("react-router-dom");
const httpError = require("./http-error");
const { log } = require("console");

const jwtKey = process.env.JWT_KEY;

//

const Profile = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return;
  }
  try {
    const data = jwt.verify(token, jwtKey);
    res.json(data);
  } catch (error) {
    console.error("Error in decoding JWT:", error);
    next(new httpError("An error occurred while fetching the profile.", 500));
  }
};

//SignUp Work
const Signup = async (req, res) => {
  const { username, email, password, isSeller } = req.body;
  const hashedPassword = await bcrypt.hash(password, 9);
  try {
    const createdUser = await User.create({
      username: username,
      email,
      password: hashedPassword,
      isSeller,
      inCart: [],
      myListing: [],
      Purchased: [],
    });
    jwt.sign(
      { userId: createdUser._id, username, isSeller },
      jwtKey,
      {},
      (err, token) => {
        if (err) {
          return next(new httpError("Error Signing In Please Try again", 500));
        }

        res.cookie("token", token).status(201).json(createdUser);
      }
    );
    console.log("as");
  } catch (error) {
    console.log(error);
  }
};

//Login Work
const Login = async (req, res, next) => {
  const { email, password } = req.body;
  if (password.length === 0 || email.length === 0) {
    return next(new httpError("No Data Provided", 403));
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      next(new httpError("User Does Not Exist", 404));
    }
    if (foundUser) {
      const passwordMatch = bcrypt.compare(password, foundUser.password);
      if (passwordMatch) {
        jwt.sign(
          {
            userId: foundUser._id,
            username: foundUser.username,
            isSeller: foundUser.isSeller,
          },
          jwtKey,
          {},
          (err, token) => {
            if (err) {
              return next(
                new httpError("Error Signing In Please Try again", 500)
              );
            }

            res.cookie("token", token).status(201).json({ foundUser });
          }
        );
      } else {
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.log(error);
    next(new httpError("An error occurred while Loggin in.", 500));
  }
};

const UserInformation = async (req, res) => {
  console.log("WE HERE!!!");
  const userId = req.params.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log(user);
    console.log("ere als");
    res.json({ user });
  } catch (error) {}
};

const AddToCart = async (req, res) => {
  const { itemId, userId } = req.body;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser.inCart.includes(itemId)) {
      foundUser.inCart.push(itemId);
      await foundUser.save();
      res.json({ message: "Item added to cart successfully" });
    } else {
      res.json({ message: "Item is already in the cart" });
    }
  } catch (error) {
    console.log(error);
  }
};

const DeleteItem = async (req, res) => {
  const itemId = req.params.itemId;
  console.log(itemId);
  try {
    const deletedProduct = await Product.findByIdAndUpdate(itemId, {
      deleted: true,
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Item not found" });
    }
    await User.updateMany({ inCart: itemId }, { $pull: { inCart: itemId } });
    const userId = deletedProduct.userId;
    await User.findByIdAndUpdate(userId, {
      $pull: { myListing: itemId },
    });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const MyListing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundUser = await User.findOne({ _id: userId });
    const userListing = foundUser.myListing;
    const products = await Product.find({ _id: { $in: userListing } });
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

const AllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products, isError: false });
  } catch (error) {
    res.json({ isError: true });
    console.log(error);
  }
};

const RemoveCartItem = async (req, res) => {
  const { userId, id } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { inCart: id },
    });
    res.json({ message: "Ok" });
  } catch (error) {
    console.log(error);
  }
};

const MyCart = async (req, res) => {
  let userId = req.params.userId;
  try {
    const userCart = await User.findOne({ _id: userId }, { inCart: 1 });
    const productIds = userCart.inCart;

    const demoCartProducts = await Product.find({ _id: { $in: productIds } });
    const cartProducts = [].concat(...demoCartProducts);
    res.json(cartProducts);
  } catch (error) {
    console.error(error);
  }
};

const NewListing = async (req, res) => {
  const { title, price, storage, ram, stock, userId, productType } = req.body;
  const path = req.file.path;
  try {
    const newProduct = await Product.create({
      title,
      price,
      ram,
      storage,
      stock,
      sold: 0,
      userId,
      path,
      productType,
      deleted: false,
    });
    await newProduct.save();
    const user = await User.findByIdAndUpdate(userId, {
      $push: { myListing: newProduct._id },
    });
    res.json({ newProduct });
  } catch (error) {
    console.log(error);
    return;
  }
};

const BuyItem = async (req, res) => {
  try {
    const { totalPrice, BuyerId, _id, quantity, stock } = req.body;

    // Check if the buyer exists
    const existingUser = await User.findById(BuyerId);
    if (!existingUser) {
      return res.status(404).json("User Not Found");
    }
    console.log(quantity);

    const product = await Product.findById(_id);
    const newProduct = {
      id: _id,
      title: product.title,
      price: product.price,
      path: product.path,
      quantity: quantity,
      productType: product.productType,
    };
    const purchasedItem = existingUser.Purchased.find(
      (item) => item.id === _id
    );
    if (purchasedItem) {
      purchasedItem.quantity += quantity;
    } else {
      existingUser.Purchased.push(newProduct);
    }

    // Update user's purchased items
    await existingUser.save();

    // Update product stock and sold quantities
    if (product.stock >= quantity) {
      product.stock -= quantity;
      product.sold += quantity;
      await product.save();
    }

    res.json("OK");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
};

const Restock = async (req, res) => {
  const { itemId, restockBy } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: itemId },
      { $set: { stock: restockBy } },
      { new: true }
    );
    res.json("Send");
    if (!product) {
      console.log("Product not found");
    } else {
      console.log("Product updated successfully");
    }
    console.log(product.stock);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const BuyAll = async (req, res) => {
  try {
    const { myCart, userId } = req.body;
    console.log(myCart);

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      console.log("User Not Found");
      return res.status(404).json("User not found");
    }

    for (const item of myCart) {
      if (item.quantity === 0) {
        continue;
      }
      const _id = item._id;
      const quantity = item.quantity;

      const product = await Product.findById(_id);
      if (!product) {
        console.log(`Product with ID ${_id} not found`);
        continue;
      }
      if (product.stock === 0) {
        continue;
      }

      const NewProduct = {
        id: _id,
        title: product.title,
        price: product.price,
        path: product.path,
        quantity,
        productType: product.productType,
      };

      let found = false;
      for (const purchasedItem of existingUser.Purchased) {
        if (purchasedItem.id === _id) {
          purchasedItem.quantity += quantity;
          found = true;
          break;
        }
      }

      if (!found) {
        existingUser.Purchased.push(NewProduct);
      }

      await existingUser.save();

      if (product.stock >= quantity) {
        product.stock -= quantity;
        product.sold += quantity;
        await product.save();
      }
    }
    res.json("OK");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports.Signup = Signup;
module.exports.Login = Login;
module.exports.Profile = Profile;
module.exports.AddToCart = AddToCart;
module.exports.RemoveCartItem = RemoveCartItem;
module.exports.BuyItem = BuyItem;
module.exports.Restock = Restock;
module.exports.DeleteItem = DeleteItem;
module.exports.MyListing = MyListing;
module.exports.NewListing = NewListing;
module.exports.MyCart = MyCart;
module.exports.AllProducts = AllProducts;
module.exports.BuyAll = BuyAll;
module.exports.UserInformation = UserInformation;
