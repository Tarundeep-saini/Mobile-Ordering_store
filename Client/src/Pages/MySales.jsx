import axios from "axios";
import React, { useEffect, useState } from "react";
import SoldItem from "../Components/SoldItem";

const MySales = () => {
  const [sales, setSales] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/getProducts");
        setSales(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    let totalSold = 0;

    if (sales && sales.length > 0) {
      totalSold = sales.reduce((accumulator, item) => {
        return accumulator + item.sold * item.price;
      }, 0);
    }
    setTotalEarnings(totalSold);
    console.log(totalSold);
  }, [sales]);

  return (
    <div className="p-5">
      <h2 className="text-center text-2xl pb-5">
        These Are The Items You Have Sold:
      </h2>
      <h2 className="text-center text-xl pb-5">
        Your Total Earnings : {totalEarnings}$
      </h2>

      <div className="flex flex-wrap gap-5">
        {sales && sales.length > 0 ? (
          sales.map((item) => <SoldItem key={item._id} item={item} />)
        ) : (
          <div>You Have No Sales</div>
        )}
      </div>
    </div>
  );
};

export default MySales;
