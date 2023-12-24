import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";

const Item = ({ item, handlePurchase, inCart }) => {
  const { title, path, price, ram, storage, stock, userId, _id } = item;
  const { username, id } = useContext(userContext);
  const [quantity, setQuantity] = useState(1);
  const [inStock, setInStock] = useState(stock);
  const [outOfStock, setOutOfStock] = useState(stock === 0 ? true : false);
  const [disableButtons, setDisableButtons] = useState(false);

  const truncateTitle = (title, maxLetters) => {
    if (title.length <= maxLetters) {
      return title;
    }
    return title.slice(0, maxLetters) + "...";
  };

  const handleBuy = async () => {
    console.log("buy");
    const data = {
      totalPrice: quantity * price,
      BuyerId: id,
      _id,
      quantity,
      stock,
    };
    setDisableButtons(true);
    try {
      const response = await axios.patch("/buyProduct", data);
      if (response.status === 200) {
        setInStock((prevStock) => prevStock - quantity);
        setQuantity(1);
        handlePurchase();
        if (inStock - 1 === 0) {
          setOutOfStock(true);
          return;
        }
      }
    } catch {
    } finally {
      setDisableButtons(false);
    }
  };

  useEffect(() => {
    if (inStock === 0) {
      setOutOfStock(true);
    }
  }, [inStock]);

  const handleIncrease = () => {
    if (quantity === inStock) {
      console.log("here");
      return;
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (1 < quantity) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const handleAddToCart = async () => {
    console.log("Sending");
    let data = {
      userId: id,
      itemId: item._id,
    };
    setDisableButtons(true);
    try {
      await axios.post("/addToCart", data);
      handlePurchase("Item Added To Cart");
    } catch (error) {
      handlePurchase("Error Occured Item not Added in Cart");
    } finally {
      setDisableButtons(false);
    }
  };

  return (
    <div
      className={`
      
      flex flex-col border  items-center
      ${outOfStock ? "border-red-200" : "border-gray-300"}
      hover:shadow-[0px_0px_16px_0px_${outOfStock ? "#ff6961" : "#a0aec0"}]
      hover:bg-${outOfStock ? "red-50" : "gray-50"}
       overflow-hidden
        
    `}
      style={{ minWidth: "300px", width: `${300}px`, height: `${500}px` }}
    >
      <img
        className="p-2 border-b-2 rounded-lg object-cover"
        src={`http://localhost:3000/${path}`}
        alt="Product"
        width={250}
      />

      {
        <div className="flex flex-col  ">
          <h2 className="text-lg text-center font-semibold text-gray-800 truncate">
            {truncateTitle(title, 20)}
          </h2>
          <div className="flex gap-2  justify-center text-gray-700 ">
            <p className="text-center  ">
              <span className=" font-semibold">RAM</span> - {ram}GB
            </p>
            <p className="text-center">
              <span className=" font-semibold">Storage - </span>
              {storage}GB
            </p>
          </div>
          <p className="text-center">In Stock - {inStock}</p>

          <div className="flex items-center justify-center space-x-2">
            <button onClick={handleDecrease} className="quantity-btn">
              -
            </button>
            <span className="text-lg">{quantity}</span>
            <button onClick={handleIncrease} className="quantity-btn">
              +
            </button>
          </div>

          {!outOfStock ? (
            <div className="flex  items-center  justify-center gap-4 p-2  ">
              <button
                disabled={disableButtons}
                onClick={handleAddToCart}
                className={`action-btn ${
                  disableButtons
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-bold py-1 px-2 rounded`}
              >
                Add to Cart
              </button>
              <button
                disabled={disableButtons}
                onClick={handleBuy}
                className={`action-btn ${
                  disableButtons
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-1 px-2 rounded`}
              >
                Buy Now: ${price * quantity}
              </button>
            </div>
          ) : (
            <h2 className=" flex justify-center items-center mt-2 border-2 border-red-400 text-xl  font-semibold tracking-wider text-red-500 ">
              Out Of Stock
            </h2>
          )}
        </div>
      }
    </div>
  );
};

export default Item;
