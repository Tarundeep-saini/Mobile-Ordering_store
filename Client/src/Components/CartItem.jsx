import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";
const CartItem = ({
  item,
  updateTotalPrice,
  handleRemoveItem,
  handleNotifiaction,
  setmyCart,
  buyAll,
  myCart,
}) => {
  const { title, _id, price, userId, path, stock } = item;
  const [inStock, setInStock] = useState(stock);
  const { username, id } = useContext(userContext);
  const [outOfStock, setOutOfStock] = useState(stock === 0 ? true : false);
  const [quantity, setQuantity] = useState(!outOfStock ? 1 : 0);

  useEffect(() => {
    setQuantity(!outOfStock ? 1 : 0);
  }, [item]);

  const handleRemove = async () => {
    const data = { userId, id: _id };
    try {
      const response = await axios.patch("/removeCartItem", data);
      if (response.statusText === "OK") {
        const removedPrice = quantity * price;
        updateTotalPrice(-removedPrice);
        handleRemoveItem(_id);
        handleNotifiaction("Item Removed From Cart");
      }
    } catch (error) {}
  };
  const handleBuy = async () => {
    const data = {
      totalPrice: quantity * price,
      BuyerId: id,
      _id,
      quantity,
      stock,
    };

    const response = await axios.patch("/buyProduct", data);
    if (response.status === 200) {
      setInStock((prevStock) => prevStock - quantity);
      setQuantity(1);
      handleNotifiaction("Thank You For The Purchase");
      if (inStock - 1 === 0) {
        setOutOfStock(true);
        return;
      }
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity + 1 <= stock) {
      setQuantity(quantity + 1);
      item["quantity"] = quantity + 1;
      updateTotalPrice(price);
    }
  };
  const handleDecreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      item["quantity"] = quantity - 1;
      let indexReplace = myCart.findIndex((item) => item._id === _id);
      updateTotalPrice(-price);
    }
  };

  return (
    <div
      className={
        "flex border rounded p-2 mb-2 min-w-[22rem] max-w-[22rem] bg-gray-50  " +
        (outOfStock
          ? " border-2 border-red-200 hover:bg-red-50 hover:shadow-[0px_0px_16px_0px_#ff6961] "
          : "border-2 hover:bg-gray-50  hover:shadow-[0px_0px_16px_0px_#a0aec0]")
      }
    >
      <div className=" w-3/5  flex   ">
        <div className="flex flex-col items-center justify-center ">
          <img
            src={"http://localhost:3000/" + path}
            alt={title}
            className="rounded object-cover mr-2"
          />
          <div className="flex flex-col items-center justify-center gap-2 ">
            <h2 className="text-md text-center font-semibold">{title}</h2>
            <p className="text-md text-center  ">₹{price}</p>
          </div>
        </div>
      </div>
      <div className="w-2/5 flex flex-col align-middle items-center justify-center gap-2">
        {!outOfStock && (
          <div>
            <h3>
              InStock : <span>{stock}</span>
            </h3>
            <h2 className="text-center">Quantity</h2>
            <div className="flex gap-2">
              <button
                className="px-2 border rounded"
                onClick={handleDecreaseQuantity}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="px-2 border rounded"
                onClick={handleIncreaseQuantity}
              >
                +
              </button>
            </div>
          </div>
        )}
        {outOfStock && (
          <div className="w-full flex justify-center items-center py-1  bg-red-100 text-gray-600 ">
            Item Out of Stock
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="px-2 py-1 border border-red-600 rounded text-red-600 hover:bg-red-600 hover:text-white transition duration-300"
            onClick={handleRemove}
          >
            Remove
          </button>
          {!outOfStock && (
            <button
              className="px-2 py-1 border border-green-600 rounded text-green-600 hover:bg-green-600 hover:text-white transition duration-300"
              onClick={() => {
                handleBuy();
              }}
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
