import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-context";
import PurchasedItem from "./PurchasedItem";

const Purchased = () => {
  const { id } = useContext(userContext);
  const [purchasedItem, setPurchasedItem] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("userInfo/" + id);
        setPurchasedItem(response.data.user.Purchased);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);
  return (
    <div className="flex  flex-wrap  gap-2 p-7">
      {purchasedItem.length > 0
        ? purchasedItem.map((item) => {
            return <PurchasedItem key={item._id} item={item} />;
          })
        : "You Hvae No Purchase History"}
    </div>
  );
};

export default Purchased;
