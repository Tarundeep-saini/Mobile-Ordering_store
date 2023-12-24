import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";
import CartItem from "../Components/CartItem";
import Item from "../Components/Item";

const MyCart = () => {
  const { id } = useContext(userContext);
  const [myCart, setmyCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState([]);
  const buyAll = null;

  const handleNotifiaction = (mess) => {
    setMessage(mess);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleRemoveItem = async (cartItemId) => {
    console.log(cartItemId);
    const data = { userId: id, id: cartItemId };
    try {
      await axios.patch("/removeCartItem", data);
      const filteredCart = myCart.filter((item) => item._id !== cartItemId);
      setmyCart(filteredCart);
    } catch (error) {}
  };

  const updateTotalPrice = (priceChange) => {
    setTotal((prevTotalPrice) => prevTotalPrice + priceChange);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("myCart/" + id);
        data.forEach((item) => {
          item.quantity = 1;
        });
        setmyCart(data);
      } catch (error) {
        console.error("An error occurred while fetching the cart:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    let allItems = [];
    myCart.forEach((item) => {
      if (item.stock !== 0) {
        allItems = [...allItems, item];
        totalPrice += item.price;
      }
    });
    setTotal(totalPrice);
  }, [myCart]);

  const handleBuyAll = async () => {
    const data = {
      myCart,
      userId: id,
    };
    try {
      const response = await axios.post("buyall", data);
      handleNotifiaction("All The Items In Cart Are Purchased");
      setmyCart((prevMyCart) => {
        return prevMyCart.map((item) => ({
          ...item,
          stock: item.stock - item.quantity,
        }));
      });
      myCart([]);
    } catch (error) {
      handleNotifiaction("Error Occured ");
    }
  };

  return (
    <div className="max-w-screen pt-4 min-h-screen bg-gradient-to-tr from-blue-50 to-yellow-50 ">
      <h1 className="text-center text-2xl font-bold my-4">My Cart</h1>

      <div className="flex justify-center items-center gap-5 ">
        <h3 className="text-center font-semibold text-lg">
          <span>Total: ₹</span>
          <span className="">{total.toFixed(2)}</span>
        </h3>
        <button
          className="px-3 py-1 text-lg border-2 text-blue-500 border-blue-400 rounded-md hover:bg-blue-400 hover:text-white "
          onClick={() => handleBuyAll()}
        >
          Buy All Items
        </button>
      </div>
      <div className=" flex items-center justify-center min-h-[4rem]  w-full text-center p-3 ">
        {message && (
          <p className="  font-extrabold text-green-500 border-2 border-green-500 px-4 py-1 ">
            {message}
          </p>
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-4 pt-0 p-4  ">
        {myCart.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            setmyCart={setmyCart}
            myCart={myCart}
            buyAll={buyAll}
            updateTotalPrice={updateTotalPrice}
            handleRemoveItem={handleRemoveItem}
            handleNotifiaction={handleNotifiaction}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCart;
